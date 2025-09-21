"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Loader2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface AuthGuardProps {
  children: React.ReactNode
  requireAuth?: boolean
  allowedRoles?: string[]
  fallbackUrl?: string
}

export function AuthGuard({ 
  children, 
  requireAuth = true, 
  allowedRoles = [], 
  fallbackUrl = "/auth/login" 
}: AuthGuardProps) {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (requireAuth && status === "unauthenticated") {
      router.push(fallbackUrl)
    }
  }, [status, requireAuth, router, fallbackUrl])

  // Show loading state
  if (requireAuth && status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <Loader2 className="h-6 w-6 animate-spin" />
              Loading...
            </CardTitle>
            <CardDescription>
              Verifying your authentication status
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  // Show unauthorized state
  if (requireAuth && status === "unauthenticated") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>
              You need to be signed in to access this page
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-sm text-muted-foreground">
              Redirecting to login page...
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Check role-based access
  if (requireAuth && allowedRoles.length > 0 && session?.user) {
    const userRole = (session.user as any).role
    if (!allowedRoles.includes(userRole)) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <CardTitle>Access Denied</CardTitle>
              <CardDescription>
                You don't have the required permissions to access this page
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-sm text-muted-foreground">
                Required roles: {allowedRoles.join(", ")}
              </p>
            </CardContent>
          </Card>
        </div>
      )
    }
  }

  return <>{children}</>
}

