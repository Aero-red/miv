import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// Validation schema for tasks
const createTaskSchema = z.object({
  name: z.string().min(1, 'Task name is required'),
  description: z.string().optional(),
  status: z.enum(['TODO', 'IN_PROGRESS', 'REVIEW', 'COMPLETED', 'CANCELLED']).default('TODO'),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).default('MEDIUM'),
  dueDate: z.string().optional(),
  estimatedHours: z.number().optional(),
  projectId: z.string().min(1, 'Project ID is required'),
  assignedToId: z.string().optional(),
  notes: z.string().optional(),
})

const updateTaskSchema = createTaskSchema.partial()

// GET /api/team/tasks - List tasks
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const search = searchParams.get('search') || ''
    const status = searchParams.get('status') || ''
    const priority = searchParams.get('priority') || ''
    const projectId = searchParams.get('projectId') || ''
    const assignedToId = searchParams.get('assignedToId') || ''

    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {}
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ]
    }
    if (status) where.status = status
    if (priority) where.priority = priority
    if (projectId) where.projectId = projectId
    if (assignedToId) where.assignedToId = assignedToId

    const [tasks, total] = await Promise.all([
      prisma.task.findMany({
        where,
        include: {
          project: {
            select: { id: true, name: true, status: true }
          },
          assignedTo: {
            select: { id: true, name: true, email: true }
          },
          createdBy: {
            select: { id: true, name: true, email: true }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.task.count({ where })
    ])

    return NextResponse.json({
      tasks,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching tasks:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/team/tasks - Create new task
export async function POST(request: NextRequest) {
  try {
    // Disable authentication for development
    // const session = await getServerSession()
    // if (!session?.user) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    // }

    const body = await request.json()
    const validatedData = createTaskSchema.parse(body)

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

    // Create task
    const task = await prisma.task.create({
      data: {
        ...validatedData,
        dueDate: validatedData.dueDate ? new Date(validatedData.dueDate) : null,
        createdById: user.id,
      },
      include: {
        project: {
          select: { id: true, name: true, status: true }
        },
        assignedTo: {
          select: { id: true, name: true, email: true }
        },
        createdBy: {
          select: { id: true, name: true, email: true }
        }
      }
    })

    // Create activity log
    await prisma.activity.create({
      data: {
        userId: user.id,
        type: 'NOTE_ADDED',
        title: 'Task Created',
        description: `New task "${task.name}" was created in project "${task.project.name}"`,
        metadata: {
          taskId: task.id,
          projectId: task.projectId,
          type: 'task_created'
        }
      }
    })

    return NextResponse.json(task, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }
    console.error('Error creating task:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
