#!/usr/bin/env tsx

/**
 * Script to create ventures specifically for user "h" in their own organization
 */

import { prisma } from '../lib/prisma'

const userHVentures = [
  {
    name: "SmartCity Innovations",
    description: "A technology company developing smart city solutions for urban planning and sustainability, focusing on IoT sensors and data analytics.",
    sector: "Smart City Technology",
    location: "Singapore",
    website: "https://smartcity-innovations.sg",
    contactEmail: "info@smartcity-innovations.sg",
    contactPhone: "+65-6123-4567",
    pitchSummary: "SmartCity Innovations is transforming urban living through IoT-powered smart city solutions. Our platform helps cities reduce energy consumption by 35% and improve traffic flow by 40%.",
    inclusionFocus: "Inclusive urban planning with accessibility features",
    founderTypes: "MIXED",
    teamSize: 15,
    foundingYear: 2022,
    targetMarket: "Smart cities in Southeast Asia",
    revenueModel: "SaaS subscription + consulting services",
    revenue: 280000,
    fundingRaised: 750000,
    lastValuation: 4000000,
    gedsiScore: 78.0,
    socialImpactScore: 85.0,
    gedsiComplianceRate: 76.0,
    totalBeneficiaries: 1200,
    jobsCreated: 32,
    womenEmpowered: 600,
    disabilityInclusive: 12,
    youthEngaged: 200,
    status: "ACTIVE",
    stage: "SEED",
    intakeDate: new Date("2023-06-01"),
    screeningDate: new Date("2023-06-15"),
    dueDiligenceStart: new Date("2023-07-01"),
    dueDiligenceEnd: new Date("2023-09-15"),
    investmentReadyAt: new Date("2023-10-01"),
    nextReviewAt: new Date("2024-07-01"),
    stgGoals: {
      "Goal 1": "Deploy in 5 cities by 2024",
      "Goal 2": "Develop AI-powered traffic optimization",
      "Goal 3": "Launch citizen engagement platform"
    },
    gedsiGoals: [
      "Ensure accessibility in all smart city features",
      "Promote gender diversity in tech team",
      "Create inclusive urban planning tools"
    ],
    washingtonShortSet: {
      seeing: "no_difficulty",
      hearing: "no_difficulty",
      walking: "no_difficulty",
      cognition: "no_difficulty",
      selfCare: "no_difficulty",
      communication: "no_difficulty"
    },
    disabilityInclusion: {
      disabilityLedLeadership: false,
      inclusiveHiringPractices: true,
      accessibleProductsOrServices: true,
      notes: "All smart city interfaces include accessibility features"
    },
    operationalReadiness: {
      "Business Model": "Validated",
      "Technology": "MVP Complete",
      "Team": "Growing",
      "Market": "Validated",
      "Financial": "Developing"
    },
    capitalReadiness: {
      "Financial Records": "Complete",
      "Legal Structure": "Complete",
      "IP Protection": "In Progress",
      "Governance": "Developing",
      "Reporting": "Manual"
    },
    challenges: "Scaling across different city regulations and infrastructure",
    supportNeeded: "Regulatory guidance and partnership development",
    timeline: "24-month expansion to cover major Southeast Asian cities",
    tags: ["IoT", "Smart City", "Urban Planning", "Sustainability", "Data Analytics"]
  },
  {
    name: "EcoWaste Solutions",
    description: "A waste management technology company that uses AI and robotics to improve recycling efficiency and reduce environmental impact in urban areas.",
    sector: "Environmental Technology",
    location: "Bangkok, Thailand",
    website: "https://ecowaste-solutions.co.th",
    contactEmail: "contact@ecowaste-solutions.co.th",
    contactPhone: "+66-2-888-9999",
    pitchSummary: "EcoWaste Solutions is revolutionizing waste management through AI-powered sorting and robotics. Our system increases recycling rates by 60% while reducing processing costs by 45%.",
    inclusionFocus: "Community-based waste management with job creation",
    founderTypes: "WOMEN_LED",
    teamSize: 22,
    foundingYear: 2021,
    targetMarket: "Urban waste management facilities in Thailand and Malaysia",
    revenueModel: "Equipment sales + service contracts + recycling revenue",
    revenue: 520000,
    fundingRaised: 1200000,
    lastValuation: 6000000,
    gedsiScore: 82.0,
    socialImpactScore: 91.0,
    gedsiComplianceRate: 80.0,
    totalBeneficiaries: 3500,
    jobsCreated: 65,
    womenEmpowered: 1800,
    disabilityInclusive: 18,
    youthEngaged: 450,
    status: "ACTIVE",
    stage: "SERIES_A",
    intakeDate: new Date("2023-07-10"),
    screeningDate: new Date("2023-07-25"),
    dueDiligenceStart: new Date("2023-08-15"),
    dueDiligenceEnd: new Date("2023-11-30"),
    investmentReadyAt: new Date("2023-12-15"),
    nextReviewAt: new Date("2024-08-15"),
    stgGoals: {
      "Goal 1": "Process 1000 tons of waste daily",
      "Goal 2": "Expand to 10 facilities",
      "Goal 3": "Develop zero-waste community programs"
    },
    gedsiGoals: [
      "Create 100+ green jobs for women",
      "Reduce environmental impact by 50%",
      "Develop accessible waste management solutions"
    ],
    washingtonShortSet: {
      seeing: "no_difficulty",
      hearing: "no_difficulty",
      walking: "no_difficulty",
      cognition: "no_difficulty",
      selfCare: "no_difficulty",
      communication: "no_difficulty"
    },
    disabilityInclusion: {
      disabilityLedLeadership: false,
      inclusiveHiringPractices: true,
      accessibleProductsOrServices: true,
      notes: "Waste collection systems designed for accessibility"
    },
    operationalReadiness: {
      "Business Model": "Validated",
      "Technology": "Advanced",
      "Team": "Complete",
      "Market": "Growing",
      "Financial": "Stable"
    },
    capitalReadiness: {
      "Financial Records": "Complete",
      "Legal Structure": "Complete",
      "IP Protection": "Complete",
      "Governance": "Established",
      "Reporting": "Automated"
    },
    challenges: "Scaling technology and managing regulatory compliance",
    supportNeeded: "Technology development and market expansion",
    timeline: "30-month expansion across Southeast Asia",
    tags: ["Waste Management", "AI", "Robotics", "Environmental", "Recycling"]
  }
]

async function seedUserHVentures() {
  try {
    console.log('🌱 Creating ventures for user "h" in TechCorp Solutions organization...')
    
    // Get user "h"
    const userH = await prisma.user.findUnique({
      where: { email: 'aero.golden7@gmail.com' },
      select: { id: true, name: true, email: true, organization: true }
    })

    if (!userH) {
      throw new Error('User "h" not found. Please ensure aero.golden7@gmail.com exists.')
    }

    console.log(`📋 Found user: ${userH.name} (${userH.email})`)
    console.log(`   Organization: ${userH.organization}`)

    // Create ventures for user "h"
    const createdVentures = []
    for (const ventureData of userHVentures) {
      const venture = await prisma.venture.create({
        data: {
          ...ventureData,
          createdById: userH.id,
          assignedToId: userH.id,
          calculatedAt: new Date()
        }
      })
      createdVentures.push(venture)
      console.log(`✅ Created venture: ${venture.name}`)
    }

    // Create some sample documents for each venture
    const documentTypes = ['BUSINESS_PLAN', 'FINANCIAL_STATEMENTS', 'PITCH_DECK']
    
    for (const venture of createdVentures) {
      for (let i = 0; i < 2; i++) {
        const docType = documentTypes[i]
        await prisma.document.create({
          data: {
            name: `${docType.replace('_', ' ')} - ${venture.name}`,
            type: docType,
            url: `https://docs.techcorp.com/${venture.id}/${docType.toLowerCase()}.pdf`,
            size: Math.floor(Math.random() * 3000000) + 200000,
            mimeType: 'application/pdf',
            ventureId: venture.id
          }
        })
      }
      console.log(`📄 Created 2 sample documents for: ${venture.name}`)
    }

    // Create some sample activities
    const activityTypes = ['VENTURE_CREATED', 'METRIC_ADDED', 'DOCUMENT_UPLOADED']
    
    for (const venture of createdVentures) {
      for (let i = 0; i < 3; i++) {
        const activityType = activityTypes[i]
        await prisma.activity.create({
          data: {
            ventureId: venture.id,
            userId: userH.id,
            type: activityType,
            title: `${activityType.replace('_', ' ')} for ${venture.name}`,
            description: `Activity for ${venture.name} by user ${userH.name}`,
            metadata: {
              ventureName: venture.name,
              user: userH.name,
              timestamp: new Date().toISOString()
            }
          }
        })
      }
      console.log(`📊 Created 3 sample activities for: ${venture.name}`)
    }

    console.log(`\n🎉 Successfully created ${createdVentures.length} ventures for user "h"!`)
    console.log('\n🏢 Created Ventures:')
    createdVentures.forEach((venture, index) => {
      console.log(`${index + 1}. ${venture.name} - ${venture.sector} (${venture.location})`)
    })

    console.log('\n🔐 These ventures should ONLY be visible to user "h" and other users in "TechCorp Solutions" organization')

  } catch (error) {
    console.error('❌ Error creating ventures for user "h":', error)
    throw error
  }
}

// Run the seeding
if (require.main === module) {
  seedUserHVentures()
    .then(() => {
      console.log('\n✅ Venture creation completed successfully!')
      process.exit(0)
    })
    .catch((error) => {
      console.error('❌ Venture creation failed:', error)
      process.exit(1)
    })
}

export { seedUserHVentures }

