# MIV Platform API Reference

<div align="center">

![API Version](https://img.shields.io/badge/API-v2.0-blue?style=for-the-badge)
![REST](https://img.shields.io/badge/REST-API-green?style=for-the-badge)
![GraphQL](https://img.shields.io/badge/GraphQL-Support-purple?style=for-the-badge)
![Rate Limiting](https://img.shields.io/badge/Rate%20Limit-1000%2Fmin-orange?style=for-the-badge)
![Uptime](https://img.shields.io/badge/Uptime-99.9%25-brightgreen?style=for-the-badge)

**Enterprise-grade API for venture pipeline management**

</div>

---

## 📋 Table of Contents

- [Authentication](#authentication)
- [Base URLs](#base-urls)
- [Response Formats](#response-formats)
- [Rate Limiting](#rate-limiting)
- [Error Handling](#error-handling)
- [Ventures API](#ventures-api)
- [GEDSI Analytics API](#gedsi-analytics-api)
- [Capital Management API](#capital-management-api)
- [Documents API](#documents-api)
- [Users API](#users-api)
- [AI Services API](#ai-services-api)
- [Analytics API](#analytics-api)
- [Search API](#search-api)
- [Export API](#export-api)
- [Webhooks](#webhooks)
- [SDKs & Libraries](#sdks--libraries)

---

## 🔐 Authentication

### NextAuth session/JWT (local repo)

- Sign-in is handled via NextAuth at `/api/auth/[...nextauth]` using Google and Credentials providers.
- API routes validate the server session. When calling APIs from the browser, cookies are sent automatically.
- When calling from tools (Postman/curl), authenticate via the UI first and reuse the session cookie, or call your APIs from within the app.

Example (from client):
```ts
await fetch('/api/ventures', { credentials: 'include' })
```

---

## 🌐 Base URLs

| Environment | Base URL |
|-------------|----------|
| **Local Dev** | `http://localhost:3000` |

---

## 📄 Response Formats

### Success Response

```json
{
  "success": true,
  "data": {
    // Response data
  },
  "meta": {
    "timestamp": "2024-01-15T10:30:00Z",
    "request_id": "req_123456789",
    "version": "2.0"
  }
}
```

### Error Response

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": {
      "field": "email",
      "issue": "Invalid email format"
    }
  },
  "meta": {
    "timestamp": "2024-01-15T10:30:00Z",
    "request_id": "req_123456789",
    "version": "2.0"
  }
}
```

### Paginated Response

```json
{
  "success": true,
  "data": [
    // Array of items
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "total_pages": 8,
    "has_next": true,
    "has_prev": false
  },
  "meta": {
    "timestamp": "2024-01-15T10:30:00Z",
    "request_id": "req_123456789",
    "version": "2.0"
  }
}
```

---

## ⚡ Rate Limiting

### Rate Limits

| Plan | Requests per Minute | Requests per Hour | Burst Limit |
|------|-------------------|-------------------|-------------|
| **Free** | 60 | 1,000 | 100 |
| **Professional** | 300 | 10,000 | 500 |
| **Enterprise** | 1,000 | 100,000 | 2,000 |

### Rate Limit Headers

```http
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1642234567
```

### Rate Limit Exceeded

```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Rate limit exceeded. Try again in 60 seconds.",
    "retry_after": 60
  }
}
```

---

## ❌ Error Handling

### Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `VALIDATION_ERROR` | 400 | Invalid request data |
| `UNAUTHORIZED` | 401 | Authentication required |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `NOT_FOUND` | 404 | Resource not found |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many requests |
| `INTERNAL_ERROR` | 500 | Server error |
| `SERVICE_UNAVAILABLE` | 503 | Service temporarily unavailable |

### Error Example

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format"
      },
      {
        "field": "phone",
        "message": "Phone number is required"
      }
    ]
  }
}
```

---

## 🏢 Ventures API

All routes are under `/api`.

### List Ventures

```http
GET /api/ventures
```

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 20, max: 100)
- `stage` (string): Pipeline stage filter
- `status` (string): Venture status filter
- `search` (string): Search term
- `sort_by` (string): Sort field (default: created_at)
- `sort_order` (string): Sort direction (asc/desc)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "ven_123456789",
      "name": "EcoTech Solutions",
      "description": "Sustainable technology solutions",
      "stage": "due_diligence",
      "status": "active",
      "founded_date": "2020-01-15",
      "location": {
        "country": "Thailand",
        "city": "Bangkok"
      },
      "team_size": 25,
      "funding_stage": "Series A",
      "total_funding": 5000000,
      "gedsi_score": 85,
      "impact_score": 92,
      "created_at": "2024-01-15T10:30:00Z",
      "updated_at": "2024-01-15T10:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "total_pages": 8
  }
}
```

### Get Venture

```http
GET /api/ventures/{venture_id}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "ven_123456789",
    "name": "EcoTech Solutions",
    "description": "Sustainable technology solutions",
    "stage": "due_diligence",
    "status": "active",
    "founded_date": "2020-01-15",
    "location": {
      "country": "Thailand",
      "city": "Bangkok",
      "address": "123 Innovation Street"
    },
    "team_size": 25,
    "funding_stage": "Series A",
    "total_funding": 5000000,
    "gedsi_score": 85,
    "impact_score": 92,
    "contact": {
      "email": "contact@ecotech.com",
      "phone": "+66-2-123-4567",
      "website": "https://ecotech.com"
    },
    "team": [
      {
        "name": "John Doe",
        "role": "CEO",
        "email": "john@ecotech.com"
      }
    ],
    "documents": [
      {
        "id": "doc_123",
        "name": "Pitch Deck",
        "type": "presentation",
        "url": "https://api.miv-platform.com/documents/doc_123"
      }
    ],
    "activities": [
      {
        "id": "act_123",
        "type": "meeting",
        "description": "Initial pitch meeting",
        "date": "2024-01-10T14:00:00Z"
      }
    ],
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-15T10:30:00Z"
  }
}
```

### Create Venture

```http
POST /api/ventures
```

**Request Body:**
```json
{
  "name": "EcoTech Solutions",
  "description": "Sustainable technology solutions",
  "founded_date": "2020-01-15",
  "location": {
    "country": "Thailand",
    "city": "Bangkok"
  },
  "team_size": 25,
  "funding_stage": "Series A",
  "contact": {
    "email": "contact@ecotech.com",
    "phone": "+66-2-123-4567"
  }
}
```

### Update Venture

```http
PUT /api/ventures/{venture_id}
```

### Delete Venture

```http
DELETE /api/ventures/{venture_id}
```

---

## 📊 GEDSI Metrics API

### Get Venture GEDSI Metrics

```http
GET /api/ventures/{venture_id}/gedsi
```

**Response:**
```json
{
  "success": true,
  "data": {
    "venture_id": "ven_123456789",
    "metrics": {
      "gender_diversity": {
        "female_leadership": 40,
        "female_employees": 60,
        "gender_pay_gap": 5
      },
      "disability_inclusion": {
        "disabled_employees": 15,
        "accessibility_score": 85
      },
      "social_inclusion": {
        "minority_representation": 30,
        "local_community_impact": 75
      },
      "iris_metrics": {
        "OI0001": {
          "value": 1000000,
          "unit": "USD",
          "description": "Number of individuals served"
        }
      }
    },
    "compliance": {
      "b_lab_ready": true,
      "two_x_criteria": true,
      "iris_plus_compliant": true
    },
    "last_updated": "2024-01-15T10:30:00Z"
  }
}
```

### Create/Update/Delete GEDSI Metrics

```http
POST /api/ventures/{venture_id}/gedsi
PUT /api/ventures/{venture_id}/gedsi
DELETE /api/ventures/{venture_id}/gedsi?metricId=...
```

**Request Body:**
```json
{
  "metrics": {
    "gender_diversity": {
      "female_leadership": 40,
      "female_employees": 60
    },
    "iris_metrics": {
      "OI0001": {
        "value": 1000000,
        "unit": "USD"
      }
    }
  }
}
```

### Get GEDSI Analytics

```http
GET /analytics/gedsi
```

**Query Parameters:**
- `venture_ids` (array): Filter by venture IDs
- `date_from` (string): Start date
- `date_to` (string): End date
- `group_by` (string): Group by field (country, sector, etc.)

---

## 💰 Capital Management API

### Get Investment Pipeline

```http
GET /capital/pipeline
```

**Response:**
```json
{
  "success": true,
  "data": {
    "pipeline": [
      {
        "venture_id": "ven_123456789",
        "venture_name": "EcoTech Solutions",
        "stage": "due_diligence",
        "investment_amount": 2000000,
        "currency": "USD",
        "expected_close": "2024-03-15",
        "probability": 75,
        "lead_investor": "MIV Fund I",
        "syndicate": ["Fund A", "Fund B"]
      }
    ],
    "summary": {
      "total_pipeline": 50000000,
      "active_deals": 25,
      "avg_deal_size": 2000000,
      "avg_time_to_close": 90
    }
  }
}
```

### Create Investment

```http
POST /capital/investments
```

**Request Body:**
```json
{
  "venture_id": "ven_123456789",
  "amount": 2000000,
  "currency": "USD",
  "investment_type": "equity",
  "ownership_percentage": 15,
  "expected_close_date": "2024-03-15",
  "terms": {
    "board_seat": true,
    "voting_rights": true
  }
}
```

### Get Portfolio

```http
GET /capital/portfolio
```

---

## 📄 Documents API

### Upload Document

```http
POST /api/documents/upload
Content-Type: multipart/form-data
```

**Form Data:**
- `file`: Document file
- `venture_id`: Associated venture ID
- `document_type`: Type of document
- `description`: Document description

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "doc_123456789",
    "name": "Pitch Deck.pdf",
    "type": "presentation",
    "size": 2048576,
    "venture_id": "ven_123456789",
    "ai_analysis": {
      "summary": "Comprehensive pitch deck covering...",
      "key_points": ["Market opportunity", "Team strength"],
      "risk_factors": ["Competition", "Regulatory challenges"],
      "confidence_score": 85
    },
    "url": "https://api.miv-platform.com/documents/doc_123456789",
    "created_at": "2024-01-15T10:30:00Z"
  }
}
```

### Get Document

```http
GET /api/documents/{document_id}
```

### Document Analytics

```http
GET /api/documents/analytics
```

**Response:**
```json
{
  "success": true,
  "data": {
    "analysis": {
      "summary": "Detailed analysis of the document...",
      "key_metrics": {
        "financial_health": 85,
        "market_potential": 90,
        "team_strength": 88
      },
      "recommendations": [
        "Consider additional market research",
        "Strengthen financial projections"
      ],
      "risk_assessment": {
        "overall_risk": "medium",
        "risk_factors": ["Market competition", "Regulatory changes"]
      }
    }
  }
}
```

---

## 👥 Users API

### Get Current User

```http
GET /api/users/me
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "usr_123456789",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "investment_manager",
    "permissions": ["read_ventures", "write_ventures", "read_analytics"],
    "organization": {
      "id": "org_123456789",
      "name": "MIV Fund"
    },
    "preferences": {
      "timezone": "Asia/Bangkok",
      "language": "en",
      "notifications": {
        "email": true,
        "push": true
      }
    },
    "created_at": "2024-01-15T10:30:00Z"
  }
}
```

### List Users

```http
GET /api/users
```

### Create User

```http
POST /api/users
```

---

## 🤖 AI Services API

### Analyze Venture

```http
POST /api/ai/analyze-venture
```

**Request Body:**
```json
{
  "venture_id": "ven_123456789",
  "analysis_type": "comprehensive",
  "include_risk_assessment": true,
  "include_impact_prediction": true
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "analysis": {
      "overall_score": 85,
      "financial_health": 88,
      "market_potential": 92,
      "team_strength": 85,
      "impact_potential": 90
    },
    "risk_assessment": {
      "overall_risk": "medium",
      "risk_factors": [
        {
          "factor": "Market competition",
          "severity": "medium",
          "mitigation": "Focus on unique value proposition"
        }
      ]
    },
    "recommendations": [
      "Consider additional market research",
      "Strengthen financial projections",
      "Expand team with technical expertise"
    ],
    "impact_prediction": {
      "social_impact_score": 85,
      "environmental_impact_score": 90,
      "economic_impact_score": 88
    }
  }
}
```

### GEDSI Insights

```http
POST /api/ai/gedsi-insights
```

**Request Body:**
```json
{
  "report_type": "venture_assessment",
  "venture_id": "ven_123456789",
  "format": "pdf",
  "sections": ["executive_summary", "financial_analysis", "risk_assessment"]
}
```

### Document Analysis

```http
POST /ai/analyze-document
```

---

## 📈 Analytics API

### Get Dashboard Analytics

```http
GET /api/analytics
```

**Response:**
```json
{
  "success": true,
  "data": {
    "pipeline_summary": {
      "total_ventures": 150,
      "active_pipeline": 45,
      "funded_ventures": 25,
      "total_investment": 50000000
    },
    "gedsi_metrics": {
      "avg_gender_diversity": 65,
      "avg_disability_inclusion": 12,
      "avg_social_inclusion": 45
    },
    "impact_metrics": {
      "total_impact_score": 82,
      "jobs_created": 1250,
      "communities_served": 45
    },
    "performance_metrics": {
      "avg_time_to_close": 85,
      "conversion_rate": 35,
      "portfolio_performance": 18
    }
  }
}
```

### Custom Dashboards

```http
GET /api/custom-dashboards
```

**Request Body:**
```json
{
  "metrics": ["total_investment", "gedsi_score", "impact_score"],
  "filters": {
    "date_from": "2024-01-01",
    "date_to": "2024-12-31",
    "stages": ["due_diligence", "investment"]
  },
  "group_by": ["country", "sector"],
  "aggregation": "sum"
}
```

---

## 🔍 Search API
Use query params on `/api/ventures` (e.g., `?search=...&stage=...&status=...`).

---

## 📤 Export API
Not available in this repo.

---

## 🔗 Webhooks
Not available in this repo.

---

## 📚 SDKs & Libraries
No official SDKs. Use `fetch`/HTTP against `/api/*` routes.

---

## 📞 Support

### API Support
- **Documentation**: [docs.miv-platform.com/api](https://docs.miv-platform.com/api)
- **Status Page**: [status.miv-platform.com](https://status.miv-platform.com)
- **Email**: api-support@miv-platform.com
- **Slack**: [miv-platform.slack.com](https://miv-platform.slack.com)

### Rate Limits & Quotas
- **Free Tier**: 1,000 requests/month
- **Professional**: 100,000 requests/month
- **Enterprise**: Custom limits

### API Versioning
- **Current Version**: v2.0
- **Deprecation Policy**: 12 months notice
- **Migration Guide**: [docs.miv-platform.com/migration](https://docs.miv-platform.com/migration)

---

<div align="center">

**🚀 Built for enterprise-scale venture pipeline management**

[![API Status](https://img.shields.io/badge/API-Status-green?style=for-the-badge)](https://status.miv-platform.com)
[![Documentation](https://img.shields.io/badge/Docs-Complete-blue?style=for-the-badge)](https://docs.miv-platform.com)

</div> 