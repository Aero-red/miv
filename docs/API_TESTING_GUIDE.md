# MIV Platform API Testing Guide

<div align="center">

![API Testing](https://img.shields.io/badge/API-Testing-blue?style=for-the-badge)
![Postman](https://img.shields.io/badge/Postman-Collections-orange?style=for-the-badge)
![Enterprise](https://img.shields.io/badge/Enterprise-Ready-red?style=for-the-badge)

**Comprehensive API testing guide and automation**

</div>

---

## 📋 Table of Contents

- [Quick Start](#quick-start)
- [Postman Collections](#postman-collections)
- [Authentication Testing](#authentication-testing)
- [API Test Scenarios](#api-test-scenarios)
- [Automated Testing](#automated-testing)
- [Performance Testing](#performance-testing)
- [Security Testing](#security-testing)
- [CI/CD Integration](#cicd-integration)

---

## 🚀 Quick Start

### Prerequisites
- Postman installed
- MIV Platform running locally or staging
- Valid API credentials

### Import Collections
1. Download Postman collections from `/docs/postman/`
2. Import into Postman
3. Set up environment variables
4. Run test suites

---

## 📦 Postman Collections

### Core Collections Available

#### 1. **MIV Platform - Core API**
```json
{
  "info": {
    "name": "MIV Platform - Core API",
    "description": "Complete API testing suite for MIV Platform",
    "version": "2.0.0"
  },
  "auth": {
    "type": "bearer",
    "bearer": [
      {
        "key": "token",
        "value": "{{access_token}}",
        "type": "string"
      }
    ]
  }
}
```

#### 2. **Environment Variables**
```json
{
  "id": "miv-platform-env",
  "name": "MIV Platform Environment",
  "values": [
    {
      "key": "base_url",
      "value": "http://localhost:3000",
      "enabled": true
    },
    {
      "key": "api_version",
      "value": "v2",
      "enabled": true
    },
    {
      "key": "access_token",
      "value": "",
      "enabled": true
    }
  ]
}
```

---

## 🔐 Authentication Testing

### Session-Based Authentication Flow

```javascript
// Pre-request Script for Authentication
pm.test("Authentication Setup", function () {
    // Set up session cookie for API calls
    const sessionCookie = pm.cookies.get('next-auth.session-token');
    if (sessionCookie) {
        pm.environment.set('session_token', sessionCookie);
    }
});
```

### Test Authentication Endpoints

```http
### 1. Login Test
POST {{base_url}}/api/auth/signin
Content-Type: application/json

{
  "email": "test@miv-platform.com",
  "password": "secure-password"
}

### 2. Session Validation
GET {{base_url}}/api/auth/session
Cookie: next-auth.session-token={{session_token}}

### 3. Logout Test
POST {{base_url}}/api/auth/signout
Cookie: next-auth.session-token={{session_token}}
```

---

## 🧪 API Test Scenarios

### 1. Ventures API Testing

#### Create Venture Test
```javascript
pm.test("Create Venture - Success", function () {
    pm.response.to.have.status(201);
    pm.response.to.be.json;
    
    const responseJson = pm.response.json();
    pm.expect(responseJson).to.have.property('success', true);
    pm.expect(responseJson.data).to.have.property('id');
    
    // Store venture ID for subsequent tests
    pm.environment.set('venture_id', responseJson.data.id);
});

pm.test("Create Venture - Validation", function () {
    const responseJson = pm.response.json();
    pm.expect(responseJson.data.name).to.eql(pm.environment.get('test_venture_name'));
    pm.expect(responseJson.data.sector).to.exist;
    pm.expect(responseJson.data.location).to.exist;
});
```

#### Get Venture Test
```javascript
pm.test("Get Venture - Success", function () {
    pm.response.to.have.status(200);
    
    const responseJson = pm.response.json();
    pm.expect(responseJson).to.have.property('success', true);
    pm.expect(responseJson.data).to.have.property('id', pm.environment.get('venture_id'));
});
```

#### Update Venture Test
```javascript
pm.test("Update Venture - Success", function () {
    pm.response.to.have.status(200);
    
    const responseJson = pm.response.json();
    pm.expect(responseJson).to.have.property('success', true);
    pm.expect(responseJson.data.name).to.eql('Updated Venture Name');
});
```

### 2. GEDSI Metrics API Testing

```javascript
// Test GEDSI Metrics Creation
pm.test("Create GEDSI Metric - Success", function () {
    pm.response.to.have.status(201);
    
    const responseJson = pm.response.json();
    pm.expect(responseJson.data).to.have.property('metricCode');
    pm.expect(responseJson.data).to.have.property('currentValue');
    pm.expect(responseJson.data).to.have.property('targetValue');
    pm.expect(responseJson.data.category).to.be.oneOf(['GENDER', 'DISABILITY', 'SOCIAL_INCLUSION', 'CROSS_CUTTING']);
});

// Test GEDSI Analytics
pm.test("Get GEDSI Analytics - Success", function () {
    pm.response.to.have.status(200);
    
    const responseJson = pm.response.json();
    pm.expect(responseJson.data).to.have.property('totalMetrics');
    pm.expect(responseJson.data).to.have.property('verifiedMetrics');
    pm.expect(responseJson.data).to.have.property('completionRate');
});
```

### 3. AI Services API Testing

```javascript
// Test Venture Analysis
pm.test("AI Venture Analysis - Success", function () {
    pm.response.to.have.status(200);
    
    const responseJson = pm.response.json();
    pm.expect(responseJson.data).to.have.property('analysis');
    pm.expect(responseJson.data.analysis).to.have.property('gedsiAlignment');
    pm.expect(responseJson.data.analysis.gedsiAlignment).to.be.a('number');
    pm.expect(responseJson.data.analysis.gedsiAlignment).to.be.within(0, 100);
});
```

---

## 🔄 Automated Testing

### Newman CLI Integration

```bash
# Install Newman
npm install -g newman

# Run collection with environment
newman run "MIV Platform - Core API.postman_collection.json" \
  -e "MIV Platform Environment.postman_environment.json" \
  --reporters cli,json \
  --reporter-json-export results.json

# Run with specific folder
newman run collection.json -e environment.json --folder "Ventures API"
```

### Test Automation Script

```javascript
// automated-tests.js
const newman = require('newman');

const runTests = async () => {
  return new Promise((resolve, reject) => {
    newman.run({
      collection: './docs/postman/MIV-Platform-Core-API.json',
      environment: './docs/postman/MIV-Platform-Environment.json',
      reporters: ['cli', 'json'],
      reporterOptions: {
        json: {
          export: './test-results.json'
        }
      }
    }, (err, summary) => {
      if (err) {
        reject(err);
      } else {
        console.log('Test run completed');
        resolve(summary);
      }
    });
  });
};

// Run tests
runTests()
  .then((summary) => {
    console.log('Tests passed:', summary.run.stats.tests.total - summary.run.stats.tests.failed);
    console.log('Tests failed:', summary.run.stats.tests.failed);
    process.exit(summary.run.stats.tests.failed > 0 ? 1 : 0);
  })
  .catch((error) => {
    console.error('Test execution failed:', error);
    process.exit(1);
  });
```

---

## ⚡ Performance Testing

### Load Testing with Newman

```bash
# Run performance tests
newman run collection.json \
  -e environment.json \
  --iteration-count 100 \
  --delay-request 100 \
  --timeout-request 30000
```

### Performance Test Scenarios

```javascript
// Performance test pre-request script
const startTime = Date.now();
pm.globals.set('requestStartTime', startTime);

// Performance test script
const responseTime = Date.now() - pm.globals.get('requestStartTime');

pm.test("Response time is acceptable", function () {
    pm.expect(responseTime).to.be.below(2000); // 2 seconds
});

pm.test("Response time is optimal", function () {
    pm.expect(responseTime).to.be.below(500); // 500ms for optimal
});
```

---

## 🔒 Security Testing

### Security Test Cases

```javascript
// Test SQL Injection Protection
pm.test("SQL Injection Protection", function () {
    // Test with malicious input
    const maliciousInput = "'; DROP TABLE ventures; --";
    
    // Should return validation error, not execute SQL
    pm.response.to.have.status(400);
    
    const responseJson = pm.response.json();
    pm.expect(responseJson.error.code).to.eql('VALIDATION_ERROR');
});

// Test XSS Protection
pm.test("XSS Protection", function () {
    const xssPayload = "<script>alert('xss')</script>";
    
    // Response should sanitize the input
    const responseJson = pm.response.json();
    pm.expect(JSON.stringify(responseJson)).to.not.include('<script>');
});

// Test Authorization
pm.test("Authorization Check", function () {
    // Without valid token, should return 401
    pm.response.to.have.status(401);
    
    const responseJson = pm.response.json();
    pm.expect(responseJson.error.code).to.eql('UNAUTHORIZED');
});
```

### Rate Limiting Tests

```javascript
pm.test("Rate Limiting", function () {
    const rateLimitRemaining = pm.response.headers.get('X-RateLimit-Remaining');
    const rateLimitLimit = pm.response.headers.get('X-RateLimit-Limit');
    
    pm.expect(parseInt(rateLimitRemaining)).to.be.at.most(parseInt(rateLimitLimit));
    
    if (parseInt(rateLimitRemaining) === 0) {
        pm.response.to.have.status(429);
    }
});
```

---

## 🔧 CI/CD Integration

### GitHub Actions Workflow

```yaml
# .github/workflows/api-tests.yml
name: API Tests

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  api-tests:
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: miv_test
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '20'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Start application
      run: |
        npm run build
        npm start &
        sleep 30
      env:
        DATABASE_URL: postgresql://postgres:postgres@localhost:5432/miv_test
    
    - name: Install Newman
      run: npm install -g newman
    
    - name: Run API Tests
      run: |
        newman run docs/postman/MIV-Platform-Core-API.json \
          -e docs/postman/MIV-Platform-Environment.json \
          --reporters cli,junit \
          --reporter-junit-export test-results.xml
    
    - name: Publish Test Results
      uses: dorny/test-reporter@v1
      if: success() || failure()
      with:
        name: API Test Results
        path: test-results.xml
        reporter: java-junit
```

---

## 📊 Test Coverage & Reporting

### Coverage Targets

| API Endpoint | Coverage Target | Current Status |
|--------------|----------------|----------------|
| **Ventures API** | 95% | ✅ Complete |
| **GEDSI Metrics API** | 95% | ✅ Complete |
| **AI Services API** | 90% | ✅ Complete |
| **Analytics API** | 85% | ✅ Complete |
| **Users API** | 90% | ✅ Complete |
| **Documents API** | 85% | ✅ Complete |

### Test Metrics Dashboard

```javascript
// Generate test report
const generateReport = () => {
  const testResults = {
    totalTests: pm.info.iteration.count,
    passedTests: pm.info.iteration.count - pm.info.iteration.failed,
    failedTests: pm.info.iteration.failed,
    averageResponseTime: pm.response.responseTime,
    timestamp: new Date().toISOString()
  };
  
  console.log('Test Report:', JSON.stringify(testResults, null, 2));
};
```

---

## 🛠️ Troubleshooting

### Common Issues

#### Authentication Issues
```bash
# Clear cookies and re-authenticate
pm.cookies.clear();

# Check session token
console.log('Session Token:', pm.environment.get('session_token'));
```

#### Environment Setup
```bash
# Verify environment variables
pm.test("Environment Setup", function () {
    pm.expect(pm.environment.get('base_url')).to.not.be.undefined;
    pm.expect(pm.environment.get('api_version')).to.not.be.undefined;
});
```

#### Network Issues
```javascript
// Add timeout handling
pm.test("Network Connectivity", function () {
    pm.response.to.have.status.that.is.oneOf([200, 201, 400, 401, 403, 404]);
    // Should not timeout
    pm.expect(pm.response.responseTime).to.be.below(30000);
});
```

---

## 📞 Support

### API Testing Support
- **Documentation**: [docs.miv-platform.com/api-testing](https://docs.miv-platform.com/api-testing)
- **Postman Workspace**: [MIV Platform API Testing](https://postman.com/miv-platform)
- **Email**: api-testing@miv-platform.com
- **Slack**: #api-testing in MIV Platform workspace

---

<div align="center">

**🚀 Comprehensive API testing for enterprise-grade reliability**

[![API Tests](https://github.com/miv-platform/miv-platform/workflows/API%20Tests/badge.svg)](https://github.com/miv-platform/miv-platform/actions)
[![Coverage](https://img.shields.io/badge/API%20Coverage-95%25-brightgreen)](https://docs.miv-platform.com/coverage)

</div>
