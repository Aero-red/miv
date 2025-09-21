"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  User, 
  Mail, 
  Building, 
  Shield, 
  Bell, 
  Calendar,
  Activity,
  Edit,
  Save,
  X,
  CheckCircle,
  AlertCircle
} from "lucide-react"

interface UserProfile {
  id: string
  name: string
  email: string
  role: string
  organization?: string
  image?: string
  emailVerified?: Date | null
  notificationPreferences: {
    email: boolean
    inApp: boolean
    weeklyDigest: boolean
    ventureUpdates: boolean
    teamUpdates: boolean
    systemAlerts: boolean
  }
  permissions: {
    canCreateVentures: boolean
    canManageUsers: boolean
    canViewReports: boolean
    canManageFunds: boolean
  }
  createdAt: Date
  updatedAt: Date
  _count: {
    ledProjects: number
    projectMemberships: number
    assignedTasks: number
    createdVentures: number
    assignedVentures: number
    notifications: number
  }
  activities: Array<{
    id: string
    type: string
    title: string
    description?: string
    createdAt: Date
    venture?: {
      id: string
      name: string
    }
  }>
}

export function UserProfile() {
  const { data: session } = useSession()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState({
    name: '',
    email: '',
    organization: '',
    notificationPreferences: {
      email: true,
      inApp: true,
      weeklyDigest: false,
      ventureUpdates: true,
      teamUpdates: true,
      systemAlerts: true,
    }
  })

  useEffect(() => {
    if (session?.user?.id) {
      fetchProfile()
    }
  }, [session])

  const fetchProfile = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/users/${session?.user?.id}`)
      if (!response.ok) throw new Error('Failed to fetch profile')
      
      const data = await response.json()
      setProfile(data)
      setEditData({
        name: data.name || '',
        email: data.email || '',
        organization: data.organization || '',
        notificationPreferences: data.notificationPreferences || {
          email: true,
          inApp: true,
          weeklyDigest: false,
          ventureUpdates: true,
          teamUpdates: true,
          systemAlerts: true,
        }
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load profile')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!session?.user?.id) return
    
    try {
      setSaving(true)
      setError(null)
      
      const response = await fetch(`/api/users/${session.user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update profile')
      }

      const updatedProfile = await response.json()
      setProfile(updatedProfile)
      setIsEditing(false)
      setSuccess('Profile updated successfully')
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    setEditData({
      name: profile?.name || '',
      email: profile?.email || '',
      organization: profile?.organization || '',
      notificationPreferences: profile?.notificationPreferences || {
        email: true,
        inApp: true,
        weeklyDigest: false,
        ventureUpdates: true,
        teamUpdates: true,
        systemAlerts: true,
      }
    })
    setIsEditing(false)
    setError(null)
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'ADMIN': return 'bg-red-100 text-red-800'
      case 'MANAGER': return 'bg-blue-100 text-blue-800'
      case 'ANALYST': return 'bg-green-100 text-green-800'
      case 'VENTURE_MANAGER': return 'bg-purple-100 text-purple-800'
      case 'GEDSI_ANALYST': return 'bg-orange-100 text-orange-800'
      case 'CAPITAL_FACILITATOR': return 'bg-teal-100 text-teal-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
      </div>
    )
  }

  if (!profile) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>Failed to load user profile</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">User Profile</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage your account settings and preferences</p>
        </div>
        <Button
          onClick={() => setIsEditing(!isEditing)}
          variant={isEditing ? "outline" : "default"}
          className="flex items-center gap-2"
        >
          {isEditing ? <X className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
          {isEditing ? "Cancel" : "Edit Profile"}
        </Button>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">{success}</AlertDescription>
        </Alert>
      )}
      
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Information */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={profile.image || "/placeholder.svg"} alt={profile.name} />
                  <AvatarFallback className="bg-teal-100 text-teal-700 text-2xl font-bold">
                    {profile.name?.split(" ").map(n => n[0]).join("") || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge className={getRoleColor(profile.role)}>
                      {profile.role.replace('_', ' ')}
                    </Badge>
                    {profile.emailVerified && (
                      <Badge variant="outline" className="text-green-600 border-green-600">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Verified
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">
                    Member since {formatDate(profile.createdAt)}
                  </p>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={isEditing ? editData.name : profile.name}
                    onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={isEditing ? editData.email : profile.email}
                    onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="organization">Organization</Label>
                  <Input
                    id="organization"
                    value={isEditing ? editData.organization : profile.organization || ''}
                    onChange={(e) => setEditData({ ...editData, organization: e.target.value })}
                    disabled={!isEditing}
                    placeholder="Your organization"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Role</Label>
                  <div className="p-2 bg-gray-50 rounded-md">
                    <Badge className={getRoleColor(profile.role)}>
                      {profile.role.replace('_', ' ')}
                    </Badge>
                  </div>
                </div>
              </div>

              {isEditing && (
                <div className="flex gap-2 pt-4">
                  <Button onClick={handleSave} disabled={saving} className="flex items-center gap-2">
                    <Save className="h-4 w-4" />
                    {saving ? "Saving..." : "Save Changes"}
                  </Button>
                  <Button onClick={handleCancel} variant="outline">
                    Cancel
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Notification Preferences */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notification Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Email Notifications</Label>
                    <p className="text-sm text-gray-600">Receive notifications via email</p>
                  </div>
                  <Switch
                    checked={isEditing ? editData.notificationPreferences.email : profile.notificationPreferences.email}
                    onCheckedChange={(checked) => 
                      setEditData({
                        ...editData,
                        notificationPreferences: { ...editData.notificationPreferences, email: checked }
                      })
                    }
                    disabled={!isEditing}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>In-App Notifications</Label>
                    <p className="text-sm text-gray-600">Show notifications in the app</p>
                  </div>
                  <Switch
                    checked={isEditing ? editData.notificationPreferences.inApp : profile.notificationPreferences.inApp}
                    onCheckedChange={(checked) => 
                      setEditData({
                        ...editData,
                        notificationPreferences: { ...editData.notificationPreferences, inApp: checked }
                      })
                    }
                    disabled={!isEditing}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Weekly Digest</Label>
                    <p className="text-sm text-gray-600">Receive weekly summary emails</p>
                  </div>
                  <Switch
                    checked={isEditing ? editData.notificationPreferences.weeklyDigest : profile.notificationPreferences.weeklyDigest}
                    onCheckedChange={(checked) => 
                      setEditData({
                        ...editData,
                        notificationPreferences: { ...editData.notificationPreferences, weeklyDigest: checked }
                      })
                    }
                    disabled={!isEditing}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Venture Updates</Label>
                    <p className="text-sm text-gray-600">Get notified about venture changes</p>
                  </div>
                  <Switch
                    checked={isEditing ? editData.notificationPreferences.ventureUpdates : profile.notificationPreferences.ventureUpdates}
                    onCheckedChange={(checked) => 
                      setEditData({
                        ...editData,
                        notificationPreferences: { ...editData.notificationPreferences, ventureUpdates: checked }
                      })
                    }
                    disabled={!isEditing}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Team Updates</Label>
                    <p className="text-sm text-gray-600">Get notified about team activities</p>
                  </div>
                  <Switch
                    checked={isEditing ? editData.notificationPreferences.teamUpdates : profile.notificationPreferences.teamUpdates}
                    onCheckedChange={(checked) => 
                      setEditData({
                        ...editData,
                        notificationPreferences: { ...editData.notificationPreferences, teamUpdates: checked }
                      })
                    }
                    disabled={!isEditing}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>System Alerts</Label>
                    <p className="text-sm text-gray-600">Receive important system notifications</p>
                  </div>
                  <Switch
                    checked={isEditing ? editData.notificationPreferences.systemAlerts : profile.notificationPreferences.systemAlerts}
                    onCheckedChange={(checked) => 
                      setEditData({
                        ...editData,
                        notificationPreferences: { ...editData.notificationPreferences, systemAlerts: checked }
                      })
                    }
                    disabled={!isEditing}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Activity Summary */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Activity Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{profile._count.ledProjects}</div>
                  <div className="text-sm text-blue-800">Projects Led</div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{profile._count.assignedTasks}</div>
                  <div className="text-sm text-green-800">Tasks Assigned</div>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{profile._count.createdVentures}</div>
                  <div className="text-sm text-purple-800">Ventures Created</div>
                </div>
                <div className="text-center p-3 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">{profile._count.notifications}</div>
                  <div className="text-sm text-orange-800">Notifications</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Permissions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {profile.permissions.canCreateVentures && (
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Create Ventures</span>
                </div>
              )}
              {profile.permissions.canManageUsers && (
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Manage Users</span>
                </div>
              )}
              {profile.permissions.canViewReports && (
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">View Reports</span>
                </div>
              )}
              {profile.permissions.canManageFunds && (
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Manage Funds</span>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {profile.activities.length > 0 ? (
                  profile.activities.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-3 p-2 rounded-lg bg-gray-50">
                      <div className="w-2 h-2 bg-teal-600 rounded-full mt-2"></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                        {activity.venture && (
                          <p className="text-xs text-gray-600">Venture: {activity.venture.name}</p>
                        )}
                        <p className="text-xs text-gray-500">{formatDate(activity.createdAt)}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 text-center">No recent activity</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

