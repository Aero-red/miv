import { NextRequest, NextResponse } from 'next/server'
import { getUserContext, UserContext } from './user-context'

export interface AuthenticatedRequest extends NextRequest {
  userContext: UserContext
}

export type AuthenticatedHandler = (
  request: AuthenticatedRequest,
  context?: any
) => Promise<NextResponse>

export type AuthenticatedHandlerWithContext<T = any> = (
  request: AuthenticatedRequest,
  context: T
) => Promise<NextResponse>

/**
 * Middleware to require authentication for API routes
 */
export function withAuth(handler: AuthenticatedHandler) {
  return async (request: NextRequest, context?: any): Promise<NextResponse> => {
    try {
      const userContext = await getUserContext()
      
      if (!userContext) {
        return NextResponse.json(
          { error: 'Unauthorized - Authentication required' },
          { status: 401 }
        )
      }

      // Attach user context to request
      const authenticatedRequest = request as AuthenticatedRequest
      authenticatedRequest.userContext = userContext

      return await handler(authenticatedRequest, context)
    } catch (error) {
      console.error('Authentication middleware error:', error)
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      )
    }
  }
}

/**
 * Middleware to require specific permissions
 */
export function withPermission<T = any>(
  permission: keyof UserContext,
  handler: AuthenticatedHandlerWithContext<T>
) {
  return withAuth(async (request: AuthenticatedRequest, context: T) => {
    const { userContext } = request

    if (!userContext[permission]) {
      return NextResponse.json(
        { error: `Forbidden - ${permission} permission required` },
        { status: 403 }
      )
    }

    return await handler(request, context)
  })
}

/**
 * Middleware to require specific roles
 */
export function withRole<T = any>(
  roles: string[],
  handler: AuthenticatedHandlerWithContext<T>
) {
  return withAuth(async (request: AuthenticatedRequest, context: T) => {
    const { userContext } = request

    if (!roles.includes(userContext.user.role)) {
      return NextResponse.json(
        { error: `Forbidden - Required roles: ${roles.join(', ')}` },
        { status: 403 }
      )
    }

    return await handler(request, context)
  })
}

/**
 * Middleware to require organization access
 */
export function withOrganizationAccess<T = any>(
  handler: AuthenticatedHandlerWithContext<T>
) {
  return withAuth(async (request: AuthenticatedRequest, context: T) => {
    const { userContext } = request

    if (!userContext.organization && !userContext.isAdmin) {
      return NextResponse.json(
        { error: 'Forbidden - Organization access required' },
        { status: 403 }
      )
    }

    return await handler(request, context)
  })
}

/**
 * Utility function to extract user context from request
 */
export function getUserContextFromRequest(request: AuthenticatedRequest): UserContext {
  return request.userContext
}

/**
 * Utility function to check if user can access specific organization data
 */
export function canAccessOrganization(
  userContext: UserContext,
  targetOrganization?: string
): boolean {
  if (userContext.isAdmin || userContext.canCrossOrganizationAccess) {
    return true
  }

  if (!userContext.organization) {
    return false
  }

  return !targetOrganization || userContext.organization === targetOrganization
}

/**
 * Utility function to create organization-based filter
 */
export function createOrganizationFilter(userContext: UserContext, fieldName: string = 'organization') {
  if (userContext.isAdmin || userContext.canCrossOrganizationAccess) {
    return {}
  }

  if (!userContext.organization) {
    return { [fieldName]: null }
  }

  return { [fieldName]: userContext.organization }
}

