import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { getUserContext, createDataAccessFilter, requireAuth } from '@/lib/user-context'
import { z } from 'zod'

// Validation schema for documents
const createDocumentSchema = z.object({
  name: z.string().min(1, 'Document name is required'),
  type: z.enum(['PITCH_DECK', 'FINANCIAL_STATEMENTS', 'BUSINESS_PLAN', 'LEGAL_DOCUMENTS', 'MARKET_RESEARCH', 'TEAM_PROFILE', 'OTHER']),
  url: z.string().url('Valid URL is required'),
  size: z.number().optional(),
  mimeType: z.string().optional(),
  ventureId: z.string().min(1, 'Venture ID is required'),
})

const updateDocumentSchema = createDocumentSchema.partial()

// GET /api/documents - List documents
export async function GET(request: NextRequest) {
  try {
    // Get user context for data access control
    const userContext = await getUserContext()
    if (!userContext) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const search = searchParams.get('search') || ''
    const type = searchParams.get('type') || ''
    const ventureId = searchParams.get('ventureId') || ''

    const skip = (page - 1) * limit

    // Create data access filter based on user context
    const dataAccessFilter = createDataAccessFilter(userContext)
    const baseWhere = dataAccessFilter.documents

    // Build where clause with user access control
    const where: any = {
      AND: [baseWhere]
    }

    // Add search filters
    if (search) {
      where.AND.push({
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
        ]
      })
    }
    if (type) where.AND.push({ type })
    if (ventureId) where.AND.push({ ventureId })

    const [documents, total] = await Promise.all([
      prisma.document.findMany({
        where,
        include: {
          venture: {
            select: { id: true, name: true, sector: true, createdBy: { select: { organization: true } } }
          }
        },
        orderBy: { uploadedAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.document.count({ where })
    ])

    return NextResponse.json({
      documents,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching documents:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/documents - Create new document
export async function POST(request: NextRequest) {
  try {
    // Get user context for data access control
    const userContext = await getUserContext()
    if (!userContext) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = createDocumentSchema.parse(body)

    // Check if venture exists and user has access to it
    const dataAccessFilter = createDataAccessFilter(userContext)
    const venture = await prisma.venture.findFirst({
      where: {
        AND: [
          { id: validatedData.ventureId },
          dataAccessFilter.ventures
        ]
      },
      select: { id: true, name: true }
    })

    if (!venture) {
      return NextResponse.json({ error: 'Venture not found or access denied' }, { status: 404 })
    }

    // Create document
    const document = await prisma.document.create({
      data: validatedData,
      include: {
        venture: {
          select: { id: true, name: true, sector: true }
        }
      }
    })

    // Create activity log
    await prisma.activity.create({
      data: {
        ventureId: validatedData.ventureId,
        userId: user.id,
        type: 'DOCUMENT_UPLOADED',
        title: 'Document Uploaded',
        description: `Document "${document.name}" (${document.type}) was uploaded for ${venture.name}`,
        metadata: {
          documentId: document.id,
          documentType: document.type,
          documentName: document.name,
          type: 'document_uploaded'
        }
      }
    })

    return NextResponse.json(document, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }
    console.error('Error creating document:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}