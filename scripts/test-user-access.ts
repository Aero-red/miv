#!/usr/bin/env tsx

/**
 * Quick test to verify user access to ventures
 */

import { prisma } from '../lib/prisma'
import { getUserContext, createDataAccessFilter } from '../lib/user-context'

async function testUserAccess() {
  try {
    console.log('🔍 Testing user access to ventures...')
    
    // Get the user "h"
    const user = await prisma.user.findUnique({
      where: { email: 'aero.golden7@gmail.com' },
      select: { id: true, email: true, name: true, role: true, organization: true }
    })

    if (!user) {
      console.log('❌ User not found')
      return
    }

    console.log(`📋 Testing access for: ${user.name} (${user.email})`)
    console.log(`   Role: ${user.role}`)
    console.log(`   Organization: ${user.organization}`)

    // Create user context (simulating what the API does)
    const userContext = {
      user: {
        id: user.id,
        email: user.email,
        name: user.name || '',
        role: user.role,
        organization: user.organization,
        permissions: {}
      },
      organization: user.organization,
      isAdmin: user.role === 'ADMIN',
      isManager: ['ADMIN', 'MANAGER'].includes(user.role),
      canManageUsers: ['ADMIN', 'MANAGER'].includes(user.role),
      canCreateVentures: ['ADMIN', 'MANAGER', 'VENTURE_MANAGER'].includes(user.role),
      canViewReports: ['ADMIN', 'MANAGER', 'ANALYST'].includes(user.role),
      canManageFunds: ['ADMIN', 'MANAGER', 'CAPITAL_FACILITATOR'].includes(user.role),
      canViewAllData: user.role === 'ADMIN',
      canCrossOrganizationAccess: user.role === 'ADMIN',
    }

    // Create data access filter
    const dataAccessFilter = createDataAccessFilter(userContext)
    console.log(`🔐 Data access filter for ventures:`, JSON.stringify(dataAccessFilter.ventures, null, 2))

    // Test what ventures the user can see
    const accessibleVentures = await prisma.venture.findMany({
      where: dataAccessFilter.ventures,
      select: {
        id: true,
        name: true,
        sector: true,
        createdBy: {
          select: { name: true, email: true, organization: true }
        }
      }
    })

    console.log(`\n📊 Ventures accessible to ${user.name}:`)
    console.log(`   Total ventures: ${accessibleVentures.length}`)
    
    accessibleVentures.forEach((venture, index) => {
      console.log(`   ${index + 1}. ${venture.name} (${venture.sector})`)
      console.log(`      Created by: ${venture.createdBy.name} (${venture.createdBy.organization})`)
    })

    // Also check all ventures for comparison
    const allVentures = await prisma.venture.findMany({
      select: {
        id: true,
        name: true,
        sector: true,
        createdBy: {
          select: { name: true, email: true, organization: true }
        }
      }
    })

    console.log(`\n🌍 Total ventures in system: ${allVentures.length}`)
    
    if (accessibleVentures.length === allVentures.length) {
      console.log('✅ User can see all ventures (expected for same organization)')
    } else if (accessibleVentures.length === 0) {
      console.log('❌ User cannot see any ventures (this would be a problem)')
    } else {
      console.log('🔍 User can see some ventures (organization-based filtering working)')
    }

  } catch (error) {
    console.error('❌ Error testing user access:', error)
  }
}

// Run the test
testUserAccess()
  .then(() => {
    console.log('\n✅ User access test completed!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ User access test failed:', error)
    process.exit(1)
  })

