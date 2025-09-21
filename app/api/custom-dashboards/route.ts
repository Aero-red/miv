import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// Validation schema for custom dashboards
const createDashboardSchema = z.object({
  name: z.string().min(1, 'Dashboard name is required'),
  description: z.string().optional(),
  category: z.string().min(1, 'Category is required'),
  widgets: z.object({
    layout: z.array(z.any()).optional().default([]),
    theme: z.string().optional().default('light'),
    refreshInterval: z.number().optional().default(60),
  }).default({}),
  isPublic: z.boolean().default(false),
  isFavorite: z.boolean().default(false),
  tags: z.array(z.string()).optional().default([]),
  sharedWithIds: z.array(z.string()).optional().default([]),
})

const updateDashboardSchema = createDashboardSchema.partial()

// GET /api/custom-dashboards - List custom dashboards
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const category = searchParams.get('category') || ''
    const isPublic = searchParams.get('isPublic')
    const isFavorite = searchParams.get('isFavorite')

    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {}
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ]
    }
    if (category && category !== 'all') where.category = category
    if (isPublic !== null && isPublic !== undefined) {
      where.isPublic = isPublic === 'true'
    }
    if (isFavorite !== null && isFavorite !== undefined) {
      where.isFavorite = isFavorite === 'true'
    }

    const [dashboards, total] = await Promise.all([
      prisma.customDashboard.findMany({
        where,
        include: {
          createdBy: {
            select: { id: true, name: true, email: true }
          },
          sharedWith: {
            select: { id: true, name: true, email: true }
          }
        },
        orderBy: { updatedAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.customDashboard.count({ where })
    ])

    return NextResponse.json({
      dashboards,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching custom dashboards:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/custom-dashboards - Create new custom dashboard
export async function POST(request: NextRequest) {
  try {
    // Disable authentication for development
    // const session = await getServerSession()
    // if (!session?.user) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    // }

    const body = await request.json()
    const validatedData = createDashboardSchema.parse(body)

    // Get user ID from session (for development, use first user)
    let user = await prisma.user.findFirst()
    if (!user) {
      user = await prisma.user.create({
        data: {
          name: 'Development User',
          email: 'dev@miv.com',
          role: 'ADMIN'
        }
      })
    }

    // Extract shared user IDs for connection
    const { sharedWithIds, ...dashboardData } = validatedData

    // Create dashboard
    const dashboard = await prisma.customDashboard.create({
      data: {
        ...dashboardData,
        createdById: user.id,
        sharedWith: {
          connect: sharedWithIds.map(id => ({ id }))
        }
      },
      include: {
        createdBy: {
          select: { id: true, name: true, email: true }
        },
        sharedWith: {
          select: { id: true, name: true, email: true }
        }
      }
    })

    // Create activity log
    await prisma.activity.create({
      data: {
        userId: user.id,
        type: 'NOTE_ADDED',
        title: 'Custom Dashboard Created',
        description: `New custom dashboard "${dashboard.name}" was created in category "${dashboard.category}"`,
        metadata: {
          dashboardId: dashboard.id,
          type: 'dashboard_created',
          category: dashboard.category,
          isPublic: dashboard.isPublic
        }
      }
    })

    return NextResponse.json(dashboard, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }
    console.error('Error creating dashboard:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}