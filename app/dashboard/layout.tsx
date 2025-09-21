"use client"

import React from "react"
import { Sidebar } from "@/components/sidebar"
import { MobileNav } from "@/components/mobile-nav"
import { Breadcrumb } from "@/components/breadcrumb"
import { UserContextProvider } from "@/lib/hooks/use-user-context"
import { AuthGuard } from "@/components/auth-guard"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (
    <AuthGuard requireAuth={true}>
      <UserContextProvider>
        <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 dark:from-slate-900 dark:via-slate-950 dark:to-blue-950 transition-colors duration-300">
          {/* Desktop Sidebar */}
          <div className="hidden lg:block">
            <Sidebar />
          </div>

          {/* Mobile Navigation */}
          <div className="lg:hidden fixed top-4 left-4 z-50">
            <MobileNav />
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col min-w-0 lg:ml-64">
            <div className="p-4 lg:p-6">
              <Breadcrumb />
              {children}
            </div>
          </div>

          {/* Fixed Notifications */}
          <div className="fixed top-4 right-4 z-50 space-y-2">
            {/* Add notification components here */}
          </div>
        </div>
      </UserContextProvider>
    </AuthGuard>
  )
}