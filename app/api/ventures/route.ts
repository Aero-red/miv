import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { AIServices } from '@/lib/ai-services';
import { triggerVentureRecalculation } from '@/lib/calculation-service';
import { getUserContext, createDataAccessFilter, requireAuth, requirePermission } from '@/lib/user-context';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { z } from 'zod';

// Validation schemas
// Relaxed validation to allow partial submissions; server will fill defaults
const createVentureSchema = z.object({
  name: z.union([z.string(), z.undefined()]).optional(),
  sector: z.union([z.string(), z.undefined()]).optional(),
  location: z.union([z.string(), z.undefined()]).optional(),
  contactEmail: z.union([z.string().email().or(z.literal('')), z.undefined()]).optional(),
  contactPhone: z.string().optional(),
  pitchSummary: z.string().optional(),
  inclusionFocus: z.string().optional(),

  founderTypes: z.array(z.string()).optional(),
  // Accept strings from the form but we will coerce to numbers server-side
  teamSize: z.union([z.string(), z.number()]).optional(),
  foundingYear: z.union([z.string(), z.number()]).optional(),
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
});

const updateVentureSchema = createVentureSchema.partial();

// GET /api/ventures - List ventures with filtering
export async function GET(request: NextRequest) {
  try {
    // Get user context for data access control
    const userContext = await getUserContext();
    if (!userContext) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Debug logging
    console.log(`🔍 Ventures API called by: ${userContext.user.name} (${userContext.user.email})`);
    console.log(`   Organization: ${userContext.organization}`);
    console.log(`   Role: ${userContext.user.role}`);

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const sector = searchParams.get('sector') || '';
    const stage = searchParams.get('stage') || '';
    const status = searchParams.get('status') || '';

    const skip = (page - 1) * limit;

    // Create data access filter based on user context
    const dataAccessFilter = createDataAccessFilter(userContext);
    const baseWhere = dataAccessFilter.ventures;

    // Build where clause with user access control
    const where: any = {
      AND: [baseWhere]
    };

    // Add search filters
    if (search) {
      where.AND.push({
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { sector: { contains: search, mode: 'insensitive' } },
          { location: { contains: search, mode: 'insensitive' } },
        ]
      });
    }
    if (sector) where.AND.push({ sector });
    if (stage) where.AND.push({ stage });
    if (status) where.AND.push({ status });

    const [ventures, total] = await Promise.all([
      prisma.venture.findMany({
        where,
        include: {
          createdBy: {
            select: { name: true, email: true }
          },
          assignedTo: {
            select: { name: true, email: true }
          },
          gedsiMetrics: true,
          documents: {
            orderBy: { uploadedAt: 'desc' },
            take: 5
          },
          activities: {
            include: {
              user: {
                select: { name: true, email: true }
              }
            },
            orderBy: { createdAt: 'desc' },
            take: 10
          },
          capitalActivities: {
            orderBy: { createdAt: 'desc' }
          },
          _count: {
            select: {
              documents: true,
              activities: true,
              capitalActivities: true,
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.venture.count({ where })
    ]);

    // Debug logging
    console.log(`📊 Returning ${ventures.length} ventures for ${userContext.user.name}`);

    return NextResponse.json({
      ventures,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching ventures:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/ventures - Create new venture
export async function POST(request: NextRequest) {
  try {
    // Get user context and check permissions
    const userContext = await getUserContext();
    if (!userContext) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!userContext.canCreateVentures) {
      return NextResponse.json({ error: 'Forbidden - Insufficient permissions to create ventures' }, { status: 403 });
    }

    const body = await request.json();
    const validatedData = createVentureSchema.parse(body);
    console.log('📝 Incoming venture payload:', body)

    // Coerce teamSize and foundingYear to numbers compatible with Prisma schema
    function parseTeamSizeToNumber(value: unknown): number | null {
      if (typeof value === 'number') return value
      if (typeof value !== 'string') return null
      if (value.includes('+')) {
        const base = parseInt(value.replace('+', '').trim(), 10)
        return Number.isFinite(base) ? base : null
      }
      if (value.includes('-')) {
        const parts = value.split('-').map(v => parseInt(v.trim(), 10)).filter(n => Number.isFinite(n))
        if (parts.length === 2) {
          // Use the upper bound as representative team size
          return parts[1]
        }
      }
      const asInt = parseInt(value.trim(), 10)
      return Number.isFinite(asInt) ? asInt : null
    }

    function parseYearToNumber(value: unknown): number | null {
      if (typeof value === 'number') return value
      if (typeof value !== 'string') return null
      const asInt = parseInt(value.trim(), 10)
      return Number.isFinite(asInt) ? asInt : null
    }

    const teamSizeNumber = parseTeamSizeToNumber(validatedData.teamSize as any)
    const foundingYearNumber = parseYearToNumber(validatedData.foundingYear as any)

    // Defaults for required prisma fields
    const safeName = (validatedData.name && String(validatedData.name).trim()) || 'Untitled Venture'
    const safeSector = (validatedData.sector && String(validatedData.sector).trim()) || 'Other'
    const safeLocation = (validatedData.location && String(validatedData.location).trim()) || 'Unknown'
    const safeEmail = (validatedData.contactEmail && String(validatedData.contactEmail).trim()) || userContext.user.email || 'noreply@example.com'
    const founderTypesArray = Array.isArray(validatedData.founderTypes) ? validatedData.founderTypes : []

    // Create venture
    const venture = await prisma.venture.create({
      data: {
        // Basic fields
        name: safeName,
        sector: safeSector,
        location: safeLocation,
        contactEmail: safeEmail,
        contactPhone: validatedData.contactPhone,
        pitchSummary: validatedData.pitchSummary,
        inclusionFocus: validatedData.inclusionFocus,
        // Coerced numeric fields
        teamSize: teamSizeNumber ?? undefined,
        foundingYear: foundingYearNumber ?? undefined,
        // Business fields
        targetMarket: validatedData.targetMarket,
        revenueModel: validatedData.revenueModel,
        website: (validatedData as any).website || undefined,
        description: (validatedData as any).description || undefined,
        revenue: (validatedData as any).revenue ? Number((validatedData as any).revenue) : undefined,
        fundingRaised: (validatedData as any).fundingRaised ? Number((validatedData as any).fundingRaised) : undefined,
        lastValuation: (validatedData as any).lastValuation ? Number((validatedData as any).lastValuation) : undefined,
        tags: (validatedData as any).tags || undefined,
        intakeDate: (validatedData as any).intakeDate ? new Date((validatedData as any).intakeDate) : undefined,
        screeningDate: (validatedData as any).screeningDate ? new Date((validatedData as any).screeningDate) : undefined,
        dueDiligenceStart: (validatedData as any).dueDiligenceStart ? new Date((validatedData as any).dueDiligenceStart) : undefined,
        dueDiligenceEnd: (validatedData as any).dueDiligenceEnd ? new Date((validatedData as any).dueDiligenceEnd) : undefined,
        investmentReadyAt: (validatedData as any).investmentReadyAt ? new Date((validatedData as any).investmentReadyAt) : undefined,
        nextReviewAt: (validatedData as any).nextReviewAt ? new Date((validatedData as any).nextReviewAt) : undefined,
        status: (validatedData as any).status || undefined,
        stage: (validatedData as any).stage || undefined,
        operationalReadiness: validatedData.operationalReadiness as any,
        capitalReadiness: validatedData.capitalReadiness as any,
        gedsiGoals: validatedData.gedsiGoals as any,
        // Store founderTypes as JSON string to match existing logic
        founderTypes: JSON.stringify(founderTypesArray),
        createdById: userContext.user.id,
        assignedToId: (validatedData as any).assignedToId || undefined,
      } as any,
      include: {
        createdBy: {
          select: { name: true, email: true }
        },
        gedsiMetrics: true,
      }
    });

    // Trigger initial calculations for the new venture
    triggerVentureRecalculation(venture.id).catch(err => console.error('calc error', err));

    // Note: background AI activity logs are disabled to avoid duplicate entries.

    // Create activity log
    await prisma.activity.create({
      data: {
        ventureId: venture.id,
        userId: userContext.user.id,
        type: 'VENTURE_CREATED',
        title: 'Venture Created',
        description: `New venture "${venture.name}" was created`,
      }
    });

    return NextResponse.json(venture, { status: 201 });
  } catch (error) {
    console.error('❌ Venture create error:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 