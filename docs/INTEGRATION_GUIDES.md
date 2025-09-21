# MIV Platform Integration Guides

<div align="center">

![Integration Guides](https://img.shields.io/badge/Integration-Guides-blue?style=for-the-badge)
![Third Party](https://img.shields.io/badge/Third%20Party-APIs-green?style=for-the-badge)
![Enterprise](https://img.shields.io/badge/Enterprise-Ready-red?style=for-the-badge)

**Comprehensive integration guides for third-party services and APIs**

</div>

---

## 📋 Table of Contents

- [Integration Overview](#integration-overview)
- [Authentication Integrations](#authentication-integrations)
- [AI & ML Services](#ai--ml-services)
- [Data Enrichment APIs](#data-enrichment-apis)
- [Communication Services](#communication-services)
- [File Storage & CDN](#file-storage--cdn)
- [Analytics & Monitoring](#analytics--monitoring)
- [Financial & Payment APIs](#financial--payment-apis)
- [Compliance & Reporting](#compliance--reporting)

---

## 🔗 Integration Overview

### Integration Architecture
The MIV Platform follows a microservices-based integration approach with centralized API management, ensuring scalability, security, and maintainability of all third-party integrations.

### Integration Principles
- **API-First**: All integrations use well-documented APIs
- **Security-First**: OAuth 2.0, API keys, and encryption standards
- **Fault Tolerance**: Graceful degradation and retry mechanisms
- **Monitoring**: Comprehensive logging and alerting
- **Rate Limiting**: Respect third-party API limits

### Supported Integration Types
- **Authentication**: SSO, OAuth, SAML
- **AI/ML Services**: OpenAI, Anthropic, Google AI
- **Data Enrichment**: Crunchbase, PitchBook, LinkedIn
- **Communication**: Email, SMS, Slack, Teams
- **Storage**: AWS S3, Google Cloud Storage, Azure Blob
- **Analytics**: Google Analytics, Mixpanel, Amplitude
- **Compliance**: DocuSign, HelloSign, compliance APIs

---

## 🔐 Authentication Integrations

### NextAuth.js Configuration

#### Google OAuth Integration
```typescript
// pages/api/auth/[...nextauth].ts
import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: 'openid email profile',
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null
        
        const user = await authenticateUser(credentials.email, credentials.password)
        return user ? { id: user.id, email: user.email, name: user.name } : null
      }
    })
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      session.user.id = token.id as string
      session.user.role = token.role as string
      return session
    }
  },
  pages: {
    signIn: '/auth/login',
    signUp: '/auth/register',
    error: '/auth/error'
  }
})
```

#### Environment Variables
```bash
# Authentication
NEXTAUTH_URL=https://app.miv-platform.com
NEXTAUTH_SECRET=your-secret-key

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Database
DATABASE_URL=postgresql://user:password@host:5432/database
```

### Enterprise SSO Integration

#### Auth0 Integration
```typescript
// lib/auth0.ts
import { initAuth0 } from '@auth0/nextjs-auth0'

export default initAuth0({
  domain: process.env.AUTH0_DOMAIN!,
  clientId: process.env.AUTH0_CLIENT_ID!,
  clientSecret: process.env.AUTH0_CLIENT_SECRET!,
  scope: 'openid profile email',
  redirectUri: process.env.AUTH0_REDIRECT_URI!,
  postLogoutRedirectUri: process.env.AUTH0_POST_LOGOUT_REDIRECT_URI!,
  session: {
    cookieSecret: process.env.AUTH0_COOKIE_SECRET!,
    cookieLifetime: 60 * 60 * 8, // 8 hours
    storeIdToken: false,
    storeAccessToken: false,
    storeRefreshToken: false
  }
})
```

#### SAML Integration
```typescript
// lib/saml.ts
import { Strategy as SamlStrategy } from 'passport-saml'

export const samlStrategy = new SamlStrategy(
  {
    entryPoint: process.env.SAML_ENTRY_POINT!,
    issuer: process.env.SAML_ISSUER!,
    callbackUrl: process.env.SAML_CALLBACK_URL!,
    cert: process.env.SAML_CERT!,
    identifierFormat: 'urn:oasis:names:tc:SAML:2.0:nameid-format:emailAddress',
    signatureAlgorithm: 'sha256',
    digestAlgorithm: 'sha256'
  },
  async (profile, done) => {
    try {
      const user = await findOrCreateUser({
        email: profile.email,
        name: profile.displayName,
        samlId: profile.nameID
      })
      return done(null, user)
    } catch (error) {
      return done(error, null)
    }
  }
)
```

---

## 🤖 AI & ML Services

### OpenAI Integration

#### GPT-4 Configuration
```typescript
// lib/openai.ts
import OpenAI from 'openai'

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
  organization: process.env.OPENAI_ORG_ID,
})

export async function analyzeVentureWithGPT4(ventureData: any) {
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `You are an expert venture analyst specializing in GEDSI (Gender, Equity, Disability, Social Inclusion) assessment. Analyze the venture data and provide insights.`
        },
        {
          role: 'user',
          content: `Analyze this venture: ${JSON.stringify(ventureData)}`
        }
      ],
      temperature: 0.3,
      max_tokens: 1500,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0
    })

    return {
      analysis: completion.choices[0].message.content,
      usage: completion.usage,
      model: completion.model
    }
  } catch (error) {
    console.error('OpenAI API error:', error)
    throw new Error('Failed to analyze venture with GPT-4')
  }
}
```

#### Document Analysis
```typescript
// lib/openai-documents.ts
export async function analyzeDocument(documentText: string, documentType: string) {
  const prompt = `
    Analyze this ${documentType} document for key insights:
    
    Document Content:
    ${documentText}
    
    Please provide:
    1. Executive Summary
    2. Key Financial Metrics
    3. Risk Assessment
    4. GEDSI Alignment Score (0-100)
    5. Recommendations
  `

  const completion = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.2,
    max_tokens: 2000
  })

  return parseDocumentAnalysis(completion.choices[0].message.content)
}
```

### Anthropic Claude Integration

#### Claude Configuration
```typescript
// lib/anthropic.ts
import Anthropic from '@anthropic-ai/sdk'

export const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
})

export async function analyzeVentureWithClaude(ventureData: any) {
  try {
    const message = await anthropic.messages.create({
      model: 'claude-3-opus-20240229',
      max_tokens: 2000,
      temperature: 0.3,
      system: "You are an expert in impact investing and GEDSI analysis. Provide detailed, actionable insights.",
      messages: [
        {
          role: 'user',
          content: `Analyze this venture for impact potential and GEDSI alignment: ${JSON.stringify(ventureData)}`
        }
      ]
    })

    return {
      analysis: message.content[0].text,
      usage: message.usage,
      model: message.model
    }
  } catch (error) {
    console.error('Anthropic API error:', error)
    throw new Error('Failed to analyze venture with Claude')
  }
}
```

### Google AI Integration

#### Gemini Configuration
```typescript
// lib/google-ai.ts
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!)

export async function analyzeVentureWithGemini(ventureData: any) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' })
    
    const prompt = `
      As an expert in venture analysis and social impact assessment, analyze this venture:
      ${JSON.stringify(ventureData)}
      
      Provide insights on:
      1. Market potential
      2. Social impact score
      3. GEDSI alignment
      4. Investment readiness
      5. Risk factors
    `

    const result = await model.generateContent(prompt)
    const response = await result.response
    
    return {
      analysis: response.text(),
      model: 'gemini-pro'
    }
  } catch (error) {
    console.error('Google AI API error:', error)
    throw new Error('Failed to analyze venture with Gemini')
  }
}
```

---

## 📊 Data Enrichment APIs

### Crunchbase Integration

#### Company Data Enrichment
```typescript
// lib/crunchbase.ts
interface CrunchbaseConfig {
  apiKey: string
  baseUrl: string
}

export class CrunchbaseAPI {
  private config: CrunchbaseConfig

  constructor() {
    this.config = {
      apiKey: process.env.CRUNCHBASE_API_KEY!,
      baseUrl: 'https://api.crunchbase.com/api/v4'
    }
  }

  async enrichCompanyData(companyName: string) {
    try {
      const response = await fetch(
        `${this.config.baseUrl}/entities/organizations?name=${encodeURIComponent(companyName)}`,
        {
          headers: {
            'X-cb-user-key': this.config.apiKey,
            'Content-Type': 'application/json'
          }
        }
      )

      if (!response.ok) {
        throw new Error(`Crunchbase API error: ${response.statusText}`)
      }

      const data = await response.json()
      return this.transformCrunchbaseData(data)
    } catch (error) {
      console.error('Crunchbase enrichment error:', error)
      return null
    }
  }

  private transformCrunchbaseData(data: any) {
    return {
      name: data.properties?.name,
      description: data.properties?.short_description,
      website: data.properties?.website,
      foundedDate: data.properties?.founded_on,
      employeeCount: data.properties?.num_employees_enum,
      fundingTotal: data.properties?.funding_total?.value,
      lastFundingDate: data.properties?.last_funding_on,
      industries: data.properties?.categories?.map((cat: any) => cat.name),
      headquarters: data.properties?.location_identifiers?.[0]?.name
    }
  }
}
```

### PitchBook Integration

#### Market Data Enrichment
```typescript
// lib/pitchbook.ts
export class PitchBookAPI {
  private apiKey: string
  private baseUrl: string

  constructor() {
    this.apiKey = process.env.PITCHBOOK_API_KEY!
    this.baseUrl = 'https://api.pitchbook.com/v1'
  }

  async getMarketData(companyId: string) {
    try {
      const response = await fetch(
        `${this.baseUrl}/companies/${companyId}/market-data`,
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      )

      const data = await response.json()
      return {
        valuation: data.valuation,
        fundingRounds: data.funding_rounds,
        investors: data.investors,
        marketSize: data.market_size,
        competitivePosition: data.competitive_position
      }
    } catch (error) {
      console.error('PitchBook API error:', error)
      return null
    }
  }
}
```

### LinkedIn API Integration

#### Professional Network Data
```typescript
// lib/linkedin.ts
export class LinkedInAPI {
  private accessToken: string
  private baseUrl: string

  constructor(accessToken: string) {
    this.accessToken = accessToken
    this.baseUrl = 'https://api.linkedin.com/v2'
  }

  async getPersonProfile(personId: string) {
    try {
      const response = await fetch(
        `${this.baseUrl}/people/(id:${personId})`,
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      )

      const data = await response.json()
      return {
        name: `${data.firstName.localized.en_US} ${data.lastName.localized.en_US}`,
        headline: data.headline.localized.en_US,
        industry: data.industry,
        location: data.location?.name,
        profileUrl: data.vanityName ? `https://linkedin.com/in/${data.vanityName}` : null
      }
    } catch (error) {
      console.error('LinkedIn API error:', error)
      return null
    }
  }

  async getCompanyProfile(companyId: string) {
    try {
      const response = await fetch(
        `${this.baseUrl}/companies/${companyId}`,
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      )

      const data = await response.json()
      return {
        name: data.name,
        description: data.description,
        website: data.website,
        industry: data.industries?.[0],
        employeeCount: data.staffCount,
        founded: data.foundedOn?.year,
        headquarters: data.locations?.[0]?.description
      }
    } catch (error) {
      console.error('LinkedIn API error:', error)
      return null
    }
  }
}
```

---

## 📧 Communication Services

### Email Integration (SendGrid)

#### Email Service Configuration
```typescript
// lib/email.ts
import sgMail from '@sendgrid/mail'

sgMail.setApiKey(process.env.SENDGRID_API_KEY!)

export class EmailService {
  async sendWelcomeEmail(to: string, name: string) {
    const msg = {
      to,
      from: process.env.FROM_EMAIL!,
      templateId: process.env.WELCOME_TEMPLATE_ID!,
      dynamicTemplateData: {
        name,
        loginUrl: `${process.env.NEXTAUTH_URL}/auth/login`,
        supportEmail: process.env.SUPPORT_EMAIL!
      }
    }

    try {
      await sgMail.send(msg)
      console.log('Welcome email sent successfully')
    } catch (error) {
      console.error('Email sending error:', error)
      throw new Error('Failed to send welcome email')
    }
  }

  async sendVentureStatusUpdate(to: string, ventureName: string, status: string) {
    const msg = {
      to,
      from: process.env.FROM_EMAIL!,
      templateId: process.env.STATUS_UPDATE_TEMPLATE_ID!,
      dynamicTemplateData: {
        ventureName,
        status,
        dashboardUrl: `${process.env.NEXTAUTH_URL}/dashboard/ventures`
      }
    }

    try {
      await sgMail.send(msg)
    } catch (error) {
      console.error('Status update email error:', error)
      throw new Error('Failed to send status update email')
    }
  }

  async sendGEDSIReport(to: string, reportData: any) {
    const msg = {
      to,
      from: process.env.FROM_EMAIL!,
      subject: 'Monthly GEDSI Impact Report',
      html: this.generateGEDSIReportHTML(reportData),
      attachments: [{
        content: reportData.pdfBase64,
        filename: 'gedsi-report.pdf',
        type: 'application/pdf',
        disposition: 'attachment'
      }]
    }

    try {
      await sgMail.send(msg)
    } catch (error) {
      console.error('GEDSI report email error:', error)
      throw new Error('Failed to send GEDSI report')
    }
  }

  private generateGEDSIReportHTML(reportData: any): string {
    return `
      <html>
        <body>
          <h2>Monthly GEDSI Impact Report</h2>
          <p>Dear ${reportData.recipientName},</p>
          <p>Please find attached your monthly GEDSI impact report.</p>
          
          <h3>Key Highlights:</h3>
          <ul>
            <li>Total Ventures: ${reportData.totalVentures}</li>
            <li>Women-led Ventures: ${reportData.womenLedVentures}</li>
            <li>Average GEDSI Score: ${reportData.averageGEDSIScore}</li>
            <li>Impact Beneficiaries: ${reportData.totalBeneficiaries}</li>
          </ul>
          
          <p>Best regards,<br>MIV Platform Team</p>
        </body>
      </html>
    `
  }
}
```

### Slack Integration

#### Slack Notifications
```typescript
// lib/slack.ts
import { WebClient } from '@slack/web-api'

export class SlackService {
  private client: WebClient

  constructor() {
    this.client = new WebClient(process.env.SLACK_BOT_TOKEN!)
  }

  async sendNotification(channel: string, message: string) {
    try {
      await this.client.chat.postMessage({
        channel,
        text: message,
        username: 'MIV Platform',
        icon_emoji: ':rocket:'
      })
    } catch (error) {
      console.error('Slack notification error:', error)
      throw new Error('Failed to send Slack notification')
    }
  }

  async sendVentureAlert(ventureData: any) {
    const blocks = [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*New Venture Submitted*\n${ventureData.name}`
        }
      },
      {
        type: 'section',
        fields: [
          {
            type: 'mrkdwn',
            text: `*Sector:*\n${ventureData.sector}`
          },
          {
            type: 'mrkdwn',
            text: `*Location:*\n${ventureData.location}`
          },
          {
            type: 'mrkdwn',
            text: `*GEDSI Score:*\n${ventureData.gedsiScore}/100`
          },
          {
            type: 'mrkdwn',
            text: `*Submitted:*\n${new Date().toLocaleDateString()}`
          }
        ]
      },
      {
        type: 'actions',
        elements: [
          {
            type: 'button',
            text: {
              type: 'plain_text',
              text: 'Review Venture'
            },
            url: `${process.env.NEXTAUTH_URL}/dashboard/ventures/${ventureData.id}`
          }
        ]
      }
    ]

    try {
      await this.client.chat.postMessage({
        channel: process.env.SLACK_VENTURES_CHANNEL!,
        blocks
      })
    } catch (error) {
      console.error('Slack venture alert error:', error)
    }
  }
}
```

### Microsoft Teams Integration

#### Teams Webhook
```typescript
// lib/teams.ts
export class TeamsService {
  private webhookUrl: string

  constructor() {
    this.webhookUrl = process.env.TEAMS_WEBHOOK_URL!
  }

  async sendAdaptiveCard(title: string, data: any) {
    const card = {
      type: 'message',
      attachments: [{
        contentType: 'application/vnd.microsoft.card.adaptive',
        content: {
          type: 'AdaptiveCard',
          version: '1.2',
          body: [
            {
              type: 'TextBlock',
              text: title,
              weight: 'Bolder',
              size: 'Medium'
            },
            {
              type: 'FactSet',
              facts: Object.entries(data).map(([key, value]) => ({
                title: key,
                value: String(value)
              }))
            }
          ],
          actions: [{
            type: 'Action.OpenUrl',
            title: 'View Details',
            url: `${process.env.NEXTAUTH_URL}/dashboard`
          }]
        }
      }]
    }

    try {
      await fetch(this.webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(card)
      })
    } catch (error) {
      console.error('Teams notification error:', error)
    }
  }
}
```

---

## 💾 File Storage & CDN

### AWS S3 Integration

#### S3 Configuration
```typescript
// lib/aws-s3.ts
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

export class S3Service {
  private client: S3Client
  private bucketName: string

  constructor() {
    this.client = new S3Client({
      region: process.env.AWS_REGION!,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
      }
    })
    this.bucketName = process.env.S3_BUCKET_NAME!
  }

  async uploadDocument(file: Buffer, key: string, contentType: string) {
    try {
      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
        Body: file,
        ContentType: contentType,
        ServerSideEncryption: 'AES256',
        Metadata: {
          uploadedAt: new Date().toISOString(),
          platform: 'miv-platform'
        }
      })

      await this.client.send(command)
      return {
        key,
        url: `https://${this.bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`,
        success: true
      }
    } catch (error) {
      console.error('S3 upload error:', error)
      throw new Error('Failed to upload document to S3')
    }
  }

  async getSignedDownloadUrl(key: string, expiresIn: number = 3600) {
    try {
      const command = new GetObjectCommand({
        Bucket: this.bucketName,
        Key: key
      })

      return await getSignedUrl(this.client, command, { expiresIn })
    } catch (error) {
      console.error('S3 signed URL error:', error)
      throw new Error('Failed to generate signed URL')
    }
  }

  async deleteDocument(key: string) {
    try {
      const command = new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: key
      })

      await this.client.send(command)
      return { success: true }
    } catch (error) {
      console.error('S3 delete error:', error)
      throw new Error('Failed to delete document from S3')
    }
  }
}
```

### CloudFront CDN Integration

#### CDN Configuration
```typescript
// lib/cloudfront.ts
import { CloudFrontClient, CreateInvalidationCommand } from '@aws-sdk/client-cloudfront'

export class CloudFrontService {
  private client: CloudFrontClient
  private distributionId: string

  constructor() {
    this.client = new CloudFrontClient({
      region: process.env.AWS_REGION!,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
      }
    })
    this.distributionId = process.env.CLOUDFRONT_DISTRIBUTION_ID!
  }

  async invalidateCache(paths: string[]) {
    try {
      const command = new CreateInvalidationCommand({
        DistributionId: this.distributionId,
        InvalidationBatch: {
          Paths: {
            Quantity: paths.length,
            Items: paths
          },
          CallerReference: Date.now().toString()
        }
      })

      const result = await this.client.send(command)
      return { invalidationId: result.Invalidation?.Id, success: true }
    } catch (error) {
      console.error('CloudFront invalidation error:', error)
      throw new Error('Failed to invalidate CloudFront cache')
    }
  }

  getOptimizedUrl(key: string, transformations?: any) {
    const baseUrl = `https://${process.env.CLOUDFRONT_DOMAIN}/${key}`
    
    if (!transformations) return baseUrl
    
    const params = new URLSearchParams()
    if (transformations.width) params.append('w', transformations.width)
    if (transformations.height) params.append('h', transformations.height)
    if (transformations.quality) params.append('q', transformations.quality)
    if (transformations.format) params.append('f', transformations.format)
    
    return `${baseUrl}?${params.toString()}`
  }
}
```

---

## 📈 Analytics & Monitoring

### Google Analytics Integration

#### GA4 Configuration
```typescript
// lib/analytics.ts
import { GoogleAnalytics } from '@next/third-parties/google'

export class AnalyticsService {
  private gaId: string

  constructor() {
    this.gaId = process.env.GOOGLE_ANALYTICS_ID!
  }

  trackEvent(eventName: string, parameters: any) {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', eventName, {
        ...parameters,
        custom_parameter_platform: 'miv-platform'
      })
    }
  }

  trackVentureSubmission(ventureData: any) {
    this.trackEvent('venture_submitted', {
      venture_sector: ventureData.sector,
      venture_location: ventureData.location,
      gedsi_score: ventureData.gedsiScore,
      founder_types: ventureData.founderTypes.join(',')
    })
  }

  trackUserAction(action: string, category: string, label?: string) {
    this.trackEvent('user_action', {
      action,
      category,
      label,
      timestamp: new Date().toISOString()
    })
  }

  trackPageView(page: string, title: string) {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('config', this.gaId, {
        page_title: title,
        page_location: window.location.href,
        page_path: page
      })
    }
  }
}
```

### Mixpanel Integration

#### Event Tracking
```typescript
// lib/mixpanel.ts
import mixpanel from 'mixpanel-browser'

export class MixpanelService {
  constructor() {
    if (typeof window !== 'undefined') {
      mixpanel.init(process.env.NEXT_PUBLIC_MIXPANEL_TOKEN!, {
        debug: process.env.NODE_ENV === 'development',
        track_pageview: true,
        persistence: 'localStorage'
      })
    }
  }

  identify(userId: string, properties?: any) {
    if (typeof window !== 'undefined') {
      mixpanel.identify(userId)
      if (properties) {
        mixpanel.people.set(properties)
      }
    }
  }

  track(eventName: string, properties?: any) {
    if (typeof window !== 'undefined') {
      mixpanel.track(eventName, {
        ...properties,
        platform: 'miv-platform',
        timestamp: new Date().toISOString()
      })
    }
  }

  trackVentureAnalytics(action: string, ventureData: any) {
    this.track(`venture_${action}`, {
      venture_id: ventureData.id,
      venture_name: ventureData.name,
      sector: ventureData.sector,
      gedsi_score: ventureData.gedsiScore,
      stage: ventureData.stage
    })
  }

  trackGEDSIMetrics(metricData: any) {
    this.track('gedsi_metric_updated', {
      metric_code: metricData.metricCode,
      category: metricData.category,
      current_value: metricData.currentValue,
      target_value: metricData.targetValue,
      completion_percentage: (metricData.currentValue / metricData.targetValue) * 100
    })
  }
}
```

---

## 💳 Financial & Payment APIs

### Stripe Integration

#### Payment Processing
```typescript
// lib/stripe.ts
import Stripe from 'stripe'

export class StripeService {
  private stripe: Stripe

  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2023-10-16'
    })
  }

  async createSubscription(customerId: string, priceId: string) {
    try {
      const subscription = await this.stripe.subscriptions.create({
        customer: customerId,
        items: [{ price: priceId }],
        payment_behavior: 'default_incomplete',
        payment_settings: { save_default_payment_method: 'on_subscription' },
        expand: ['latest_invoice.payment_intent']
      })

      return {
        subscriptionId: subscription.id,
        clientSecret: (subscription.latest_invoice as any)?.payment_intent?.client_secret,
        status: subscription.status
      }
    } catch (error) {
      console.error('Stripe subscription error:', error)
      throw new Error('Failed to create subscription')
    }
  }

  async handleWebhook(payload: string, signature: string) {
    try {
      const event = this.stripe.webhooks.constructEvent(
        payload,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET!
      )

      switch (event.type) {
        case 'invoice.payment_succeeded':
          await this.handlePaymentSuccess(event.data.object as Stripe.Invoice)
          break
        case 'invoice.payment_failed':
          await this.handlePaymentFailure(event.data.object as Stripe.Invoice)
          break
        case 'customer.subscription.deleted':
          await this.handleSubscriptionCanceled(event.data.object as Stripe.Subscription)
          break
      }

      return { received: true }
    } catch (error) {
      console.error('Stripe webhook error:', error)
      throw new Error('Webhook signature verification failed')
    }
  }

  private async handlePaymentSuccess(invoice: Stripe.Invoice) {
    // Update user subscription status
    console.log('Payment succeeded for invoice:', invoice.id)
  }

  private async handlePaymentFailure(invoice: Stripe.Invoice) {
    // Handle failed payment
    console.log('Payment failed for invoice:', invoice.id)
  }

  private async handleSubscriptionCanceled(subscription: Stripe.Subscription) {
    // Handle subscription cancellation
    console.log('Subscription canceled:', subscription.id)
  }
}
```

---

## 📋 Compliance & Reporting

### DocuSign Integration

#### Document Signing
```typescript
// lib/docusign.ts
import { ApiClient, EnvelopesApi, EnvelopeDefinition } from 'docusign-esign'

export class DocuSignService {
  private apiClient: ApiClient
  private accountId: string

  constructor() {
    this.apiClient = new ApiClient()
    this.apiClient.setBasePath(process.env.DOCUSIGN_BASE_PATH!)
    this.accountId = process.env.DOCUSIGN_ACCOUNT_ID!
  }

  async sendDocumentForSigning(recipientEmail: string, recipientName: string, documentBase64: string) {
    try {
      const envelopeDefinition: EnvelopeDefinition = {
        emailSubject: 'Please sign this document - MIV Platform',
        documents: [{
          documentBase64,
          name: 'Agreement.pdf',
          fileExtension: 'pdf',
          documentId: '1'
        }],
        recipients: {
          signers: [{
            email: recipientEmail,
            name: recipientName,
            recipientId: '1',
            tabs: {
              signHereTabs: [{
                anchorString: '/sn1/',
                anchorUnits: 'pixels',
                anchorXOffset: '20',
                anchorYOffset: '10'
              }]
            }
          }]
        },
        status: 'sent'
      }

      const envelopesApi = new EnvelopesApi(this.apiClient)
      const result = await envelopesApi.createEnvelope(this.accountId, { envelopeDefinition })
      
      return {
        envelopeId: result.envelopeId,
        status: result.status,
        statusDateTime: result.statusDateTime
      }
    } catch (error) {
      console.error('DocuSign error:', error)
      throw new Error('Failed to send document for signing')
    }
  }
}
```

### Compliance Reporting APIs

#### IRIS+ Reporting
```typescript
// lib/iris-reporting.ts
export class IRISReportingService {
  async generateIRISReport(ventures: any[], dateRange: { start: Date; end: Date }) {
    const report = {
      reportId: `IRIS-${Date.now()}`,
      generatedAt: new Date().toISOString(),
      dateRange,
      summary: {
        totalVentures: ventures.length,
        totalBeneficiaries: 0,
        genderMetrics: {},
        disabilityMetrics: {},
        socialInclusionMetrics: {}
      },
      metrics: []
    }

    for (const venture of ventures) {
      const ventureMetrics = await this.calculateVentureIRISMetrics(venture)
      report.metrics.push(ventureMetrics)
      
      // Aggregate summary data
      report.summary.totalBeneficiaries += ventureMetrics.beneficiaries || 0
    }

    return report
  }

  private async calculateVentureIRISMetrics(venture: any) {
    // Calculate IRIS+ metrics for individual venture
    return {
      ventureId: venture.id,
      ventureName: venture.name,
      metrics: {
        'OI.1': venture.gedsiMetrics.find((m: any) => m.metricCode === 'OI.1')?.currentValue || 0,
        'OI.2': venture.gedsiMetrics.find((m: any) => m.metricCode === 'OI.2')?.currentValue || 0,
        // ... other IRIS+ metrics
      },
      beneficiaries: this.calculateBeneficiaries(venture),
      impactScore: venture.impactScore || 0
    }
  }

  private calculateBeneficiaries(venture: any): number {
    // Calculate beneficiaries based on sector and metrics
    const baseMultiplier = venture.teamSize || 1
    const sectorMultipliers = {
      'HealthTech': 100,
      'EdTech': 50,
      'FinTech': 200,
      'Agriculture': 75
    }
    
    return baseMultiplier * (sectorMultipliers[venture.sector as keyof typeof sectorMultipliers] || 25)
  }
}
```

---

## 🔧 Integration Testing

### Testing Third-party Integrations

#### Mock Services for Testing
```typescript
// __tests__/mocks/openai.ts
export const mockOpenAI = {
  chat: {
    completions: {
      create: jest.fn().mockResolvedValue({
        choices: [{
          message: {
            content: 'Mock AI analysis response'
          }
        }],
        usage: { total_tokens: 100 },
        model: 'gpt-4'
      })
    }
  }
}

// __tests__/integration/ai-services.test.ts
import { analyzeVentureWithGPT4 } from '../../lib/openai'

jest.mock('openai', () => ({
  __esModule: true,
  default: jest.fn(() => mockOpenAI)
}))

describe('AI Services Integration', () => {
  it('should analyze venture with GPT-4', async () => {
    const ventureData = {
      name: 'Test Venture',
      sector: 'FinTech',
      founderTypes: ['women-led']
    }

    const result = await analyzeVentureWithGPT4(ventureData)
    
    expect(result).toHaveProperty('analysis')
    expect(result).toHaveProperty('usage')
    expect(result.model).toBe('gpt-4')
  })
})
```

#### Integration Test Environment
```yaml
# docker-compose.test.yml
version: '3.8'
services:
  miv-platform:
    build: .
    environment:
      - NODE_ENV=test
      - DATABASE_URL=postgresql://test:test@postgres:5432/miv_test
      - OPENAI_API_KEY=test-key
      - ANTHROPIC_API_KEY=test-key
    depends_on:
      - postgres
      - redis

  postgres:
    image: postgres:15
    environment:
      - POSTGRES_DB=miv_test
      - POSTGRES_USER=test
      - POSTGRES_PASSWORD=test

  redis:
    image: redis:7-alpine

  wiremock:
    image: wiremock/wiremock:latest
    ports:
      - "8080:8080"
    volumes:
      - ./test/wiremock:/home/wiremock
```

---

<div align="center">

**🔗 Seamless integrations for enterprise connectivity**

[![Integration Tests](https://github.com/miv-platform/miv-platform/workflows/Integration%20Tests/badge.svg)](https://github.com/miv-platform/miv-platform/actions)
[![API Coverage](https://img.shields.io/badge/API%20Coverage-15%2B%20Services-brightgreen)](https://docs.miv-platform.com/integrations)

</div>
