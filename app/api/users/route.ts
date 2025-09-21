import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import bcrypt from 'bcryptjs'

// Validation schema for users
const createUserSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Valid email is required'),
  role: z.enum(['ADMIN', 'MANAGER', 'ANALYST', 'USER', 'VENTURE_MANAGER', 'GEDSI_ANALYST', 'CAPITAL_FACILITATOR', 'EXTERNAL_STAKEHOLDER']).default('USER'),
  organization: z.string().optional(),
  password: z.string().min(6, 'Password must be at least 6 characters').optional(),
})

const updateUserSchema = createUserSchema.partial()

// GET /api/users - List users
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const search = searchParams.get('search') || ''
    const role = searchParams.get('role') || ''

    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {}
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { organization: { contains: search, mode: 'insensitive' } },
      ]
    }
    if (role) where.role = role

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          organization: true,
          createdAt: true,
          updatedAt: true,
          // Don't return password hash
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.user.count({ where })
    ])

    return NextResponse.json({
      users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/users - Create new user
export async function POST(request: NextRequest) {
  try {
    // Disable authentication for development
    // const session = await getServerSession()
    // if (!session?.user) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    // }

    const body = await request.json()
    const validatedData = createUserSchema.parse(body)

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      )
    }

    // Hash password if provided
    let passwordHash = undefined
    if (validatedData.password) {
      passwordHash = await bcrypt.hash(validatedData.password, 10)
    }

    // Create user with enhanced data
    const { password, ...userData } = validatedData
    const user = await prisma.user.create({
      data: {
        ...userData,
        passwordHash,
        notificationPreferences: {
          email: true,
          inApp: true,
          weeklyDigest: false,
          ventureUpdates: true,
          teamUpdates: true,
          systemAlerts: true,
        },
        permissions: {
          canCreateVentures: ['ADMIN', 'MANAGER', 'VENTURE_MANAGER'].includes(userData.role),
          canManageUsers: ['ADMIN', 'MANAGER'].includes(userData.role),
          canViewReports: ['ADMIN', 'MANAGER', 'ANALYST'].includes(userData.role),
          canManageFunds: ['ADMIN', 'MANAGER', 'CAPITAL_FACILITATOR'].includes(userData.role),
        }
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        organization: true,
        createdAt: true,
        updatedAt: true,
        // Don't return password hash
      }
    })

    // Create welcome notification
    await prisma.notification.create({
      data: {
        userId: user.id,
        type: 'WELCOME',
        title: 'Welcome to MIV Platform',
        message: `Welcome ${user.name}! Your account has been created successfully.`,
        metadata: {
          welcomeMessage: true,
          onboardingRequired: true
        }
      }
    })

    // Get current user for activity log
    const currentUser = await prisma.user.findFirst()
    if (currentUser) {
      // Create activity log
      await prisma.activity.create({
        data: {
          userId: currentUser.id,
          type: 'NOTE_ADDED',
          title: 'User Created',
          description: `New user "${user.name}" (${user.email}) was added with role ${user.role}`,
          metadata: {
            newUserId: user.id,
            userRole: user.role,
            type: 'user_created'
          }
        }
      })
    }

    return NextResponse.json(user, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }
    console.error('Error creating user:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT /api/users - Update user
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...updateData } = body
    
    if (!id) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    const validatedData = updateUserSchema.parse(updateData)

    // Hash password if provided
    if (validatedData.password) {
      validatedData.password = await bcrypt.hash(validatedData.password, 10)
    }

    const { password, ...userData } = validatedData
    const updatePayload: any = { ...userData }
    
    if (password) {
      updatePayload.passwordHash = password
    }

    const user = await prisma.user.update({
      where: { id },
      data: updatePayload,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        organization: true,
        createdAt: true,
        updatedAt: true,
      }
    })

    return NextResponse.json(user)
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

// DELETE /api/users - Delete user
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Delete user (cascade will handle related records)
    await prisma.user.delete({
      where: { id }
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