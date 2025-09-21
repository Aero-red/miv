import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// Validation schema for announcements
const createAnnouncementSchema = z.object({
  title: z.string().min(1, 'Announcement title is required'),
  content: z.string().min(1, 'Announcement content is required'),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).default('MEDIUM'),
  isActive: z.boolean().default(true),
  expiresAt: z.string().optional(),
})

const updateAnnouncementSchema = createAnnouncementSchema.partial()

// GET /api/team/announcements - List announcements
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const priority = searchParams.get('priority') || ''
    const isActive = searchParams.get('isActive')

    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {}
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
      ]
    }
    if (priority) where.priority = priority
    if (isActive !== null && isActive !== undefined) {
      where.isActive = isActive === 'true'
    }

    const [announcements, total] = await Promise.all([
      prisma.announcement.findMany({
        where,
        include: {
          author: {
            select: { id: true, name: true, email: true, role: true }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.announcement.count({ where })
    ])

    return NextResponse.json({
      announcements,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching announcements:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/team/announcements - Create new announcement
export async function POST(request: NextRequest) {
  try {
    // Disable authentication for development
    // const session = await getServerSession()
    // if (!session?.user) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    // }

    const body = await request.json()
    const validatedData = createAnnouncementSchema.parse(body)

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

    // Create announcement
    const announcement = await prisma.announcement.create({
      data: {
        ...validatedData,
        expiresAt: validatedData.expiresAt ? new Date(validatedData.expiresAt) : null,
        authorId: user.id,
      },
      include: {
        author: {
          select: { id: true, name: true, email: true, role: true }
        }
      }
    })

    // Create activity log
    await prisma.activity.create({
      data: {
        userId: user.id,
        type: 'NOTE_ADDED',
        title: 'Announcement Created',
        description: `New announcement "${announcement.title}" was published`,
        metadata: {
          announcementId: announcement.id,
          type: 'announcement_created',
          priority: announcement.priority
        }
      }
    })

    return NextResponse.json(announcement, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }
    console.error('Error creating announcement:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}