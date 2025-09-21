import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// Validation schema for team events
const createEventSchema = z.object({
  title: z.string().min(1, 'Event title is required'),
  description: z.string().optional(),
  date: z.string().min(1, 'Event date is required'),
  time: z.string().optional(),
  location: z.string().optional(),
  isAllDay: z.boolean().default(false),
  isRecurring: z.boolean().default(false),
  recurrence: z.object({
    frequency: z.string(),
    interval: z.number(),
    daysOfWeek: z.array(z.number()).optional(),
  }).optional(),
  attendeeIds: z.array(z.string()).optional().default([]),
})

const updateEventSchema = createEventSchema.partial()

// GET /api/team/events - List team events
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const search = searchParams.get('search') || ''
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {}
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { location: { contains: search, mode: 'insensitive' } },
      ]
    }
    if (startDate && endDate) {
      where.date = {
        gte: new Date(startDate),
        lte: new Date(endDate)
      }
    } else if (startDate) {
      where.date = { gte: new Date(startDate) }
    } else if (endDate) {
      where.date = { lte: new Date(endDate) }
    }

    const [events, total] = await Promise.all([
      prisma.teamEvent.findMany({
        where,
        include: {
          organizer: {
            select: { id: true, name: true, email: true }
          },
          attendees: {
            select: { id: true, name: true, email: true }
          },
          _count: {
            select: { attendees: true }
          }
        },
        orderBy: { date: 'asc' },
        skip,
        take: limit,
      }),
      prisma.teamEvent.count({ where })
    ])

    return NextResponse.json({
      events,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching events:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/team/events - Create new team event
export async function POST(request: NextRequest) {
  try {
    // Disable authentication for development
    // const session = await getServerSession()
    // if (!session?.user) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    // }

    const body = await request.json()
    const validatedData = createEventSchema.parse(body)

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

    // Extract attendee IDs for connection
    const { attendeeIds, ...eventData } = validatedData

    // Create event
    const event = await prisma.teamEvent.create({
      data: {
        ...eventData,
        date: new Date(eventData.date),
        organizerId: user.id,
        attendees: {
          connect: attendeeIds.map(id => ({ id }))
        }
      },
      include: {
        organizer: {
          select: { id: true, name: true, email: true }
        },
        attendees: {
          select: { id: true, name: true, email: true }
        },
        _count: {
          select: { attendees: true }
        }
      }
    })

    // Create activity log
    await prisma.activity.create({
      data: {
        userId: user.id,
        type: 'NOTE_ADDED',
        title: 'Team Event Created',
        description: `New team event "${event.title}" was scheduled for ${event.date.toLocaleDateString()}`,
        metadata: {
          eventId: event.id,
          type: 'event_created',
          attendeeCount: attendeeIds.length
        }
      }
    })

    return NextResponse.json(event, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }
    console.error('Error creating event:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}