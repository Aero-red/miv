import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'

export interface UserContext {
  user: {
    id: string
    email: string
    name: string
    role: string
    organization?: string
    permissions?: any
  }
  organization?: string
  isAdmin: boolean
  isManager: boolean
  canManageUsers: boolean
  canCreateVentures: boolean
  canViewReports: boolean
  canManageFunds: boolean
  canViewAllData: boolean
  canCrossOrganizationAccess: boolean
}

export async function getUserContext(): Promise<UserContext | null> {
  try {
    const session = await getServerSession(authOptions)
    
    // If no session, do not fallback to admin. Enforce auth strictly.
    if (!session?.user?.id) {
      return null
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        organization: true,
        permissions: true,
      }
    })

    if (!user) {
      return null
    }

    const permissions = user.permissions as any || {}
    
    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name || '',
        role: user.role,
        organization: user.organization,
        permissions,
      },
      organization: user.organization,
      isAdmin: user.role === 'ADMIN',
      isManager: ['ADMIN', 'MANAGER'].includes(user.role),
      canManageUsers: permissions.canManageUsers || ['ADMIN', 'MANAGER'].includes(user.role),
      canCreateVentures: permissions.canCreateVentures || ['ADMIN', 'MANAGER', 'VENTURE_MANAGER'].includes(user.role),
      canViewReports: permissions.canViewReports || ['ADMIN', 'MANAGER', 'ANALYST'].includes(user.role),
      canManageFunds: permissions.canManageFunds || ['ADMIN', 'MANAGER', 'CAPITAL_FACILITATOR'].includes(user.role),
      canViewAllData: user.role === 'ADMIN',
      canCrossOrganizationAccess: user.role === 'ADMIN',
    }
  } catch (error) {
    console.error('Error getting user context:', error)
    return null
  }
}

export function createDataAccessFilter(userContext: UserContext) {
  const { user, organization, isAdmin, canCrossOrganizationAccess } = userContext

  // Base access patterns
  const userOwnedAccess = [
    { createdById: user.id },
    { assignedToId: user.id }
  ]

  const organizationAccess = organization && !canCrossOrganizationAccess ? [
    { createdBy: { organization: organization } },
    { assignedTo: { organization: organization } }
  ] : []

  const adminAccess = isAdmin ? [{}] : []

  return {
    // For ventures - organization-based access (including admins)
    ventures: {
      OR: [
        ...userOwnedAccess,
        ...organizationAccess
      ]
    },
    
    // For projects - users can see projects they lead, are members of, or within their organization
    projects: {
      OR: [
        { leadId: user.id },
        { members: { some: { id: user.id } } },
        ...(organization ? [{ 
          lead: { organization: organization } 
        }] : [])
      ]
    },
    
    // For team members - users can see members in their organization
    teamMembers: organization ? { organization } : {},
    
    // For activities - users can see activities for ventures they have access to
    activities: {
      OR: [
        { userId: user.id },
        { venture: { createdById: user.id } },
        { venture: { assignedToId: user.id } },
        ...(organization ? [{ 
          venture: { 
            createdBy: { organization: organization } 
          } 
        }] : [])
      ]
    },
    
    // For notifications - users can only see their own notifications
    notifications: {
      userId: user.id
    },
    
    // For GEDSI metrics - users can see metrics for ventures they have access to
    gedsiMetrics: {
      OR: [
        { venture: { createdById: user.id } },
        { venture: { assignedToId: user.id } },
        ...(organization ? [{ 
          venture: { 
            createdBy: { organization: organization } 
          } 
        }] : [])
      ]
    },
    
    // For documents - users can see documents for ventures they have access to
    documents: {
      OR: [
        { venture: { createdById: user.id } },
        { venture: { assignedToId: user.id } },
        ...(organization ? [{ 
          venture: { 
            createdBy: { organization: organization } 
          } 
        }] : [])
      ]
    },

    // For capital activities - users can see activities for ventures they have access to
    capitalActivities: {
      OR: [
        { venture: { createdById: user.id } },
        { venture: { assignedToId: user.id } },
        ...(organization ? [{ 
          venture: { 
            createdBy: { organization: organization } 
          } 
        }] : [])
      ]
    },

    // For funds - organization-based access
    funds: {
      OR: [
        { managerId: user.id },
        ...(organization ? [{ 
          manager: { organization: organization } 
        }] : [])
      ]
    },

    // For reports - users can see reports they created or within their organization
    reports: {
      OR: [
        { createdBy: user.id },
        ...(organization ? [{ 
          creator: { organization: organization } 
        }] : [])
      ]
    },

    // For custom dashboards - users can see their own or shared with them
    customDashboards: {
      OR: [
        { createdById: user.id },
        { sharedWith: { some: { id: user.id } } },
        { isPublic: true },
        ...(organization ? [{ 
          createdBy: { organization: organization } 
        }] : [])
      ]
    }
  }
}

export function requireAuth(handler: (userContext: UserContext) => Promise<Response>) {
  return async () => {
    const userContext = await getUserContext()
    
    if (!userContext) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { 
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }
    
    return handler(userContext)
  }
}

export function requirePermission(permission: keyof UserContext) {
  return function(handler: (userContext: UserContext) => Promise<Response>) {
    return async () => {
      const userContext = await getUserContext()
      
      if (!userContext) {
        return new Response(
          JSON.stringify({ error: 'Unauthorized' }),
          { 
            status: 401,
            headers: { 'Content-Type': 'application/json' }
          }
        )
      }
      
      if (!userContext[permission]) {
        return new Response(
          JSON.stringify({ error: 'Forbidden - Insufficient permissions' }),
          { 
            status: 403,
            headers: { 'Content-Type': 'application/json' }
          }
        )
      }
      
      return handler(userContext)
    }
  }
}

export function requireRole(roles: string[]) {
  return function(handler: (userContext: UserContext) => Promise<Response>) {
    return async () => {
      const userContext = await getUserContext()
      
      if (!userContext) {
        return new Response(
          JSON.stringify({ error: 'Unauthorized' }),
          { 
            status: 401,
            headers: { 'Content-Type': 'application/json' }
          }
        )
      }
      
      if (!roles.includes(userContext.user.role)) {
        return new Response(
          JSON.stringify({ error: 'Forbidden - Insufficient role permissions' }),
          { 
            status: 403,
            headers: { 'Content-Type': 'application/json' }
          }
        )
      }
      
      return handler(userContext)
    }
  }
}
