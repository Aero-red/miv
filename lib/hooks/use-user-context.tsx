"use client"

import { useSession } from "next-auth/react"
import React, { useState, useEffect, createContext, useContext } from "react"

interface UserContextType {
  user: {
    id: string
    name: string
    email: string
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
  loading: boolean
  error: string | null
}

const UserContext = createContext<UserContextType | null>(null)

export function UserContextProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()
  const [userContext, setUserContext] = useState<UserContextType | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchUserContext() {
      if (status === "loading") return
      
      if (!session?.user?.id) {
        setUserContext(null)
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)
        
        const response = await fetch(`/api/users/${session.user.id}`)
        if (!response.ok) {
          throw new Error('Failed to fetch user context')
        }
        
        const userData = await response.json()
        
        const permissions = userData.permissions || {}
        
        setUserContext({
          user: {
            id: userData.id,
            name: userData.name,
            email: userData.email,
            role: userData.role,
            organization: userData.organization,
            permissions,
          },
          organization: userData.organization,
          isAdmin: userData.role === 'ADMIN',
          isManager: ['ADMIN', 'MANAGER'].includes(userData.role),
          canManageUsers: permissions.canManageUsers || ['ADMIN', 'MANAGER'].includes(userData.role),
          canCreateVentures: permissions.canCreateVentures || ['ADMIN', 'MANAGER', 'VENTURE_MANAGER'].includes(userData.role),
          canViewReports: permissions.canViewReports || ['ADMIN', 'MANAGER', 'ANALYST'].includes(userData.role),
          canManageFunds: permissions.canManageFunds || ['ADMIN', 'MANAGER', 'CAPITAL_FACILITATOR'].includes(userData.role),
          loading: false,
          error: null,
        })
      } catch (err) {
        console.error('Error fetching user context:', err)
        setError(err instanceof Error ? err.message : 'Failed to load user context')
      } finally {
        setLoading(false)
      }
    }

    fetchUserContext()
  }, [session, status])

  return (
    <UserContext.Provider value={userContext ? { ...userContext, loading, error } : null}>
      {children}
    </UserContext.Provider>
  )
}

export function useUserContext() {
  const context = useContext(UserContext)
  
  if (!context) {
    throw new Error('useUserContext must be used within a UserContextProvider')
  }
  
  return context
}

export function useUserPermissions() {
  const context = useUserContext()
  
  return {
    canManageUsers: context.canManageUsers,
    canCreateVentures: context.canCreateVentures,
    canViewReports: context.canViewReports,
    canManageFunds: context.canManageFunds,
    isAdmin: context.isAdmin,
    isManager: context.isManager,
  }
}

export function useOrganizationContext() {
  const context = useUserContext()
  
  return {
    organization: context.organization,
    isOrganizationMember: !!context.organization,
    isCrossOrganization: context.isAdmin, // Admins can see cross-organization data
  }
}
