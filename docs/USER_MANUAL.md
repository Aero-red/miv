# MIV Platform User Manual

<div align="center">

![User Manual](https://img.shields.io/badge/User-Manual-blue?style=for-the-badge)
![Enterprise Ready](https://img.shields.io/badge/Enterprise-Ready-red?style=for-the-badge)
![AI-Powered](https://img.shields.io/badge/AI-Powered-Intelligence-green?style=for-the-badge)

**Complete guide to using the MIV Platform**

</div>

---

## 📋 Table of Contents

- [Getting Started](#getting-started)
- [Dashboard Overview](#dashboard-overview)
- [Venture Management](#venture-management)
- [GEDSI Analytics](#gedsi-analytics)
- [Capital Facilitation](#capital-facilitation)
- [Document Management](#document-management)
- [Analytics & Reporting](#analytics--reporting)
- [Team Management](#team-management)
- [System Settings](#system-settings)
- [Search & Filters](#search--filters)
- [Mobile Access](#mobile-access)
- [FAQs](#faqs)
- [Troubleshooting](#troubleshooting)
- [Support & Contact](#support--contact)

---

## 🚀 Getting Started

### First Login

1. **Access the Platform**
   - Navigate to [app.miv-platform.com](https://app.miv-platform.com)
   - Enter your email and password
   - Complete two-factor authentication if enabled

2. **Welcome Tour**
   - Complete the interactive welcome tour
   - Set up your profile and preferences
   - Configure notification settings

### User Roles & Permissions

The MIV platform implements a comprehensive role-based access control (RBAC) system with 8 distinct user roles:

| Role | Code | Access Level | Key Permissions | Typical Users |
|------|------|--------------|-----------------|---------------|
| **System Administrator** | `ADMIN` | Full Platform | • All system functions<br/>• User management<br/>• Cross-organizational access<br/>• System configuration | Platform administrators |
| **Organization Manager** | `MANAGER` | Organization-wide | • Team management<br/>• Venture oversight<br/>• Reporting access<br/>• Fund visibility | Senior managers, directors |
| **Venture Manager** | `VENTURE_MANAGER` | Pipeline Focus | • Create/edit ventures<br/>• Pipeline management<br/>• Deal flow oversight<br/>• Assignment management | Investment managers |
| **GEDSI Analyst** | `GEDSI_ANALYST` | Impact Metrics | • GEDSI metrics tracking<br/>• Impact analysis<br/>• Social compliance<br/>• Reporting access | Impact measurement specialists |
| **Capital Facilitator** | `CAPITAL_FACILITATOR` | Fund Operations | • Fund management<br/>• Investment tracking<br/>• Capital deployment<br/>• Financial reporting | Fund managers, CFOs |
| **Data Analyst** | `ANALYST` | Analytics & Reports | • Data analysis<br/>• Report generation<br/>• Export capabilities<br/>• Dashboard creation | Business analysts, researchers |
| **Basic User** | `USER` | Limited Access | • View assigned ventures<br/>• Basic data entry<br/>• Profile management<br/>• Limited reporting | Junior staff, interns |
| **External Stakeholder** | `EXTERNAL_STAKEHOLDER` | Read-only | • View specific ventures<br/>• Limited reporting<br/>• No data modification<br/>• Restricted access | Partners, advisors, investors |

### Data Access Patterns

Your role determines what data you can see and modify:

#### **🔍 What You Can Access:**
- **Ventures you created** - Full access to ventures you added to the system
- **Ventures assigned to you** - Complete access to your assigned ventures  
- **Organization ventures** - Access to ventures within your organization
- **Role-specific data** - Specialized access based on your role (e.g., GEDSI analysts see impact metrics)

#### **🚫 What You Cannot Access:**
- **Other organizations' data** - Complete isolation from other organizations (except admins)
- **Unassigned ventures** - No access to ventures you didn't create or aren't assigned to
- **Restricted functions** - Features limited by your role permissions
- **Administrative data** - System configuration and user management (non-admins)

### Organization-Based Isolation

The platform ensures **complete data privacy** between organizations:
- Users can only see data from their own organization
- Cross-organizational access is restricted to system administrators
- All API calls are automatically filtered by organization membership
- Database queries include organization-based security filters

### Permission Examples by Role

| Function | Admin | Manager | Venture Mgr | GEDSI | Capital | Analyst | User | External |
|----------|-------|---------|-------------|-------|---------|---------|------|----------|
| **Create Ventures** | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **View All Reports** | ✅ | ✅ | ❌ | ✅ | ✅ | ✅ | ❌ | ❌ |
| **Manage Users** | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **Fund Management** | ✅ | ✅ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| **GEDSI Metrics** | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ | ❌ | ❌ |
| **Export Data** | ✅ | ✅ | ❌ | ❌ | ✅ | ✅ | ❌ | ❌ |
| **System Settings** | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
|------|-------------|-------------|
| **Admin** | Full access | Complete platform management |
| **Investment Manager** | Venture management, analytics | Lead investment decisions |
| **Analyst** | Read access, basic analytics | Support investment analysis |
| **Viewer** | Read-only access | Limited viewing permissions |

---

## 📊 Dashboard Overview

### Main Dashboard Layout

The dashboard provides a comprehensive overview of your venture pipeline and key metrics.

#### **Key Metrics Cards**

- **Pipeline Summary**: Total ventures, active pipeline, funded ventures
- **GEDSI Metrics**: Gender diversity, disability inclusion, social inclusion
- **Performance Metrics**: Time to close, conversion rate, portfolio performance

#### **Activity Feed**

Real-time updates on:
- New venture submissions
- Stage transitions
- Document uploads
- Team activities
- AI insights and recommendations

#### **Quick Actions**

- **Add Venture**: Create new venture record
- **Upload Document**: Quick document upload
- **Generate Report**: Create custom reports
- **Schedule Meeting**: Book team meetings

---

## 🏢 Venture Management

### Creating a New Venture

#### **Step 1: Basic Information**

```json
{
  "name": "EcoTech Solutions",
  "description": "Sustainable technology solutions",
  "founded_date": "2020-01-15",
  "location": {
    "country": "Thailand",
    "city": "Bangkok"
  },
  "contact": {
    "email": "contact@ecotech.com",
    "phone": "+66-2-123-4567"
  }
}
```

#### **Step 2: Team Information**

- Add founding team members
- Include roles and backgrounds
- Upload team photos and LinkedIn profiles

#### **Step 3: Business Details**

- Industry and sector classification
- Business model description
- Revenue and funding information
- Market opportunity analysis

#### **Step 4: Impact Assessment**

- GEDSI metrics and goals
- IRIS+ metrics alignment
- Impact measurement framework
- Sustainability goals

### Pipeline Management

#### **Pipeline Stages**

| Stage | Description | Typical Duration |
|-------|-------------|------------------|
| **Screening** | Initial review and assessment | 1-2 weeks |
| **Due Diligence** | Comprehensive analysis | 4-8 weeks |
| **Investment Committee** | Decision making | 1-2 weeks |
| **Negotiation** | Term sheet and legal | 2-4 weeks |
| **Closing** | Final documentation | 1-2 weeks |
| **Portfolio** | Post-investment management | Ongoing |

#### **Stage Transitions**

1. **Move to Next Stage**
   - Click "Advance Stage" button
   - Complete required checklist items
   - Add stage-specific notes

2. **Stage Requirements**
   - Each stage has specific requirements
   - AI-powered checklist validation
   - Automated compliance checking

### Venture Details View

#### **Overview Tab**

- **Key Metrics**: GEDSI score, impact score, readiness score
- **Financial Summary**: Revenue, funding, valuation
- **Team Overview**: Key personnel and structure
- **Recent Activity**: Latest updates and changes

#### **Documents Tab**

- **Document Library**: All uploaded documents
- **AI Analysis**: Automated document insights
- **Version Control**: Document version history
- **Collaboration**: Team comments and feedback

#### **Analytics Tab**

- **Performance Metrics**: Key performance indicators
- **Trend Analysis**: Historical data and trends
- **Comparative Analysis**: Benchmark against similar ventures
- **Predictive Insights**: AI-powered forecasting

---

## 📊 GEDSI Analytics

### Understanding GEDSI Metrics

GEDSI (Gender, Equity, Disability, Social Inclusion) metrics are core to impact measurement.

#### **Gender Diversity Metrics**

```json
{
  "gender_diversity": {
    "female_leadership": "40%",
    "female_employees": "60%",
    "gender_pay_gap": "5%",
    "gender_policies": true
  }
}
```

#### **Disability Inclusion Metrics**

```json
{
  "disability_inclusion": {
    "disabled_employees": "15%",
    "accessibility_score": "85%",
    "inclusive_policies": true
  }
}
```

#### **Social Inclusion Metrics**

```json
{
  "social_inclusion": {
    "minority_representation": "30%",
    "local_community_impact": "75%",
    "rural_focus": true
  }
}
```

### GEDSI Dashboard

#### **Overview Metrics**

- **Overall GEDSI Score**: Composite score across all dimensions
- **Compliance Status**: B Lab, 2X Criteria, IRIS+ alignment
- **Improvement Opportunities**: AI-suggested improvements
- **Benchmark Comparison**: Industry and peer comparisons

### Updating GEDSI Metrics

#### **Manual Updates**

1. Navigate to Venture GEDSI Tab
2. Select Metrics to Update
3. Enter New Values
4. Add Supporting Documentation
5. Submit for Review

#### **AI-Assisted Updates**

- **Automated Data Extraction**: From documents and reports
- **Smart Suggestions**: Based on industry benchmarks
- **Validation Checks**: Ensure data accuracy
- **Trend Analysis**: Identify improvement patterns

---

## 💰 Capital Facilitation

### Investment Pipeline Management

#### **Pipeline Overview**

```json
{
  "pipeline": {
    "total_deals": 25,
    "total_value": "$50M",
    "avg_deal_size": "$2M",
    "avg_time_to_close": "85 days",
    "conversion_rate": "35%"
  }
}
```

#### **Deal Tracking**

1. **Deal Creation**
   - Link to venture record
   - Set investment parameters
   - Assign deal team
   - Establish timeline

2. **Due Diligence Process**
   - Financial analysis
   - Legal review
   - Technical assessment
   - Market validation

3. **Investment Committee**
   - Prepare presentation materials
   - Schedule committee meetings
   - Track decision outcomes
   - Document rationale

### Portfolio Management

#### **Portfolio Overview**

- **Total Portfolio Value**: Current portfolio worth
- **Number of Investments**: Active portfolio companies
- **Average Ownership**: Typical ownership percentage
- **Portfolio Performance**: Overall return metrics

#### **Individual Investment Tracking**

1. **Financial Performance**
   - Revenue growth
   - Profitability metrics
   - Cash flow analysis
   - Valuation updates

2. **Operational Metrics**
   - Key performance indicators
   - Milestone achievement
   - Risk assessment
   - Support requirements

---

## 📄 Document Management

### Uploading Documents

#### **Supported Formats**

- **Presentations**: PDF, PPTX, Keynote
- **Documents**: PDF, DOCX, Pages
- **Spreadsheets**: XLSX, CSV, Google Sheets
- **Images**: JPG, PNG, SVG
- **Videos**: MP4, MOV, AVI

#### **Upload Process**

1. **Drag & Drop Interface**
   - Simple drag and drop upload
   - Multiple file selection
   - Progress tracking
   - Error handling

2. **Document Classification**
   - Automatic document type detection
   - Manual classification override
   - Tag assignment
   - Version control

3. **AI Analysis**
   - Automatic content extraction
   - Key insights generation
   - Risk factor identification
   - Recommendation generation

### AI Document Analysis

#### **Automatic Insights**

```json
{
  "analysis": {
    "summary": "Comprehensive pitch deck covering...",
    "key_points": [
      "Market opportunity in Southeast Asia",
      "Strong founding team",
      "Clear revenue model"
    ],
    "risk_factors": [
      "Regulatory challenges",
      "Market competition"
    ],
    "recommendations": [
      "Strengthen financial projections",
      "Add market research"
    ],
    "confidence_score": 85
  }
}
```

---

## 📈 Analytics & Reporting

### Dashboard Analytics

#### **Real-time Metrics**

- **Pipeline Velocity**: Time between stages
- **Conversion Rates**: Stage-to-stage conversion
- **Portfolio Performance**: Investment returns
- **Impact Metrics**: Social and environmental impact

#### **Trend Analysis**

- **Historical Performance**: Past trends and patterns
- **Seasonal Variations**: Cyclical patterns
- **Growth Trajectories**: Future projections
- **Benchmark Comparisons**: Industry standards

### Custom Reports

#### **Report Builder**

1. **Select Metrics**
   - Choose from available metrics
   - Define calculation methods
   - Set time periods
   - Apply filters

2. **Visualization Options**
   - Charts and graphs
   - Tables and matrices
   - Heat maps
   - Interactive dashboards

3. **Export Options**
   - PDF reports
   - Excel spreadsheets
   - PowerPoint presentations
   - API data feeds

### Advanced Analytics

#### **Predictive Analytics**

- **Success Prediction**: Venture success probability
- **Pipeline Forecasting**: Expected deal flow
- **Risk Assessment**: Investment risk analysis
- **Market Trends**: Industry trend analysis

---

## 👥 Team Management

### User Management

#### **Adding Team Members**

1. **Invite Users**
   - Send email invitations
   - Set initial roles and permissions
   - Configure access levels
   - Set up training schedule

2. **Role Assignment**
   - Define role responsibilities
   - Set permission levels
   - Configure access restrictions
   - Establish approval workflows

### Collaboration Tools

#### **Team Communication**

- **Internal Messaging**: Direct and group messages
- **Comment System**: Document and venture comments
- **Meeting Scheduling**: Integrated calendar
- **Notification Center**: Centralized notifications

#### **Task Management**

- **Task Assignment**: Assign tasks to team members
- **Deadline Tracking**: Monitor task completion
- **Progress Updates**: Real-time progress tracking
- **Performance Metrics**: Team productivity analysis

---

## ⚙️ System Settings

### Account Settings

#### **Profile Management**

- **Personal Information**: Name, email, phone
- **Profile Picture**: Upload and manage photos
- **Preferences**: Language, timezone, notifications
- **Security Settings**: Password, 2FA, session management

#### **Organization Settings**

- **Company Information**: Logo, name, description
- **Contact Details**: Address, phone, website
- **Industry Classification**: Sector and focus areas
- **Geographic Focus**: Target regions and markets

### Notification Preferences

#### **Email Notifications**

- **Venture Updates**: New ventures, stage changes
- **Document Activity**: Uploads, analysis completion
- **Team Activities**: Comments, task assignments
- **System Alerts**: Maintenance, security updates

---

## 🔍 Search & Filters

### Global Search

#### **Search Functionality**

- **Full-Text Search**: Search across all content
- **Smart Suggestions**: AI-powered search suggestions
- **Recent Searches**: Search history tracking
- **Saved Searches**: Bookmark frequently used searches

#### **Advanced Filters**

```json
{
  "filters": {
    "stage": ["screening", "due_diligence"],
    "sector": ["technology", "healthcare"],
    "location": ["Thailand", "Vietnam"],
    "funding_stage": ["Series A", "Series B"],
    "gedsi_score": { "min": 70, "max": 100 },
    "date_range": { "from": "2024-01-01", "to": "2024-12-31" }
  }
}
```

---

## 📱 Mobile Access

### Mobile App Features

#### **Core Functionality**

- **Venture Management**: View and update ventures
- **Document Access**: View and upload documents
- **Analytics Dashboard**: Mobile-optimized dashboards
- **Team Communication**: Mobile messaging and notifications

#### **Mobile-Specific Features**

- **Offline Access**: Limited offline functionality
- **Camera Integration**: Document scanning
- **Location Services**: Geographic data capture
- **Push Notifications**: Real-time mobile alerts

---

## ❓ FAQs

### General Questions

**Q: How do I reset my password?**
A: Click "Forgot Password" on the login page and follow the email instructions.

**Q: Can I export data from the platform?**
A: Yes, you can export data in various formats including Excel, PDF, and CSV.

**Q: Is the platform secure?**
A: Yes, we use enterprise-grade security including encryption, 2FA, and SOC 2 compliance.

**Q: How do I get support?**
A: Contact support through email, chat, or phone. Enterprise customers have dedicated support.

### Feature Questions

**Q: How does AI analysis work?**
A: Our AI analyzes documents and ventures to provide insights, risk assessments, and recommendations.

**Q: Can I customize the dashboard?**
A: Yes, you can add, remove, and rearrange dashboard widgets to suit your needs.

**Q: How do I set up team permissions?**
A: Admins can configure user roles and permissions in the Team Management section.

**Q: What GEDSI metrics are tracked?**
A: We track gender diversity, disability inclusion, and social inclusion metrics with IRIS+ compliance.

---

## 🔧 Troubleshooting

### Common Issues

#### **Login Problems**

1. **Check Credentials**: Verify email and password
2. **Clear Cache**: Clear browser cache and cookies
3. **Try Different Browser**: Test with different browser
4. **Contact Support**: If issues persist

#### **Performance Issues**

1. **Check Internet Connection**: Ensure stable connection
2. **Close Other Tabs**: Reduce browser resource usage
3. **Clear Browser Data**: Clear cache and cookies
4. **Update Browser**: Use latest browser version

### Error Messages

#### **Common Error Codes**

| Error Code | Description | Solution |
|------------|-------------|----------|
| **401 Unauthorized** | Invalid credentials | Check login credentials |
| **403 Forbidden** | Insufficient permissions | Contact admin for access |
| **404 Not Found** | Resource not found | Check URL or resource ID |
| **500 Server Error** | Internal server error | Contact support |

---

## 🆘 Support & Contact

### Support Channels

#### **24/7 Support (Enterprise)**

- **Phone**: +1 (555) 123-4567
- **Email**: enterprise-support@miv-platform.com
- **Live Chat**: Available in platform
- **Dedicated Success Manager**: Personalized support

#### **Standard Support**

- **Email**: support@miv-platform.com
- **Help Center**: [help.miv-platform.com](https://help.miv-platform.com)
- **Community Forum**: [community.miv-platform.com](https://community.miv-platform.com)
- **Documentation**: [docs.miv-platform.com](https://docs.miv-platform.com)

### Training Resources

#### **Video Tutorials**

- **Getting Started**: Platform basics and navigation
- **Feature Deep Dives**: Detailed feature explanations
- **Best Practices**: Industry best practices and tips
- **Advanced Topics**: Advanced features and workflows

#### **Training Programs**

- **Onboarding Training**: New user orientation
- **Feature Training**: Specific feature training
- **Admin Training**: Administrative functions
- **Custom Training**: Tailored training programs

---

<div align="center">

**🚀 Built for the future of impact investing**

[![Support](https://img.shields.io/badge/Support-24%2F7-brightgreen?style=for-the-badge)](mailto:support@miv-platform.com)
[![Documentation](https://img.shields.io/badge/Docs-Complete-blue?style=for-the-badge)](https://docs.miv-platform.com)

</div> 