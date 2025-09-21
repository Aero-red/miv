# MIV Platform Development Setup

<div align="center">

![Development](https://img.shields.io/badge/Development-Setup-blue?style=for-the-badge)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge)
![Enterprise](https://img.shields.io/badge/Enterprise-Ready-red?style=for-the-badge)

**Complete development environment setup for MIV Platform**

</div>

---

## 📋 Table of Contents

- [Quick Start Guide](#quick-start-guide)
- [Prerequisites](#prerequisites)
- [Database Setup](#database-setup)
- [Environment Configuration](#environment-configuration)
- [Development Workflow](#development-workflow)
- [Testing](#testing)
- [Debugging](#debugging)
- [Deployment](#deployment)
- [Resources](#resources)

---

## 🚀 Quick Start Guide

### 1. Clone Repository

```bash
git clone https://github.com/your-org/miv-platform.git
cd miv-platform
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment

```bash
cp .env.example .env.local
# Edit .env.local with your configuration
```

### 4. Set Up Database (SQLite dev)

```bash
npm run db:generate
npm run db:push
npm run db:seed
```

### 5. Start Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the application running!

---

## 📋 Prerequisites

### Required Software

| Software | Version | Purpose |
|----------|---------|---------|
| **Node.js** | 20.x LTS | JavaScript runtime |
| **Git** | 2.x | Version control |
| **Docker** | 20.x | Containerization (optional) |

### Development Tools

| Tool | Purpose | Installation |
|------|---------|--------------|
| **VS Code** | Code editor | [Download](https://code.visualstudio.com/) |
| **Postman** | API testing | [Download](https://www.postman.com/) |
| **Prisma Studio** | DB browser for Prisma/SQLite | [Docs](https://www.prisma.io/docs/concepts/components/prisma-studio) |

### VS Code Extensions

```json
{
  "recommendations": [
    "ms-vscode.vscode-typescript-next",
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-eslint",
    "prisma.prisma",
    "ms-vscode.vscode-json",
    "formulahendry.auto-rename-tag",
    "christian-kohler.path-intellisense"
  ]
}
```

---

## 🗄️ Database Setup
SQLite is used for local development. The database file lives at `prisma/dev.db`.

### Database Configuration

#### **Prisma Schema**

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = "file:./dev.db"
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  role      UserRole @default(VIEWER)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Venture {
  id          String   @id @default(cuid())
  name        String
  description String?
  stage       Stage    @default(SCREENING)
  status      Status   @default(ACTIVE)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

enum UserRole {
  ADMIN
  INVESTMENT_MANAGER
  ANALYST
  VIEWER
}

enum Stage {
  SCREENING
  DUE_DILIGENCE
  INVESTMENT_COMMITTEE
  NEGOTIATION
  CLOSING
  PORTFOLIO
}

enum Status {
  ACTIVE
  INACTIVE
  ARCHIVED
}
```

#### **Database Commands**

```bash
# Generate Prisma client
npm run db:generate

# Run migrations
npm run db:migrate

# Seed database
npm run db:seed

# Reset database
npm run db:reset

# Open Prisma Studio
npm run db:studio
```

---

## ⚙️ Environment Configuration

### Environment Variables

Create a `.env.local` file in the root directory:

```bash
# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-nextauth-secret"

# Google OAuth (optional)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# AI Services (optional)
OPENAI_API_KEY="..."
ANTHROPIC_API_KEY="..."
GOOGLE_GENERATIVE_AI_API_KEY="..."
```

### Environment Validation

```typescript
// lib/env.ts
import { z } from 'zod'

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  REDIS_URL: z.string().url(),
  AUTH0_DOMAIN: z.string(),
  AUTH0_CLIENT_ID: z.string(),
  AUTH0_CLIENT_SECRET: z.string(),
  NEXTAUTH_SECRET: z.string(),
  NEXTAUTH_URL: z.string().url(),
  OPENAI_API_KEY: z.string(),
  ANTHROPIC_API_KEY: z.string(),
  GOOGLE_AI_API_KEY: z.string(),
})

export const env = envSchema.parse(process.env)
```

---

## 🔄 Development Workflow

### Available Scripts

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    
    "db:generate": "prisma generate",
    "db:push": "prisma db push",
    "db:migrate": "prisma migrate dev",
    "db:seed": "tsx prisma/seed.ts",
    "db:studio": "prisma studio",
    "db:reset": "prisma migrate reset",
    "db:setup": "npm run db:generate && npm run db:migrate && npm run db:seed"
  }
}
```

### Code Quality Tools

#### **ESLint Configuration**

```javascript
// eslint.config.mjs
import js from '@eslint/js'
import typescript from '@typescript-eslint/eslint-plugin'
import typescriptParser from '@typescript-eslint/parser'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import next from '@next/eslint-config-next'

export default [
  js.configs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: { jsx: true },
      },
    },
    plugins: {
      '@typescript-eslint': typescript,
      react,
      'react-hooks': reactHooks,
    },
    rules: {
      ...typescript.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      '@typescript-eslint/no-unused-vars': 'error',
      '@typescript-eslint/explicit-function-return-type': 'off',
      'react/react-in-jsx-scope': 'off',
    },
  },
  ...next,
]
```

#### **Prettier Configuration**

```json
{
  "semi": false,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false
}
```

#### **Husky Pre-commit Hooks**

```json
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged"
    }
  },
  "lint-staged": {
    "*.{ts,tsx}": [
      "eslint --fix",
      "prettier --write"
    ],
    "*.{json,md}": [
      "prettier --write"
    ]
  }
}
```

### Git Workflow

#### **Branch Naming Convention**

```bash
# Feature branches
feature/venture-management
feature/gedsi-analytics
feature/ai-integration

# Bug fixes
fix/login-authentication
fix/database-connection

# Hotfixes
hotfix/security-patch
hotfix/critical-bug
```

#### **Commit Message Format**

```bash
# Format: type(scope): description
feat(ventures): add venture creation form
fix(auth): resolve login authentication issue
docs(api): update API documentation
test(analytics): add unit tests for analytics module
```

---

## 🧪 Testing

### Testing Framework
This repository does not include a preconfigured Jest setup. Add tests as needed.

### Test Examples

#### **Unit Tests**

```typescript
// __tests__/lib/utils.test.ts
import { formatCurrency, calculateGEDSIScore } from '@/lib/utils'

describe('Utils', () => {
  describe('formatCurrency', () => {
    it('formats USD currency correctly', () => {
      expect(formatCurrency(1000000, 'USD')).toBe('$1,000,000')
    })

    it('formats THB currency correctly', () => {
      expect(formatCurrency(1000000, 'THB')).toBe('฿1,000,000')
    })
  })

  describe('calculateGEDSIScore', () => {
    it('calculates GEDSI score correctly', () => {
      const metrics = {
        gender_diversity: 75,
        disability_inclusion: 60,
        social_inclusion: 80,
      }
      expect(calculateGEDSIScore(metrics)).toBe(72)
    })
  })
})
```

#### **Component Tests**

```typescript
// __tests__/components/VentureCard.test.tsx
import { render, screen } from '@testing-library/react'
import { VentureCard } from '@/components/VentureCard'

const mockVenture = {
  id: 'ven_123',
  name: 'EcoTech Solutions',
  description: 'Sustainable technology solutions',
  stage: 'due_diligence',
  gedsi_score: 85,
}

describe('VentureCard', () => {
  it('renders venture information correctly', () => {
    render(<VentureCard venture={mockVenture} />)
    
    expect(screen.getByText('EcoTech Solutions')).toBeInTheDocument()
    expect(screen.getByText('Sustainable technology solutions')).toBeInTheDocument()
    expect(screen.getByText('Due Diligence')).toBeInTheDocument()
    expect(screen.getByText('85')).toBeInTheDocument()
  })
})
```

#### **API Tests**

```typescript
// __tests__/api/ventures.test.ts
import { createMocks } from 'node-mocks-http'
import { GET, POST } from '@/app/api/ventures/route'

describe('/api/ventures', () => {
  it('GET returns list of ventures', async () => {
    const { req, res } = createMocks({
      method: 'GET',
      query: { page: '1', limit: '10' },
    })

    await GET(req, res)

    expect(res._getStatusCode()).toBe(200)
    const data = JSON.parse(res._getData())
    expect(data.success).toBe(true)
    expect(Array.isArray(data.data)).toBe(true)
  })

  it('POST creates new venture', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: {
        name: 'Test Venture',
        description: 'Test description',
      },
    })

    await POST(req, res)

    expect(res._getStatusCode()).toBe(201)
    const data = JSON.parse(res._getData())
    expect(data.success).toBe(true)
    expect(data.data.name).toBe('Test Venture')
  })
})
```

### Test Coverage

```bash
# Run tests with coverage
npm run test:coverage

# Coverage report will be generated in coverage/
# Open coverage/lcov-report/index.html in browser
```

---

## 🐛 Debugging

### VS Code Debug Configuration

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Next.js: debug server-side",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/node_modules/next/dist/bin/next",
      "args": ["dev"],
      "cwd": "${workspaceFolder}",
      "console": "integratedTerminal",
      "skipFiles": ["<node_internals>/**"]
    },
    {
      "name": "Next.js: debug client-side",
      "type": "chrome",
      "request": "launch",
      "url": "http://localhost:3000",
      "webRoot": "${workspaceFolder}"
    },
    {
      "name": "Next.js: debug full stack",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/node_modules/next/dist/bin/next",
      "args": ["dev"],
      "cwd": "${workspaceFolder}",
      "console": "integratedTerminal",
      "skipFiles": ["<node_internals>/**"],
      "serverReadyAction": {
        "pattern": "started server on .+, url: (https?://.+)",
        "uriFormat": "%s",
        "action": "debugWithChrome"
      }
    }
  ]
}
```

### Debugging Tools

#### **React Developer Tools**

```bash
# Install browser extension
# Chrome: https://chrome.google.com/webstore/detail/react-developer-tools
# Firefox: https://addons.mozilla.org/en-US/firefox/addon/react-devtools/
```

#### **Redux DevTools**

```bash
# Install browser extension
# Chrome: https://chrome.google.com/webstore/detail/redux-devtools
# Firefox: https://addons.mozilla.org/en-US/firefox/addon/reduxdevtools/
```

#### **Network Debugging**

```typescript
// lib/api.ts
const apiClient = {
  get: async (url: string) => {
    console.log(`GET ${url}`)
    const response = await fetch(url)
    console.log(`Response:`, response)
    return response.json()
  },
  post: async (url: string, data: any) => {
    console.log(`POST ${url}`, data)
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    console.log(`Response:`, response)
    return response.json()
  },
}
```

### Common Debugging Scenarios

#### **Database Issues**

```bash
# Check database connection
npm run db:studio

# View database logs
tail -f /var/log/postgresql/postgresql-15-main.log

# Test connection
psql -h localhost -U username -d miv_platform_dev
```

#### **API Issues**

```bash
# Test API endpoints
curl -X GET http://localhost:3000/api/ventures
curl -X POST http://localhost:3000/api/ventures \
  -H "Content-Type: application/json" \
  -d '{"name": "Test Venture"}'
```

#### **Authentication Issues**

```bash
# Check environment variables
echo $AUTH0_DOMAIN
echo $AUTH0_CLIENT_ID

# Test authentication flow
# Use browser developer tools to inspect network requests
```

---

## 🚀 Deployment

### Local Production Build
```bash
npm run build
npm start
```

### Docker Deployment
Enterprise containerization is covered in architecture docs. Optional for this repo.

#### **Docker Compose**

```yaml
# docker-compose.yml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://postgres:password@db:5432/miv_platform
      - REDIS_URL=redis://redis:6379
    depends_on:
      - db
      - redis

  db:
    image: postgres:15
    environment:
      - POSTGRES_DB=miv_platform
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

volumes:
  postgres_data:
```

### Environment-Specific Configurations
Not required for SQLite-based development.

---

## 📚 Resources

### Documentation

- **[Platform Overview](./MIV_PLATFORM_OVERVIEW.md)** - Comprehensive platform guide
- **[API Reference](./API_REFERENCE.md)** - Complete API documentation
- **[User Manual](./USER_MANUAL.md)** - End-user documentation
- **[Contributing Guidelines](./CONTRIBUTING.md)** - How to contribute

### External Resources

- **[Next.js Documentation](https://nextjs.org/docs)** - Next.js framework docs
- **[React Documentation](https://react.dev)** - React library docs
- **[TypeScript Handbook](https://www.typescriptlang.org/docs)** - TypeScript docs
- **[Prisma Documentation](https://www.prisma.io/docs)** - Database ORM docs
- **[Tailwind CSS](https://tailwindcss.com/docs)** - CSS framework docs

### Community

- **[GitHub Issues](https://github.com/your-org/miv-platform/issues)** - Bug reports and feature requests
- **[Discord Community](https://discord.gg/miv-platform)** - Community discussions
- **[Stack Overflow](https://stackoverflow.com/questions/tagged/miv-platform)** - Q&A platform

### Support

- **Email**: dev-support@miv-platform.com
- **Slack**: [miv-platform.slack.com](https://miv-platform.slack.com)
- **Documentation**: [docs.miv-platform.com](https://docs.miv-platform.com)

---

<div align="center">

**🚀 Happy coding!**

[![Made with Love](https://img.shields.io/badge/Made%20with-❤️-red.svg)](https://miv-platform.com)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](./CONTRIBUTING.md)

</div> 