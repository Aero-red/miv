import { prisma } from '../lib/prisma'

async function seedFullDataForUserHVentures() {
  try {
    console.log('🌱 Seeding comprehensive data for user "h" ventures...')

    const userH = await prisma.user.findUnique({
      where: { email: 'aero.golden7@gmail.com' },
      select: { id: true, name: true, email: true, organization: true }
    })

    if (!userH) {
      throw new Error('User "h" not found. Please ensure aero.golden7@gmail.com exists.')
    }

    const ventureNames = [
      'SmartCity Innovations',
      'EcoWaste Solutions'
    ]

    const ventures = await prisma.venture.findMany({
      where: { name: { in: ventureNames }, createdById: userH.id },
      select: { id: true, name: true }
    })

    const nameToVentureId: Record<string, string> = {}
    ventures.forEach(v => { nameToVentureId[v.name] = v.id })

    // Helper to ensure venture exists; if not found, create a minimal one
    async function ensureVenture(name: string) {
      if (nameToVentureId[name]) return nameToVentureId[name]
      const base: any = name === 'SmartCity Innovations' ? {
        name,
        description: 'Smart city IoT & analytics platform',
        sector: 'Smart City Technology',
        location: 'Singapore',
        website: 'https://smartcity-innovations.sg',
        contactEmail: 'info@smartcity-innovations.sg',
        founderTypes: 'MIXED',
        teamSize: 15,
        foundingYear: 2022,
      } : {
        name,
        description: 'AI + robotics for waste sorting and recycling',
        sector: 'Environmental Technology',
        location: 'Bangkok, Thailand',
        website: 'https://ecowaste-solutions.co.th',
        contactEmail: 'contact@ecowaste-solutions.co.th',
        founderTypes: 'WOMEN_LED',
        teamSize: 22,
        foundingYear: 2021,
      }
      const created = await prisma.venture.create({
        data: {
          ...base,
          createdById: userH.id,
          assignedToId: userH.id,
          status: 'ACTIVE',
          stage: 'SEED',
          calculatedAt: new Date(),
        }
      })
      nameToVentureId[name] = created.id
      console.log(`✅ Created missing venture: ${name}`)
      return created.id
    }

    // Ensure both ventures exist
    const smartCityId = await ensureVenture('SmartCity Innovations')
    const ecoWasteId = await ensureVenture('EcoWaste Solutions')

    const ventureIds = [smartCityId, ecoWasteId]

    // Seed documents (up to 5 per venture)
    const docTypes = ['PITCH_DECK', 'FINANCIAL_STATEMENTS', 'BUSINESS_PLAN', 'LEGAL_DOCUMENTS', 'MARKET_RESEARCH'] as const
    for (const ventureId of ventureIds) {
      for (const type of docTypes) {
        // Avoid duplicates by checking existing doc with same name/type
        const name = `${type.replace('_', ' ')} - ${ventureId}`
        const exists = await prisma.document.findFirst({ where: { ventureId, type: type as any } })
        if (!exists) {
          await prisma.document.create({
            data: {
              ventureId,
              name,
              type: type as any,
              url: `https://docs.example.com/${ventureId}/${String(type).toLowerCase()}.pdf`,
              size: Math.floor(Math.random() * 3_000_000) + 200_000,
              mimeType: 'application/pdf',
            }
          })
        }
      }
      console.log(`📄 Ensured documents for venture ${ventureId}`)
    }

    // Seed GEDSI metrics (4 per venture)
    const gedsiSeeds = [
      { code: 'PI4060', name: 'Women Employees', category: 'GENDER', unit: 'count', target: 200, current: 120 },
      { code: 'OI3759', name: 'People with Disabilities Employed', category: 'DISABILITY', unit: 'count', target: 25, current: 12 },
      { code: 'OI1479', name: 'Clients Served Low-income', category: 'SOCIAL_INCLUSION', unit: 'count', target: 2000, current: 1100 },
      { code: 'OI4909', name: 'Community Engagement Events', category: 'CROSS_CUTTING', unit: 'events', target: 24, current: 10 },
    ] as const

    for (const ventureId of ventureIds) {
      for (const m of gedsiSeeds) {
        const exists = await prisma.gEDSIMetric.findFirst({
          where: { ventureId, metricCode: m.code }
        })
        if (!exists) {
          await prisma.gEDSIMetric.create({
            data: {
              ventureId,
              metricCode: m.code,
              metricName: m.name,
              category: m.category as any,
              unit: m.unit,
              targetValue: m.target,
              currentValue: m.current,
              status: 'IN_PROGRESS',
              createdById: userH.id,
              notes: `Seeded metric ${m.code}`
            }
          })
        }
      }
      console.log(`📈 Ensured GEDSI metrics for venture ${ventureId}`)
    }

    // Seed capital activities (3 per venture)
    const capSeeds = [
      { type: 'GRANT', amount: 150_000, status: 'APPROVED', investorName: 'Sustainability Grant Program' },
      { type: 'EQUITY', amount: 1_000_000, status: 'COMPLETED', investorName: 'Impact VC Partners' },
      { type: 'DEBT', amount: 250_000, status: 'PENDING', investorName: 'Green Bank' },
    ] as const

    for (const ventureId of ventureIds) {
      for (const c of capSeeds) {
        // Avoid raw duplicates by checking similar record
        const exists = await prisma.capitalActivity.findFirst({
          where: { ventureId, type: c.type as any, amount: c.amount }
        })
        if (!exists) {
          await prisma.capitalActivity.create({
            data: {
              ventureId,
              type: c.type as any,
              amount: c.amount,
              status: c.status as any,
              description: `${c.type} funding activity`,
              date: new Date(),
              investorName: c.investorName,
              currency: 'USD',
              terms: { note: 'Standard terms' }
            }
          })
        }
      }
      console.log(`💰 Ensured capital activities for venture ${ventureId}`)
    }

    // Seed projects (2 per venture)
    for (const ventureId of ventureIds) {
      const projSeeds = [
        { name: 'Go-to-Market Rollout', description: 'Regional expansion and partnerships', priority: 'HIGH' },
        { name: 'Platform Hardening', description: 'Security, reliability, and performance improvements', priority: 'MEDIUM' },
      ] as const

      for (const p of projSeeds) {
        const exists = await prisma.project.findFirst({ where: { ventureId, name: p.name } })
        if (!exists) {
          await prisma.project.create({
            data: {
              ventureId,
              name: p.name,
              description: p.description,
              priority: p.priority as any,
              status: 'IN_PROGRESS',
              leadId: userH.id,
              startDate: new Date(),
              members: { connect: [{ id: userH.id }] },
              tags: { areas: ['growth', 'product'] }
            }
          })
        }
      }
      console.log(`🗂️  Ensured projects for venture ${ventureId}`)
    }

    // Activity log entries for visibility
    for (const ventureId of ventureIds) {
      await prisma.activity.create({
        data: {
          ventureId,
          userId: userH.id,
          type: 'NOTE_ADDED',
          title: 'Seeded full venture dataset',
          description: 'Comprehensive seed of documents, metrics, capital activities, and projects.',
          metadata: { seededBy: userH.email, at: new Date().toISOString() }
        }
      })
    }

    console.log('✅ Seeding completed successfully for SmartCity Innovations and EcoWaste Solutions.')
  } catch (error) {
    console.error('❌ Seeding failed:', error)
    process.exit(1)
  }
}

if (require.main === module) {
  seedFullDataForUserHVentures().then(() => process.exit(0))
}

export { seedFullDataForUserHVentures }

