#!/usr/bin/env tsx

/**
 * Script to seed 5 comprehensive ventures for H arya (admin@miv.org)
 */

import { prisma } from '../lib/prisma'

const venturesData = [
  {
    name: "EcoHarvest Technologies",
    description: "A sustainable agriculture technology company that develops AI-powered farming solutions for smallholder farmers in Southeast Asia, focusing on climate-smart agriculture and food security.",
    sector: "Agriculture Technology",
    location: "Bangkok, Thailand",
    website: "https://ecoharvest-tech.com",
    contactEmail: "info@ecoharvest-tech.com",
    contactPhone: "+66-2-123-4567",
    pitchSummary: "EcoHarvest Technologies is revolutionizing sustainable agriculture through AI-powered precision farming solutions. Our platform helps smallholder farmers increase crop yields by 40% while reducing water usage by 30% and chemical inputs by 25%.",
    inclusionFocus: "Women-led agricultural innovation with focus on empowering female farmers",
    founderTypes: "WOMEN_LED",
    teamSize: 12,
    foundingYear: 2021,
    targetMarket: "Smallholder farmers in Thailand, Vietnam, and Cambodia",
    revenueModel: "SaaS subscription + equipment leasing",
    revenue: 450000,
    fundingRaised: 1200000,
    lastValuation: 8000000,
    gedsiScore: 85.5,
    socialImpactScore: 92.0,
    gedsiComplianceRate: 88.0,
    totalBeneficiaries: 2500,
    jobsCreated: 45,
    womenEmpowered: 1200,
    disabilityInclusive: 8,
    youthEngaged: 300,
    status: "ACTIVE",
    stage: "SERIES_A",
    intakeDate: new Date("2023-01-15"),
    screeningDate: new Date("2023-02-01"),
    dueDiligenceStart: new Date("2023-03-15"),
    dueDiligenceEnd: new Date("2023-05-30"),
    investmentReadyAt: new Date("2023-06-15"),
    nextReviewAt: new Date("2024-03-15"),
    stgGoals: {
      "Goal 1": "Reach 5,000 farmers by end of 2024",
      "Goal 2": "Expand to 3 new countries",
      "Goal 3": "Develop mobile app for farmer training"
    },
    gedsiGoals: [
      "Increase women farmer participation by 50%",
      "Provide accessibility features for disabled farmers",
      "Create youth engagement programs"
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
      notes: "Platform includes voice commands and screen reader compatibility"
    },
    operationalReadiness: {
      "Business Model": "Validated",
      "Technology": "MVP Complete",
      "Team": "Complete",
      "Market": "Validated",
      "Financial": "Stable"
    },
    capitalReadiness: {
      "Financial Records": "Complete",
      "Legal Structure": "Complete",
      "IP Protection": "Complete",
      "Governance": "Established",
      "Reporting": "Automated"
    },
    challenges: "Scaling technology across different languages and farming practices",
    supportNeeded: "Market expansion support and regulatory guidance",
    timeline: "18-month expansion plan across Southeast Asia",
    tags: ["AI", "Agriculture", "Sustainability", "Women-led", "Climate-smart"]
  },
  {
    name: "AccessiLearn Platform",
    description: "An inclusive educational technology platform that provides accessible learning solutions for students with disabilities, featuring adaptive content, sign language integration, and universal design principles.",
    sector: "Education Technology",
    location: "Jakarta, Indonesia",
    website: "https://accessilearn.id",
    contactEmail: "contact@accessilearn.id",
    contactPhone: "+62-21-987-6543",
    pitchSummary: "AccessiLearn is breaking down educational barriers for students with disabilities through innovative technology. Our platform has helped over 10,000 students with visual, hearing, and cognitive disabilities access quality education.",
    inclusionFocus: "Disability-inclusive education with universal design principles",
    founderTypes: "DISABILITY_LED",
    teamSize: 18,
    foundingYear: 2020,
    targetMarket: "Educational institutions and students with disabilities in Indonesia and Malaysia",
    revenueModel: "B2B licensing + premium individual subscriptions",
    revenue: 320000,
    fundingRaised: 800000,
    lastValuation: 5000000,
    gedsiScore: 95.0,
    socialImpactScore: 96.5,
    gedsiComplianceRate: 94.0,
    totalBeneficiaries: 10000,
    jobsCreated: 28,
    womenEmpowered: 5200,
    disabilityInclusive: 35,
    youthEngaged: 8500,
    status: "ACTIVE",
    stage: "SEED",
    intakeDate: new Date("2023-02-20"),
    screeningDate: new Date("2023-03-10"),
    dueDiligenceStart: new Date("2023-04-01"),
    dueDiligenceEnd: new Date("2023-06-15"),
    investmentReadyAt: new Date("2023-07-01"),
    nextReviewAt: new Date("2024-04-01"),
    stgGoals: {
      "Goal 1": "Launch in 50 schools by 2024",
      "Goal 2": "Develop AI-powered content adaptation",
      "Goal 3": "Partner with disability organizations"
    },
    gedsiGoals: [
      "Achieve 100% accessibility compliance",
      "Train 500 teachers in inclusive education",
      "Develop content in 3 local languages"
    ],
    washingtonShortSet: {
      seeing: "some_difficulty",
      hearing: "no_difficulty",
      walking: "no_difficulty",
      cognition: "no_difficulty",
      selfCare: "no_difficulty",
      communication: "no_difficulty"
    },
    disabilityInclusion: {
      disabilityLedLeadership: true,
      inclusiveHiringPractices: true,
      accessibleProductsOrServices: true,
      notes: "CEO is visually impaired, 60% of team has disabilities"
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
      "IP Protection": "In Progress",
      "Governance": "Established",
      "Reporting": "Manual"
    },
    challenges: "Scaling content creation and teacher training programs",
    supportNeeded: "Technical development and partnership building",
    timeline: "24-month expansion to cover all major Indonesian cities",
    tags: ["EdTech", "Accessibility", "Disability", "Inclusive Education", "Universal Design"]
  },
  {
    name: "GreenFinance Solutions",
    description: "A fintech company providing microfinance and green investment opportunities for underserved communities, with a focus on women entrepreneurs and environmental sustainability projects.",
    sector: "Financial Technology",
    location: "Ho Chi Minh City, Vietnam",
    website: "https://greenfinance.vn",
    contactEmail: "hello@greenfinance.vn",
    contactPhone: "+84-28-555-7777",
    pitchSummary: "GreenFinance Solutions democratizes access to green financing for women entrepreneurs and underserved communities. We've facilitated over $2M in green investments and supported 500+ women-led businesses.",
    inclusionFocus: "Women-led financial inclusion with environmental impact focus",
    founderTypes: "WOMEN_LED",
    teamSize: 25,
    foundingYear: 2019,
    targetMarket: "Women entrepreneurs and underserved communities in Vietnam and Philippines",
    revenueModel: "Transaction fees + interest on loans + investment management fees",
    revenue: 780000,
    fundingRaised: 2000000,
    lastValuation: 12000000,
    gedsiScore: 88.0,
    socialImpactScore: 89.5,
    gedsiComplianceRate: 86.0,
    totalBeneficiaries: 5000,
    jobsCreated: 120,
    womenEmpowered: 3200,
    disabilityInclusive: 15,
    youthEngaged: 800,
    status: "ACTIVE",
    stage: "SERIES_B",
    intakeDate: new Date("2023-03-10"),
    screeningDate: new Date("2023-03-25"),
    dueDiligenceStart: new Date("2023-04-15"),
    dueDiligenceEnd: new Date("2023-07-30"),
    investmentReadyAt: new Date("2023-08-15"),
    fundedAt: new Date("2023-09-01"),
    nextReviewAt: new Date("2024-05-15"),
    stgGoals: {
      "Goal 1": "Launch mobile banking app",
      "Goal 2": "Expand to 5 new provinces",
      "Goal 3": "Develop carbon credit trading platform"
    },
    gedsiGoals: [
      "Increase women loan approval rate to 85%",
      "Develop financial literacy programs",
      "Create disability-inclusive banking services"
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
      notes: "Mobile app includes voice navigation and large text options"
    },
    operationalReadiness: {
      "Business Model": "Validated",
      "Technology": "Advanced",
      "Team": "Complete",
      "Market": "Validated",
      "Financial": "Strong"
    },
    capitalReadiness: {
      "Financial Records": "Complete",
      "Legal Structure": "Complete",
      "IP Protection": "Complete",
      "Governance": "Established",
      "Reporting": "Automated"
    },
    challenges: "Regulatory compliance across multiple jurisdictions",
    supportNeeded: "Regulatory guidance and partnership development",
    timeline: "36-month expansion plan across Southeast Asia",
    tags: ["FinTech", "Microfinance", "Green Finance", "Women-led", "Financial Inclusion"]
  },
  {
    name: "HealthConnect Mobile",
    description: "A telemedicine platform connecting rural communities with healthcare providers, featuring multi-language support, disability accessibility, and specialized services for maternal and child health.",
    sector: "Healthcare Technology",
    location: "Manila, Philippines",
    website: "https://healthconnect.ph",
    contactEmail: "support@healthconnect.ph",
    contactPhone: "+63-2-888-9999",
    pitchSummary: "HealthConnect Mobile brings quality healthcare to rural communities through telemedicine. Our platform has conducted over 50,000 consultations and improved healthcare access for 15,000+ patients in underserved areas.",
    inclusionFocus: "Rural healthcare access with focus on maternal and child health",
    founderTypes: "MIXED",
    teamSize: 32,
    foundingYear: 2021,
    targetMarket: "Rural communities and healthcare providers in Philippines and Indonesia",
    revenueModel: "Subscription fees + consultation commissions + premium services",
    revenue: 650000,
    fundingRaised: 1500000,
    lastValuation: 7500000,
    gedsiScore: 82.0,
    socialImpactScore: 94.0,
    gedsiComplianceRate: 80.0,
    totalBeneficiaries: 15000,
    jobsCreated: 85,
    womenEmpowered: 8500,
    disabilityInclusive: 25,
    youthEngaged: 2000,
    status: "ACTIVE",
    stage: "SERIES_A",
    intakeDate: new Date("2023-04-05"),
    screeningDate: new Date("2023-04-20"),
    dueDiligenceStart: new Date("2023-05-10"),
    dueDiligenceEnd: new Date("2023-08-15"),
    investmentReadyAt: new Date("2023-09-01"),
    nextReviewAt: new Date("2024-06-01"),
    stgGoals: {
      "Goal 1": "Reach 100,000 patients by 2024",
      "Goal 2": "Launch AI diagnostic tools",
      "Goal 3": "Expand to mental health services"
    },
    gedsiGoals: [
      "Improve maternal health outcomes by 40%",
      "Provide healthcare access to remote communities",
      "Train community health workers"
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
      notes: "App includes sign language video calls and audio descriptions"
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
    challenges: "Internet connectivity in rural areas and regulatory compliance",
    supportNeeded: "Technology infrastructure and healthcare partnerships",
    timeline: "30-month expansion to cover all major rural areas",
    tags: ["HealthTech", "Telemedicine", "Rural Healthcare", "Maternal Health", "Accessibility"]
  },
  {
    name: "YouthEmpower Tech",
    description: "A social enterprise providing technology training and employment opportunities for marginalized youth, including refugees, street children, and youth with disabilities, through coding bootcamps and digital skills programs.",
    sector: "Social Enterprise",
    location: "Kuala Lumpur, Malaysia",
    website: "https://youthempower.my",
    contactEmail: "info@youthempower.my",
    contactPhone: "+60-3-123-8888",
    pitchSummary: "YouthEmpower Tech transforms lives through technology education. We've trained over 2,000 marginalized youth in digital skills, with 75% finding employment or starting their own tech ventures.",
    inclusionFocus: "Youth empowerment with focus on marginalized and refugee communities",
    founderTypes: "YOUTH_LED",
    teamSize: 20,
    foundingYear: 2022,
    targetMarket: "Marginalized youth, refugees, and youth with disabilities in Malaysia and Thailand",
    revenueModel: "Corporate training contracts + government grants + social impact bonds",
    revenue: 280000,
    fundingRaised: 600000,
    lastValuation: 3500000,
    gedsiScore: 92.0,
    socialImpactScore: 97.0,
    gedsiComplianceRate: 90.0,
    totalBeneficiaries: 2000,
    jobsCreated: 150,
    womenEmpowered: 1000,
    disabilityInclusive: 200,
    youthEngaged: 2000,
    status: "ACTIVE",
    stage: "SEED",
    intakeDate: new Date("2023-05-15"),
    screeningDate: new Date("2023-06-01"),
    dueDiligenceStart: new Date("2023-06-20"),
    dueDiligenceEnd: new Date("2023-09-10"),
    investmentReadyAt: new Date("2023-10-01"),
    nextReviewAt: new Date("2024-07-01"),
    stgGoals: {
      "Goal 1": "Train 5,000 youth by 2025",
      "Goal 2": "Launch online learning platform",
      "Goal 3": "Establish partnerships with tech companies"
    },
    gedsiGoals: [
      "Achieve 80% employment rate for graduates",
      "Provide accessible learning for disabled youth",
      "Create refugee integration programs"
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
      notes: "Specialized programs for deaf and visually impaired youth"
    },
    operationalReadiness: {
      "Business Model": "Validated",
      "Technology": "Basic",
      "Team": "Growing",
      "Market": "Validated",
      "Financial": "Developing"
    },
    capitalReadiness: {
      "Financial Records": "Complete",
      "Legal Structure": "Complete",
      "IP Protection": "Basic",
      "Governance": "Developing",
      "Reporting": "Manual"
    },
    challenges: "Securing sustainable funding and scaling training programs",
    supportNeeded: "Funding, curriculum development, and corporate partnerships",
    timeline: "24-month expansion to cover all major cities in Malaysia",
    tags: ["Social Enterprise", "Youth", "Tech Education", "Refugees", "Digital Inclusion"]
  }
]

async function seedAdminVentures() {
  try {
    console.log('🌱 Starting to seed ventures for H arya (admin@miv.org)...')
    
    // Get the admin user ID
    const adminUser = await prisma.user.findUnique({
      where: { email: 'admin@miv.org' },
      select: { id: true, name: true }
    })

    if (!adminUser) {
      throw new Error('Admin user not found. Please ensure admin@miv.org exists.')
    }

    console.log(`📋 Found admin user: ${adminUser.name} (${adminUser.id})`)

    // Create ventures
    const createdVentures = []
    for (const ventureData of venturesData) {
      const venture = await prisma.venture.create({
        data: {
          ...ventureData,
          createdById: adminUser.id,
          assignedToId: adminUser.id,
          calculatedAt: new Date()
        }
      })
      createdVentures.push(venture)
      console.log(`✅ Created venture: ${venture.name}`)
    }

    // Create some sample documents for each venture
    const documentTypes = ['BUSINESS_PLAN', 'FINANCIAL_STATEMENTS', 'PITCH_DECK', 'LEGAL_DOCUMENTS', 'MARKET_RESEARCH']
    
    for (const venture of createdVentures) {
      for (let i = 0; i < 3; i++) {
        const docType = documentTypes[Math.floor(Math.random() * documentTypes.length)]
        await prisma.document.create({
          data: {
            name: `${docType.replace('_', ' ')} - ${venture.name}`,
            type: docType,
            url: `https://docs.example.com/${venture.id}/${docType.toLowerCase()}.pdf`,
            size: Math.floor(Math.random() * 5000000) + 100000, // 100KB to 5MB
            mimeType: 'application/pdf',
            ventureId: venture.id
          }
        })
      }
      console.log(`📄 Created 3 sample documents for: ${venture.name}`)
    }

    // Create some sample activities
    const activityTypes = ['VENTURE_CREATED', 'METRIC_ADDED', 'DOCUMENT_UPLOADED', 'STAGE_CHANGED', 'NOTE_ADDED']
    
    for (const venture of createdVentures) {
      for (let i = 0; i < 5; i++) {
        const activityType = activityTypes[Math.floor(Math.random() * activityTypes.length)]
        await prisma.activity.create({
          data: {
            ventureId: venture.id,
            userId: adminUser.id,
            type: activityType,
            title: `${activityType.replace('_', ' ')} for ${venture.name}`,
            description: `Activity related to ${activityType.toLowerCase().replace('_', ' ')} for venture ${venture.name}`,
            metadata: {
              ventureName: venture.name,
              timestamp: new Date().toISOString()
            }
          }
        })
      }
      console.log(`📊 Created 5 sample activities for: ${venture.name}`)
    }

    // Create some sample GEDSI metrics for each venture
    const gedsiCategories = ['GENDER', 'DISABILITY', 'SOCIAL_INCLUSION', 'CROSS_CUTTING']
    
    for (const venture of createdVentures) {
      for (let i = 0; i < 4; i++) {
        const category = gedsiCategories[i]
        await prisma.gEDSIMetric.create({
          data: {
            ventureId: venture.id,
            createdById: adminUser.id,
            metricCode: `GEDSI_${category}_${i + 1}`,
            metricName: `${category} Impact Metric ${i + 1}`,
            category: category,
            targetValue: Math.floor(Math.random() * 100) + 50,
            currentValue: Math.floor(Math.random() * 80) + 20,
            unit: 'percentage',
            status: 'IN_PROGRESS',
            notes: `Sample ${category.toLowerCase()} metric for ${venture.name}`
          }
        })
      }
      console.log(`📈 Created 4 GEDSI metrics for: ${venture.name}`)
    }

    console.log(`\n🎉 Successfully seeded ${createdVentures.length} ventures with complete data for H arya!`)
    console.log('\n📊 Summary:')
    console.log(`- Ventures created: ${createdVentures.length}`)
    console.log(`- Documents created: ${createdVentures.length * 3}`)
    console.log(`- Activities created: ${createdVentures.length * 5}`)
    console.log(`- GEDSI metrics created: ${createdVentures.length * 4}`)
    
    console.log('\n🏢 Created Ventures:')
    createdVentures.forEach((venture, index) => {
      console.log(`${index + 1}. ${venture.name} - ${venture.sector} (${venture.location})`)
    })

  } catch (error) {
    console.error('❌ Error seeding ventures:', error)
    throw error
  }
}

// Run the seeding
if (require.main === module) {
  seedAdminVentures()
    .then(() => {
      console.log('\n✅ Venture seeding completed successfully!')
      process.exit(0)
    })
    .catch((error) => {
      console.error('❌ Venture seeding failed:', error)
      process.exit(1)
    })
}

export { seedAdminVentures }

