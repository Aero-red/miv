import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function changeUserHRole() {
  try {
    console.log('🔄 Changing user "h" role from ADMIN to VENTURE_MANAGER...\n')

    // Find user "h"
    const userH = await prisma.user.findUnique({
      where: { email: 'aero.golden7@gmail.com' }
    })

    if (!userH) {
      console.log('❌ User "h" not found')
      return
    }

    console.log(`📋 Current user details:`)
    console.log(`   Name: ${userH.name}`)
    console.log(`   Email: ${userH.email}`)
    console.log(`   Current Role: ${userH.role}`)
    console.log(`   Organization: ${userH.organization}`)

    // Update the role from ADMIN to VENTURE_MANAGER
    const updatedUser = await prisma.user.update({
      where: { email: 'aero.golden7@gmail.com' },
      data: {
        role: 'VENTURE_MANAGER'
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        organization: true
      }
    })

    console.log(`\n✅ User role updated successfully!`)
    console.log(`📋 Updated user details:`)
    console.log(`   Name: ${updatedUser.name}`)
    console.log(`   Email: ${updatedUser.email}`)
    console.log(`   New Role: ${updatedUser.role}`)
    console.log(`   Organization: ${updatedUser.organization}`)

    console.log(`\n🔐 New permissions for VENTURE_MANAGER role:`)
    console.log(`   ✅ Can create ventures`)
    console.log(`   ✅ Can manage ventures`)
    console.log(`   ❌ Cannot manage users (ADMIN only)`)
    console.log(`   ❌ Cannot manage funds (MANAGER/CAPITAL_FACILITATOR only)`)
    console.log(`   ❌ Cannot view all data across organizations`)
    console.log(`   ✅ Can only see data within their organization (${updatedUser.organization})`)

  } catch (error) {
    console.error('❌ Error changing user role:', error)
  } finally {
    await prisma.$disconnect()
  }
}

changeUserHRole()

