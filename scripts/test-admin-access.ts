#!/usr/bin/env tsx

/**
 * Test admin user access to verify they can see all ventures
 */

import { prisma } from '../lib/prisma'
import { getUserContext, createDataAccessFilter } from '../lib/user-context'

async function testAdminAccess() {
  try {
    console.log('🔍 Testing admin access to ventures...')
    
    // Get the admin user
    const adminUser = await prisma.user.findUnique({
      where: { email: 'admin@miv.org' },
      select: { id: true, email: true, name: true, role: true, organization: true }
    })

    if (!adminUser) {
      console.log('❌ Admin user not found')
      return
    }

    console.log(`📋 Testing access for: ${adminUser.name} (${adminUser.email})`)
    console.log(`   Role: ${adminUser.role}`)
    console.log(`   Organization: ${adminUser.organization}`)

    // Create user context for admin
    const userContext = {
      user: {
        id: adminUser.id,
        email: adminUser.email,
        name: adminUser.name || '',
        role: adminUser.role,
        organization: adminUser.organization,
        permissions: {}
      },
      organization: adminUser.organization,
      isAdmin: adminUser.role === 'ADMIN',
      isManager: ['ADMIN', 'MANAGER'].includes(adminUser.role),
      canManageUsers: ['ADMIN', 'MANAGER'].includes(adminUser.role),
      canCreateVentures: ['ADMIN', 'MANAGER', 'VENTURE_MANAGER'].includes(adminUser.role),
      canViewReports: ['ADMIN', 'MANAGER', 'ANALYST'].includes(adminUser.role),
      canManageFunds: ['ADMIN', 'MANAGER', 'CAPITAL_FACILITATOR'].includes(adminUser.role),
      canViewAllData: adminUser.role === 'ADMIN',
      canCrossOrganizationAccess: adminUser.role === 'ADMIN',
    }

    console.log(`🔐 Admin can view all data: ${userContext.canViewAllData}`)

    // Create data access filter for admin (should be organization-based now)
    const dataAccessFilter = createDataAccessFilter(userContext)
    console.log(`🔐 Data access filter for admin:`, JSON.stringify(dataAccessFilter.ventures, null, 2))

    // Use the data access filter to see what admin can actually access
    const accessibleVentures = await prisma.venture.findMany({
      where: dataAccessFilter.ventures,
      select: {
        id: true,
        name: true,
        sector: true,
        createdBy: {
          select: { name: true, email: true, organization: true }
        }
      },
      orderBy: { name: 'asc' }
    })

    // Also get all ventures for comparison
    const allVentures = await prisma.venture.findMany({
      select: {
        id: true,
        name: true,
        sector: true,
        createdBy: {
          select: { name: true, email: true, organization: true }
        }
      },
      orderBy: { name: 'asc' }
    })

    console.log(`\n📊 Ventures accessible to admin ${adminUser.name}:`)
    console.log(`   Accessible ventures: ${accessibleVentures.length}`)
    console.log(`   Total ventures in system: ${allVentures.length}`)
    
    accessibleVentures.forEach((venture, index) => {
      console.log(`   ${index + 1}. ${venture.name} (${venture.sector})`)
      console.log(`      Created by: ${venture.createdBy.name} (${venture.createdBy.organization})`)
    })

    // Group accessible ventures by organization
    const accessibleVenturesByOrg = accessibleVentures.reduce((acc, venture) => {
      const org = venture.createdBy.organization || 'No Organization'
      if (!acc[org]) acc[org] = []
      acc[org].push(venture)
      return acc
    }, {} as Record<string, any[]>)

    console.log(`\n🏢 Accessible Ventures by Organization:`)
    Object.entries(accessibleVenturesByOrg).forEach(([org, ventures]) => {
      console.log(`   ${org}: ${ventures.length} ventures`)
      ventures.forEach(v => console.log(`     - ${v.name}`))
    })

    // Check if admin can see only their organization's data
    const adminOrgVentures = accessibleVentures.filter(v => v.createdBy.organization === adminUser.organization)
    const crossOrgVentures = accessibleVentures.filter(v => v.createdBy.organization !== adminUser.organization)
    
    console.log(`\n🔐 Access Control Summary:`)
    console.log(`   Admin's organization: ${adminUser.organization}`)
    console.log(`   Ventures in admin's org: ${adminOrgVentures.length}`)
    console.log(`   Ventures in other orgs: ${crossOrgVentures.length}`)
    
    if (crossOrgVentures.length === 0) {
      console.log(`✅ Admin can ONLY see ventures from their own organization (${adminUser.organization})`)
    } else {
      console.log(`❌ Admin can see ventures from other organizations - this should not happen!`)
      crossOrgVentures.forEach(v => {
        console.log(`   - ${v.name} (${v.createdBy.organization})`)
      })
    }

  } catch (error) {
    console.error('❌ Error testing admin access:', error)
  }
}

// Run the test
testAdminAccess()
  .then(() => {
    console.log('\n✅ Admin access test completed!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Admin access test failed:', error)
    process.exit(1)
  })
