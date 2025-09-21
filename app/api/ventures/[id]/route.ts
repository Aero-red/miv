import { NextRequest, NextResponse } from 'next/server'
import { getUserContext, createDataAccessFilter } from '@/lib/user-context'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// Validation schema for venture updates
const updateVentureSchema = z.object({
  name: z.string().min(1, 'Venture name is required').optional(),
  sector: z.string().min(1, 'Sector is required').optional(),
  location: z.string().min(1, 'Location is required').optional(),
  contactEmail: z.string().email('Valid email is required').optional(),
  contactPhone: z.string().optional(),
  pitchSummary: z.string().optional(),
  inclusionFocus: z.string().optional(),
  founderTypes: z.array(z.string()).optional(),
  teamSize: z.string().optional(),
  foundingYear: z.string().optional(),
  targetMarket: z.string().optional(),
  revenueModel: z.string().optional(),
  operationalReadiness: z.record(z.any()).optional(),
  capitalReadiness: z.record(z.any()).optional(),
  gedsiGoals: z.array(z.string()).optional(),
  washingtonShortSet: z.record(z.any()).optional(),
  disabilityInclusion: z.record(z.any()).optional(),
  challenges: z.string().optional(),
  supportNeeded: z.string().optional(),
  timeline: z.string().optional(),
  stage: z.enum(['INTAKE', 'SCREENING', 'DUE_DILIGENCE', 'INVESTMENT_READY', 'FUNDED', 'EXITED', 'SEED', 'SERIES_A', 'SERIES_B', 'SERIES_C']).optional(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'ARCHIVED']).optional(),
  assignedToId: z.string().optional(),
})

// GET /api/ventures/[id] - Get single venture
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params

    // Get user context for data access control
    const userContext = await getUserContext()
    if (!userContext) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Create data access filter
    const dataAccessFilter = createDataAccessFilter(userContext)

    const venture = await prisma.venture.findFirst({
      where: {
        id,
        ...dataAccessFilter.ventures
      },
      include: {
        createdBy: {
          select: { id: true, name: true, email: true, organization: true }
        },
        assignedTo: {
          select: { id: true, name: true, email: true, organization: true }
        },
        gedsiMetrics: {
          include: {
            createdBy: {
              select: { name: true, email: true }
            }
          }
        },
        documents: {
          orderBy: { uploadedAt: 'desc' }
        },
        activities: {
          include: {
            user: {
              select: { name: true, email: true }
            }
          },
          orderBy: { createdAt: 'desc' },
          take: 50
        },
        capitalActivities: {
          orderBy: { createdAt: 'desc' }
        },
        projects: {
          include: {
            lead: {
              select: { name: true, email: true }
            },
            members: {
              select: { name: true, email: true }
            }
          }
        },
        _count: {
          select: {
            documents: true,
            activities: true,
            capitalActivities: true,
            gedsiMetrics: true,
            projects: true,
          }
        }
      }
    })

    if (!venture) {
      return NextResponse.json(
        { error: 'Venture not found or access denied' },
        { status: 404 }
      )
    }

    return NextResponse.json(venture)
  } catch (error) {
    console.error('Error fetching venture:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT /api/ventures/[id] - Update venture
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params

    // Get user context and check permissions
    const userContext = await getUserContext()
    if (!userContext) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Create data access filter
    const dataAccessFilter = createDataAccessFilter(userContext)

    // Check if venture exists and user has access
    const existingVenture = await prisma.venture.findFirst({
      where: {
        id,
        ...dataAccessFilter.ventures
      }
    })

    if (!existingVenture) {
      return NextResponse.json(
        { error: 'Venture not found or access denied' },
        { status: 404 }
      )
    }

    // Check if user can edit this venture
    const canEdit = 
      existingVenture.createdById === userContext.user.id ||
      existingVenture.assignedToId === userContext.user.id ||
      userContext.isAdmin

    if (!canEdit) {
      return NextResponse.json(
        { error: 'Forbidden - You can only edit ventures you created or are assigned to' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const validatedData = updateVentureSchema.parse(body)

    // Prepare update data
    const updateData: any = { ...validatedData }
    
    // Handle founder types if provided
    if (validatedData.founderTypes) {
      updateData.founderTypes = JSON.stringify(validatedData.founderTypes)
    }

    // Update venture
    const updatedVenture = await prisma.venture.update({
      where: { id },
      data: updateData,
      include: {
        createdBy: {
          select: { id: true, name: true, email: true, organization: true }
        },
        assignedTo: {
          select: { id: true, name: true, email: true, organization: true }
        },
        gedsiMetrics: true,
        documents: true,
        activities: {
          include: {
            user: {
              select: { name: true, email: true }
            }
          },
          orderBy: { createdAt: 'desc' },
          take: 10
        },
        _count: {
          select: {
            documents: true,
            activities: true,
            capitalActivities: true,
            gedsiMetrics: true,
          }
        }
      }
    })

    // Create activity log
    await prisma.activity.create({
      data: {
        ventureId: id,
        userId: userContext.user.id,
        type: 'VENTURE_UPDATED',
        title: 'Venture Updated',
        description: `Venture "${updatedVenture.name}" was updated`,
        metadata: {
          updatedFields: Object.keys(validatedData),
          type: 'venture_update'
        }
      }
    })

    return NextResponse.json(updatedVenture)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }
    console.error('Error updating venture:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE /api/ventures/[id] - Delete venture
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params

    // Get user context and check permissions
    const userContext = await getUserContext()
    if (!userContext) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Only admins can delete ventures
    if (!userContext.isAdmin) {
      return NextResponse.json(
        { error: 'Forbidden - Only administrators can delete ventures' },
        { status: 403 }
      )
    }

    // Check if venture exists
    const venture = await prisma.venture.findUnique({
      where: { id },
      select: { id: true, name: true, createdById: true }
    })

    if (!venture) {
      return NextResponse.json(
        { error: 'Venture not found' },
        { status: 404 }
      )
    }

    // Delete venture (cascade will handle related records)
    await prisma.venture.delete({
      where: { id }
    })

    // Create activity log
    await prisma.activity.create({
      data: {
        userId: userContext.user.id,
        type: 'NOTE_ADDED',
        title: 'Venture Deleted',
        description: `Venture "${venture.name}" was deleted by administrator`,
        metadata: {
          deletedVentureId: id,
          type: 'venture_deleted'
        }
      }
    })

    return NextResponse.json({ message: 'Venture deleted successfully' })
  } catch (error) {
    console.error('Error deleting venture:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}