"use client"

import React, { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function DebugUserPage() {
  const { data: session, status } = useSession()
  const [ventures, setVentures] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchVentures = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const timestamp = new Date().getTime()
      const response = await fetch(`/api/ventures?limit=100&_t=${timestamp}`, {
        cache: 'no-cache',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache'
        }
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch ventures: ${response.status}`)
      }

      const data = await response.json()
      setVentures(data.ventures || [])
      console.log('🔍 Fetched ventures:', data.ventures)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch ventures')
      console.error('❌ Error fetching ventures:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (status === 'authenticated') {
      fetchVentures()
    }
  }, [status])

  if (status === 'loading') {
    return <div className="p-8">Loading authentication...</div>
  }

  if (status === 'unauthenticated') {
    return <div className="p-8">Please sign in to view this debug page.</div>
  }

  return (
    <div className="container mx-auto p-8 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>🔍 User Debug Information</CardTitle>
          <CardDescription>Current session and access control debug info</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold text-lg mb-2">Current User Session:</h3>
            <div className="bg-gray-100 p-4 rounded-md">
              <p><strong>Name:</strong> {session?.user?.name || 'N/A'}</p>
              <p><strong>Email:</strong> {session?.user?.email || 'N/A'}</p>
              <p><strong>ID:</strong> {(session?.user as any)?.id || 'N/A'}</p>
              <p><strong>Role:</strong> {(session?.user as any)?.role || 'N/A'}</p>
              <p><strong>Organization:</strong> {(session?.user as any)?.organization || 'N/A'}</p>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-lg">Accessible Ventures ({ventures.length}):</h3>
              <Button onClick={fetchVentures} disabled={loading}>
                {loading ? 'Refreshing...' : 'Refresh Ventures'}
              </Button>
            </div>
            
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                Error: {error}
              </div>
            )}

            <div className="space-y-2">
              {ventures.map((venture, index) => (
                <div key={venture.id} className="bg-gray-100 p-3 rounded-md">
                  <p><strong>{index + 1}. {venture.name}</strong> ({venture.sector})</p>
                  <p className="text-sm text-gray-600">
                    Created by: {venture.createdBy?.name} ({venture.createdBy?.email})
                  </p>
                  <p className="text-sm text-gray-600">
                    Creator Organization: {venture.createdBy?.organization || 'N/A'}
                  </p>
                </div>
              ))}
              {ventures.length === 0 && !loading && (
                <p className="text-gray-500">No ventures accessible to current user.</p>
              )}
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-md">
            <h4 className="font-semibold mb-2">Expected Behavior:</h4>
            <ul className="text-sm space-y-1">
              <li>• <strong>User "h" (harshit)</strong> should see <strong>2 ventures</strong> from TechCorp Solutions</li>
              <li>• <strong>Admin "H arya"</strong> should see <strong>6 ventures</strong> from Deakin MIV</li>
              <li>• Users should only see ventures from their own organization</li>
            </ul>
          </div>

          <div className="mt-4">
            <p className="text-xs text-gray-500">
              Last refresh: {new Date().toLocaleTimeString()}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

