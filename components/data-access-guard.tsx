"use client"

import { useUserContext, useUserPermissions, useOrganizationContext } from "@/lib/hooks/use-user-context"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Lock, Shield } from "lucide-react"

interface DataAccessGuardProps {
  children: React.ReactNode
  requirePermission?: keyof ReturnType<typeof useUserPermissions>
  requireRole?: string[]
  fallback?: React.ReactNode
  showAccessDenied?: boolean
}

export function DataAccessGuard({ 
  children, 
  requirePermission,
  requireRole,
  fallback,
  showAccessDenied = true
}: DataAccessGuardProps) {
  const { loading, error } = useUserContext()
  const permissions = useUserPermissions()

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
      </div>
    )
  }

  // Show error state
  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Error loading user permissions: {error}
        </AlertDescription>
      </Alert>
    )
  }

  // Check role requirements
  if (requireRole && !requireRole.includes(permissions.role || '')) {
    if (fallback) return <>{fallback}</>
    
    if (!showAccessDenied) return null
    
    return (
      <Alert variant="destructive">
        <Shield className="h-4 w-4" />
        <AlertDescription>
          Access denied. This feature requires one of the following roles: {requireRole.join(', ')}
        </AlertDescription>
      </Alert>
    )
  }

  // Check permission requirements
  if (requirePermission && !permissions[requirePermission]) {
    if (fallback) return <>{fallback}</>
    
    if (!showAccessDenied) return null
    
    return (
      <Alert variant="destructive">
        <Lock className="h-4 w-4" />
        <AlertDescription>
          Access denied. You don't have permission to access this feature.
        </AlertDescription>
      </Alert>
    )
  }

  return <>{children}</>
}

interface OrganizationGuardProps {
  children: React.ReactNode
  allowCrossOrganization?: boolean
  fallback?: React.ReactNode
}

export function OrganizationGuard({ 
  children, 
  allowCrossOrganization = false,
  fallback
}: OrganizationGuardProps) {
  const { loading, error, organization } = useUserContext()
  const { isCrossOrganization } = useOrganizationContext()

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Error loading organization context: {error}
        </AlertDescription>
      </Alert>
    )
  }

  // If user has no organization and cross-organization is not allowed
  if (!organization && !allowCrossOrganization) {
    if (fallback) return <>{fallback}</>
    
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          This feature is only available to organization members.
        </AlertDescription>
      </Alert>
    )
  }

  // If user is admin or cross-organization is allowed
  if (isCrossOrganization || allowCrossOrganization) {
    return <>{children}</>
  }

  return <>{children}</>
}

// Utility hooks for conditional rendering
export function useCanAccess(permission?: keyof ReturnType<typeof useUserPermissions>, role?: string[]) {
  const { loading, error } = useUserContext()
  const permissions = useUserPermissions()

  if (loading || error) return false

  // Check role
  if (role && !role.includes(permissions.role || '')) return false

  // Check permission
  if (permission && !permissions[permission]) return false

  return true
}

export function useIsOrganizationMember() {
  const { organization } = useUserContext()
  const { isCrossOrganization } = useOrganizationContext()
  
  return !!organization || isCrossOrganization
}
