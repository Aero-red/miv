import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// Validation schema for user updates
const updateUserSchema = z.object({
  name: z.string().min(1, 'Name is required').optional(),
  email: z.string().email('Valid email is required').optional(),
  role: z.enum(['ADMIN', 'MANAGER', 'ANALYST', 'USER', 'VENTURE_MANAGER', 'GEDSI_ANALYST', 'CAPITAL_FACILITATOR', 'EXTERNAL_STAKEHOLDER']).optional(),
  organization: z.string().optional(),
  password: z.string().min(6, 'Password must be at least 6 characters').optional(),
  notificationPreferences: z.object({
    email: z.boolean().optional(),
    inApp: z.boolean().optional(),
    weeklyDigest: z.boolean().optional(),
    ventureUpdates: z.boolean().optional(),
    teamUpdates: z.boolean().optional(),
    systemAlerts: z.boolean().optional(),
  }).optional(),
})

// GET /api/users/[id] - Get single user
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        organization: true,
        image: true,
        emailVerified: true,
        notificationPreferences: true,
        permissions: true,
        createdAt: true,
        updatedAt: true,
        // Include activity summary
        _count: {
          select: {
            ledProjects: true,
            projectMemberships: true,
            assignedTasks: true,
            createdVentures: true,
            assignedVentures: true,
            notifications: true,
          }
        },
        // Include recent activities
        activities: {
          take: 5,
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            type: true,
            title: true,
            description: true,
            createdAt: true,
            venture: {
              select: {
                id: true,
                name: true,
              }
            }
          }
        }
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error('Error fetching user:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT /api/users/[id] - Update single user
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params
    const body = await request.json()
    const validatedData = updateUserSchema.parse(body)

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id }
    })

    if (!existingUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // If email is being changed, check for conflicts
    if (validatedData.email && validatedData.email !== existingUser.email) {
      const emailExists = await prisma.user.findUnique({
        where: { email: validatedData.email }
      })
      
      if (emailExists) {
        return NextResponse.json(
          { error: 'Email already exists' },
          { status: 409 }
        )
      }
    }

    // Prepare update data
    const updateData: any = { ...validatedData }
    
    // Handle password hashing
    if (validatedData.password) {
      const bcrypt = await import('bcryptjs')
      updateData.passwordHash = await bcrypt.hash(validatedData.password, 10)
      delete updateData.password
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        organization: true,
        image: true,
        emailVerified: true,
        notificationPreferences: true,
        permissions: true,
        createdAt: true,
        updatedAt: true,
      }
    })

    // Create activity log
    await prisma.activity.create({
      data: {
        userId: id,
        type: 'NOTE_ADDED',
        title: 'Profile Updated',
        description: `User profile was updated`,
        metadata: {
          updatedFields: Object.keys(validatedData),
          type: 'profile_update'
        }
      }
    })

    return NextResponse.json(updatedUser)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }
    console.error('Error updating user:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE /api/users/[id] - Delete single user
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Prevent deletion of last admin
    if (user.role === 'ADMIN') {
      const adminCount = await prisma.user.count({
        where: { role: 'ADMIN' }
      })
      
      if (adminCount <= 1) {
        return NextResponse.json(
          { error: 'Cannot delete the last admin user' },
          { status: 400 }
        )
      }
    }

    // Delete user (cascade will handle related records)
    await prisma.user.delete({
      where: { id }
    })

    // Create activity log
    await prisma.activity.create({
      data: {
        userId: id,
        type: 'NOTE_ADDED',
        title: 'User Deleted',
        description: `User "${user.name}" (${user.email}) was deleted`,
        metadata: {
          deletedUserId: id,
          deletedUserRole: user.role,
          type: 'user_deleted'
        }
      }
    })

    return NextResponse.json({ message: 'User deleted successfully' })
  } catch (error) {
    console.error('Error deleting user:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
