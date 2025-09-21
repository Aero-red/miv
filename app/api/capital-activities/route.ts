import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// Validation schema for capital activities
const createCapitalActivitySchema = z.object({
  ventureId: z.string().min(1, 'Venture ID is required'),
  type: z.enum(['GRANT', 'DEBT', 'EQUITY', 'CONVERTIBLE_NOTE', 'OTHER']),
  amount: z.number().min(0, 'Amount must be positive').optional(),
  currency: z.string().default('USD'),
  status: z.enum(['PENDING', 'APPROVED', 'REJECTED', 'COMPLETED', 'CANCELLED']).default('PENDING'),
  description: z.string().optional(),
  date: z.string().optional(),
  investorName: z.string().optional(),
  terms: z.record(z.any()).optional(),
})

const updateCapitalActivitySchema = createCapitalActivitySchema.partial()

// GET /api/capital-activities - List capital activities
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const search = searchParams.get('search') || ''
    const type = searchParams.get('type') || ''
    const status = searchParams.get('status') || ''
    const ventureId = searchParams.get('ventureId') || ''

    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {}
    if (search) {
      where.OR = [
        { description: { contains: search, mode: 'insensitive' } },
        { investorName: { contains: search, mode: 'insensitive' } },
      ]
    }
    if (type) where.type = type
    if (status) where.status = status
    if (ventureId) where.ventureId = ventureId

    const [capitalActivities, total] = await Promise.all([
      prisma.capitalActivity.findMany({
        where,
        include: {
          venture: {
            select: { id: true, name: true, sector: true, location: true }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.capitalActivity.count({ where })
    ])

    return NextResponse.json({
      capitalActivities,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching capital activities:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/capital-activities - Create new capital activity
export async function POST(request: NextRequest) {
  try {
    // Disable authentication for development
    // const session = await getServerSession()
    // if (!session?.user) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    // }

    const body = await request.json()
    const validatedData = createCapitalActivitySchema.parse(body)

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

    // Check if venture exists
    const venture = await prisma.venture.findUnique({
      where: { id: validatedData.ventureId },
      select: { id: true, name: true }
    })

    if (!venture) {
      return NextResponse.json({ error: 'Venture not found' }, { status: 404 })
    }

    // Create capital activity
    const capitalActivity = await prisma.capitalActivity.create({
      data: {
        ...validatedData,
        date: validatedData.date ? new Date(validatedData.date) : new Date(),
      },
      include: {
        venture: {
          select: { id: true, name: true, sector: true, location: true }
        }
      }
    })

    // Create activity log
    await prisma.activity.create({
      data: {
        ventureId: validatedData.ventureId,
        userId: user.id,
        type: 'CAPITAL_ACTIVITY',
        title: 'Capital Activity Recorded',
        description: `${capitalActivity.type} activity of ${capitalActivity.amount ? `$${capitalActivity.amount.toLocaleString()}` : 'undisclosed amount'} recorded for ${venture.name}`,
        metadata: {
          capitalActivityId: capitalActivity.id,
          activityType: capitalActivity.type,
          amount: capitalActivity.amount,
          status: capitalActivity.status,
          type: 'capital_activity_created'
        }
      }
    })

    return NextResponse.json(capitalActivity, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }
    console.error('Error creating capital activity:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
