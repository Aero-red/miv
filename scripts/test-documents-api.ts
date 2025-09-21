import { PrismaClient } from '@prisma/client'
import { getUserContext, createDataAccessFilter } from '../lib/user-context'

const prisma = new PrismaClient()

async function testDocumentsAPI() {
  try {
    console.log('🔍 Testing documents API access for different users...\n')

    // Test user "h" (harshit)
    const userH = await prisma.user.findUnique({
      where: { email: 'aero.golden7@gmail.com' },
      select: { id: true, name: true, email: true, role: true, organization: true }
    })

    if (!userH) {
      console.log('❌ User harshit not found')
      return
    }

    console.log(`📋 Testing access for: ${userH.name} (${userH.email})`)
    console.log(`   Role: ${userH.role}`)
    console.log(`   Organization: ${userH.organization}`)

    // Create user context for user "h"
    const userContextH = {
      user: userH,
      organization: userH.organization,
      isAdmin: userH.role === 'ADMIN',
      isManager: ['ADMIN', 'MANAGER'].includes(userH.role),
      canManageUsers: ['ADMIN'].includes(userH.role),
      canCreateVentures: ['ADMIN', 'MANAGER', 'VENTURE_MANAGER'].includes(userH.role),
      canViewReports: ['ADMIN', 'MANAGER', 'ANALYST'].includes(userH.role),
      canManageFunds: ['ADMIN', 'MANAGER', 'CAPITAL_FACILITATOR'].includes(userH.role),
      canViewAllData: userH.role === 'ADMIN',
      canCrossOrganizationAccess: userH.role === 'ADMIN',
    }

    console.log(`🔐 User can view all data: ${userContextH.canViewAllData}`)

    // Create data access filter for user "h"
    const dataAccessFilterH = createDataAccessFilter(userContextH)
    console.log(`🔐 Data access filter for user h:`, JSON.stringify(dataAccessFilterH.ventures, null, 2))

    // Test ventures API call simulation
    const accessibleVenturesH = await prisma.venture.findMany({
      where: dataAccessFilterH.ventures,
      include: {
        createdBy: {
          select: { name: true, email: true, organization: true }
        },
        assignedTo: {
          select: { name: true, email: true, organization: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    console.log(`\n📊 Ventures accessible to ${userH.name}:`)
    console.log(`   Total ventures: ${accessibleVenturesH.length}`)
    
    accessibleVenturesH.forEach((venture, index) => {
      console.log(`   ${index + 1}. ${venture.name} (${venture.sector})`)
      console.log(`      Created by: ${venture.createdBy.name} (${venture.createdBy.organization})`)
    })

    // Test admin user as well for comparison
    console.log(`\n` + '='.repeat(60))
    console.log('🔍 Testing admin access for comparison...\n')

    const adminUser = await prisma.user.findUnique({
      where: { email: 'admin@miv.org' },
      select: { id: true, name: true, email: true, role: true, organization: true }
    })

    if (adminUser) {
      const userContextAdmin = {
        user: adminUser,
        organization: adminUser.organization,
        isAdmin: adminUser.role === 'ADMIN',
        isManager: ['ADMIN', 'MANAGER'].includes(adminUser.role),
        canManageUsers: ['ADMIN'].includes(adminUser.role),
        canCreateVentures: ['ADMIN', 'MANAGER', 'VENTURE_MANAGER'].includes(adminUser.role),
        canViewReports: ['ADMIN', 'MANAGER', 'ANALYST'].includes(adminUser.role),
        canManageFunds: ['ADMIN', 'MANAGER', 'CAPITAL_FACILITATOR'].includes(adminUser.role),
        canViewAllData: adminUser.role === 'ADMIN',
        canCrossOrganizationAccess: adminUser.role === 'ADMIN',
      }

      const dataAccessFilterAdmin = createDataAccessFilter(userContextAdmin)
      const accessibleVenturesAdmin = await prisma.venture.findMany({
        where: dataAccessFilterAdmin.ventures,
        include: {
          createdBy: {
            select: { name: true, email: true, organization: true }
          }
        },
        orderBy: { createdAt: 'desc' }
      })

      console.log(`📋 Testing access for: ${adminUser.name} (${adminUser.email})`)
      console.log(`   Role: ${adminUser.role}`)
      console.log(`   Organization: ${adminUser.organization}`)
      console.log(`📊 Ventures accessible to ${adminUser.name}: ${accessibleVenturesAdmin.length}`)
    }

    // Get total ventures in system
    const totalVentures = await prisma.venture.count()
    console.log(`\n🌍 Total ventures in system: ${totalVentures}`)

    console.log(`\n✅ API access test completed!`)

  } catch (error) {
    console.error('❌ Error testing API access:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testDocumentsAPI()

