import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { getUserContext, createDataAccessFilter } from '@/lib/user-context'
import { z } from 'zod'

// Validation schema for projects
const createProjectSchema = z.object({
  name: z.string().min(1, 'Project name is required'),
  description: z.string().optional(),
  status: z.enum(['NOT_STARTED', 'IN_PROGRESS', 'COMPLETED', 'ON_HOLD', 'CANCELLED']).default('NOT_STARTED'),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).default('MEDIUM'),
  dueDate: z.string().optional(),
  startDate: z.string().optional(),
  budget: z.number().optional(),
  ventureId: z.string().optional(),
  leadId: z.string().min(1, 'Project lead is required'),
  memberIds: z.array(z.string()).optional().default([]),
})

const updateProjectSchema = createProjectSchema.partial()

// GET /api/team/projects - List projects
export async function GET(request: NextRequest) {
  try {
    // Get user context for data access control
    const userContext = await getUserContext()
    if (!userContext) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const status = searchParams.get('status') || ''
    const priority = searchParams.get('priority') || ''

    const skip = (page - 1) * limit

    // Create data access filter based on user context
    const dataAccessFilter = createDataAccessFilter(userContext)
    const baseWhere = dataAccessFilter.projects

    // Build where clause with user access control
    const where: any = {
      AND: [baseWhere]
    }

    // Add search filters
    if (search) {
      where.AND.push({
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
        ]
      })
    }
    if (status) where.AND.push({ status })
    if (priority) where.AND.push({ priority })

    const [projects, total] = await Promise.all([
      prisma.project.findMany({
        where,
        include: {
          lead: {
            select: { id: true, name: true, email: true }
          },
          members: {
            select: { id: true, name: true, email: true }
          },
          venture: {
            select: { id: true, name: true, sector: true }
          },
          tasks: {
            select: { id: true, name: true, status: true, priority: true, dueDate: true }
          },
          _count: {
            select: { tasks: true, members: true }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.project.count({ where })
    ])

    return NextResponse.json({
      projects,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching projects:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/team/projects - Create new project
export async function POST(request: NextRequest) {
  try {
    // Get user context and check permissions
    const userContext = await getUserContext()
    if (!userContext) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = createProjectSchema.parse(body)

    // Extract member IDs for connection
    const { memberIds, ...projectData } = validatedData

    // Create project
    const project = await prisma.project.create({
      data: {
        ...projectData,
        dueDate: projectData.dueDate ? new Date(projectData.dueDate) : null,
        startDate: projectData.startDate ? new Date(projectData.startDate) : null,
        members: {
          connect: memberIds.map(id => ({ id }))
        }
      },
      include: {
        lead: {
          select: { id: true, name: true, email: true }
        },
        members: {
          select: { id: true, name: true, email: true }
        },
        venture: {
          select: { id: true, name: true, sector: true }
        },
        tasks: {
          select: { id: true, name: true, status: true, priority: true, dueDate: true }
        },
        _count: {
          select: { tasks: true, members: true }
        }
      }
    })

    // Create activity log
    await prisma.activity.create({
      data: {
        userId: userContext.user.id,
        type: 'NOTE_ADDED',
        title: 'Project Created',
        description: `New project "${project.name}" was created`,
        metadata: {
          projectId: project.id,
          type: 'project_created'
        }
      }
    })

    return NextResponse.json(project, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }
    console.error('Error creating project:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}