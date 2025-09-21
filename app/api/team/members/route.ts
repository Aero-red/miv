import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { getUserContext, createDataAccessFilter } from '@/lib/user-context'
import { withAuth, withPermission, AuthenticatedRequest } from '@/lib/api-middleware'
import { z } from 'zod'

// This endpoint returns users as "team members"
// GET /api/team/members - List team members (users)
export const GET = withAuth(async (request: AuthenticatedRequest) => {
  try {
    const { userContext } = request

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const search = searchParams.get('search') || ''
    const role = searchParams.get('role') || ''

    const skip = (page - 1) * limit

    // Create data access filter based on user context
    const dataAccessFilter = createDataAccessFilter(userContext)
    const baseWhere = dataAccessFilter.teamMembers

    // Build where clause with user access control
    const where: any = {
      AND: [baseWhere]
    }

    // Add search filters
    if (search) {
      where.AND.push({
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
          { organization: { contains: search, mode: 'insensitive' } },
        ]
      })
    }
    if (role) where.AND.push({ role })

    const [members, total] = await Promise.all([
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
          // Include actual relationships
          ledProjects: {
            select: { id: true, name: true, status: true }
          },
          projectMemberships: {
            select: { id: true, name: true, status: true }
          },
          assignedTasks: {
            select: { id: true, name: true, status: true, dueDate: true }
          },
          // Include project and task counts
          _count: {
            select: {
              ledProjects: true,
              assignedTasks: true,
              projectMemberships: true,
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.user.count({ where })
    ])

    // Return users with proper team member structure
    const teamMembers = members.map(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      organization: user.organization,
      status: 'active', // Default status
      joinDate: user.createdAt,
      lastLogin: user.updatedAt, // Use updatedAt as proxy for last login
      ledProjects: user.ledProjects,
      projectMemberships: user.projectMemberships,
      assignedTasks: user.assignedTasks,
      _count: user._count,
    }))

    return NextResponse.json({
      members: teamMembers,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching team members:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
})