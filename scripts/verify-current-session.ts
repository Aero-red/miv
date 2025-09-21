import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function verifyCurrentSession() {
  try {
    console.log('🔍 Verifying current session and user data...\n')

    // Check all users in the system
    const allUsers = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        organization: true,
        createdAt: true
      },
      orderBy: { createdAt: 'desc' }
    })

    console.log(`👥 All users in system (${allUsers.length} total):`)
    allUsers.forEach((user, index) => {
      console.log(`   ${index + 1}. ${user.name} (${user.email})`)
      console.log(`      Role: ${user.role}`)
      console.log(`      Organization: ${user.organization}`)
      console.log(`      ID: ${user.id}`)
      console.log('')
    })

    // Check ventures and their creators
    const allVentures = await prisma.venture.findMany({
      select: {
        id: true,
        name: true,
        sector: true,
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            organization: true
          }
        }
      },
      orderBy: { name: 'asc' }
    })

    console.log(`🏢 All ventures in system (${allVentures.length} total):`)
    allVentures.forEach((venture, index) => {
      console.log(`   ${index + 1}. ${venture.name} (${venture.sector})`)
      console.log(`      Created by: ${venture.createdBy.name} (${venture.createdBy.email})`)
      console.log(`      Creator Role: ${venture.createdBy.role}`)
      console.log(`      Creator Organization: ${venture.createdBy.organization}`)
      console.log('')
    })

    // Group ventures by organization
    const venturesByOrg = allVentures.reduce((acc, venture) => {
      const org = venture.createdBy.organization || 'No Organization'
      if (!acc[org]) acc[org] = []
      acc[org].push(venture)
      return acc
    }, {} as Record<string, any[]>)

    console.log(`🏢 Ventures grouped by organization:`)
    Object.entries(venturesByOrg).forEach(([org, ventures]) => {
      console.log(`   ${org}: ${ventures.length} ventures`)
      ventures.forEach(v => console.log(`     - ${v.name}`))
    })

    console.log(`\n✅ Session verification completed!`)

  } catch (error) {
    console.error('❌ Error verifying session:', error)
  } finally {
    await prisma.$disconnect()
  }
}

verifyCurrentSession()

