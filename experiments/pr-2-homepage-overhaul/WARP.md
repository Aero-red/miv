# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

MIV (Mekong Inclusive Ventures) is an enterprise-grade venture pipeline management platform built for impact investing. The platform specializes in:

- **AI-powered venture analysis** with multi-model architecture (OpenAI, Anthropic, Google AI)
- **GEDSI integration** (Gender, Equity, Disability, Social Inclusion) with IRIS+ compliance
- **Real-time venture pipeline management** from intake to exit
- **Impact measurement** with comprehensive ESG tracking
- **Capital facilitation** and investment management

## Technology Stack

- **Frontend**: Next.js 15 with App Router, React 19, TypeScript 5.0, Tailwind CSS 4.0
- **UI Components**: Radix UI + shadcn/ui for accessibility-first design
- **Database**: Prisma ORM with SQLite (dev) → PostgreSQL (production migration planned)
- **AI Integration**: Multi-model AI with OpenAI GPT-4, Anthropic Claude, Google Gemini
- **Authentication**: NextAuth.js (currently bypassed in development)
- **Validation**: Zod schemas for type-safe API validation

## Common Development Commands

### Database Operations
```bash
# Generate Prisma client after schema changes
npm run db:generate

# Push database schema changes (development)
npm run db:push

# Run database migrations (production)
npm run db:migrate

# Open Prisma Studio for database management
npm run db:studio

# Seed database with sample data
npm run db:seed
```

### Development Workflow
```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint

# Install dependencies
npm install
```

### Testing Individual Components
- Visit `/dashboard/venture-intake` for the main venture intake form
- Visit `/dashboard/gedsi-tracker` for GEDSI metrics tracking
- API endpoints are available at `/api/ventures`, `/api/gedsi-metrics`, `/api/ai/*`

## Architecture Overview

### Application Structure

#### Frontend Architecture
- **App Router Pattern**: Uses Next.js 15 App Router with nested layouts
- **Dashboard Layout**: `app/dashboard/layout.tsx` provides the main application shell
- **Component-based**: Reusable UI components in `components/ui/` (shadcn/ui) and custom enterprise components in `components/enterprise/`
- **Client-side State**: Uses React hooks with client-side navigation

#### Backend Architecture
- **API Routes**: RESTful APIs in `app/api/` following Next.js App Router conventions
- **Database Layer**: Prisma ORM with comprehensive schema for ventures, users, GEDSI metrics, documents, activities, and capital activities
- **AI Services**: Centralized AI service layer in `lib/ai-services.ts` for venture analysis, risk assessment, and GEDSI insights
- **Authentication**: NextAuth.js integration (currently disabled for development)

### Database Schema Highlights

#### Core Entities
- **Ventures**: Complete venture lifecycle tracking with stages (INTAKE → SCREENING → DUE_DILIGENCE → INVESTMENT_READY → FUNDED → EXITED)
- **GEDSIMetric**: IRIS+ compliant metrics with categories (GENDER, DISABILITY, SOCIAL_INCLUSION, CROSS_CUTTING)
- **Users**: Role-based access (ADMIN, MANAGER, ANALYST, USER) with flexible permissions
- **Activities**: Comprehensive audit trail for all venture interactions
- **CapitalActivity**: Investment tracking with multiple types (GRANT, DEBT, EQUITY, CONVERTIBLE_NOTE)

#### Key Relationships
- Ventures have many GEDSI metrics, documents, activities, and capital activities
- Users create and are assigned to ventures
- Activity tracking maintains complete audit trails
- IRIS+ metric catalog for standardized impact measurement

### Navigation Structure
The application follows a hierarchical navigation pattern:
- **Dashboard**: Main analytics and overview
- **Pipeline Management**: Venture intake, deal flow, due diligence, portfolio
- **Analytics & Insights**: Performance analytics, AI analysis, advanced reports, custom dashboards
- **Capital Management**: Capital facilitation, investment rounds, fund management, exit strategy
- **Impact & GEDSI**: GEDSI tracker, impact reports, sustainability metrics, social impact
- **Operations**: Team management, document management, calendar, system settings

## Key Development Patterns

### Component Development
- Use `components/ui/` for base UI components (button, input, card, etc.)
- Use `components/enterprise/` for complex business logic components
- Follow the shadcn/ui pattern for consistent styling and accessibility
- All components are TypeScript with proper prop types

### API Development
- APIs use Zod schemas for validation (see `app/api/ventures/route.ts`)
- Follow REST conventions: GET for listing/fetching, POST for creation
- Include comprehensive error handling and status codes
- Development mode bypasses authentication for easier testing
- Async AI analysis happens after main operations to avoid blocking

### Database Operations
- Always use Prisma client from `lib/prisma.ts`
- Include relationships in queries when needed for UI display
- Use transactions for complex multi-table operations
- Activity logging for all significant venture changes

### AI Integration
- AI services are centralized in `lib/ai-services.ts`
- Multiple AI models for different use cases (GPT-4, Claude, Gemini)
- Async AI analysis to avoid blocking user operations
- Store AI results as activities for audit trail

## Environment Setup

### Required Environment Variables
```bash
# Database
DATABASE_URL="file:./prisma/dev.db"  # SQLite for development

# AI Services (for AI-powered analysis)
OPENAI_API_KEY="your-openai-api-key"
ANTHROPIC_API_KEY="your-anthropic-api-key"
GOOGLE_AI_API_KEY="your-google-ai-api-key"

# NextAuth (when authentication is enabled)
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-nextauth-secret"
```

### Development Notes
- Authentication is currently bypassed in development mode
- Default user is auto-created for venture assignments
- AI analysis runs asynchronously after venture creation
- Database uses SQLite for development, PostgreSQL for production

## Important Business Logic

### GEDSI Integration
- Washington Group Short Set questions for disability inclusion assessment
- IRIS+ metrics compliance for standardized impact measurement
- Gender lens investing criteria (2X Challenge compliance)
- Comprehensive disaggregation by gender, disability, social inclusion

### Venture Pipeline
- Multi-stage venture progression with automated workflows
- AI-powered venture screening and risk assessment
- Document management with automated analysis
- Capital readiness assessment and investment facilitation

### Impact Measurement
- Real-time GEDSI metrics tracking
- Automated compliance monitoring
- Impact reporting with visualization
- Sustainability metrics integration

## Migration Planning

The platform is designed for enterprise deployment with:
- **Database Migration**: SQLite → PostgreSQL with full schema migration
- **Authentication**: NextAuth.js integration with proper session management
- **AI Gateway**: Centralized AI service management
- **Microservices**: Modular service architecture for scalability
- **Kubernetes**: Container orchestration for production deployment

## File Organization

- `app/` - Next.js App Router pages and API routes
- `components/` - React components (UI and enterprise)
- `lib/` - Utility functions, database client, AI services
- `prisma/` - Database schema, migrations, and seed data
- `docs/` - Comprehensive documentation and architecture guides
- `public/` - Static assets

The codebase follows enterprise patterns with comprehensive documentation, type safety, and scalable architecture for venture capital operations.