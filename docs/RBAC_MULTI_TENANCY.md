# MIV Platform: Role-Based Access Control & Multi-Tenancy Architecture

## 🏗️ **Overview**

The MIV (Mekong Innovation Ventures) platform implements a sophisticated multi-user system with role-based access control (RBAC) and organization-based data isolation. This document provides comprehensive details about the security architecture, user roles, data access patterns, and multi-tenancy implementation.

## 👥 **User Role System**

### **Role Hierarchy & Permissions**

| Role | Code | Permissions | Data Access | Description |
|------|------|-------------|-------------|-------------|
| **System Administrator** | `ADMIN` | Full system access | All organizations | Complete platform control, user management, system configuration |
| **Organization Manager** | `MANAGER` | Organization management | Own organization + assigned | Team leadership, venture oversight, reporting access |
| **Venture Manager** | `VENTURE_MANAGER` | Venture operations | Created + assigned ventures | Pipeline management, deal flow, venture lifecycle |
| **GEDSI Analyst** | `GEDSI_ANALYST` | Impact metrics | GEDSI-related data | Social impact tracking, GEDSI compliance, metrics analysis |
| **Capital Facilitator** | `CAPITAL_FACILITATOR` | Fund management | Investment-related data | Capital deployment, fund operations, investor relations |
| **Data Analyst** | `ANALYST` | Reporting & analytics | Organization data | Performance analysis, reporting, data insights |
| **Basic User** | `USER` | Limited access | Assigned ventures only | Basic platform access, limited functionality |
| **External Stakeholder** | `EXTERNAL_STAKEHOLDER` | Read-only access | Specific ventures only | Limited external access for partners/investors |

### **Permission Matrix**

```typescript
interface UserPermissions {
  canManageUsers: boolean        // Create, edit, delete users
  canCreateVentures: boolean     // Add new ventures to pipeline
  canViewReports: boolean        // Access analytics and reports
  canManageFunds: boolean        // Fund operations and capital management
  canEditSettings: boolean       // System configuration
  canViewAllOrgs: boolean        // Cross-organizational access
  canExportData: boolean         // Data export capabilities
  canManageWorkflows: boolean    // Workflow automation
}
```

**Permission Assignments:**
- **ADMIN**: All permissions enabled
- **MANAGER**: All except `canManageUsers` (organization-scoped)
- **VENTURE_MANAGER**: `canCreateVentures`, limited reporting
- **GEDSI_ANALYST**: `canViewReports`, GEDSI-specific access
- **CAPITAL_FACILITATOR**: `canManageFunds`, `canViewReports`
- **ANALYST**: `canViewReports`, `canExportData`
- **USER**: Basic venture access only
- **EXTERNAL_STAKEHOLDER**: Read-only, specific venture access

## 🏢 **Multi-Tenancy Architecture**

### **Current Implementation: Row-Level Security**

The platform uses a **single database with row-level filtering** approach for multi-tenancy:

```typescript
// Data access filter implementation
function createDataAccessFilter(userContext: UserContext) {
  return {
    ventures: {
      OR: [
        { createdById: user.id },           // Ventures user created
        { assignedToId: user.id },          // Ventures assigned to user
        { createdBy: { organization: org }}, // Same organization
        ...(isAdmin ? [{}] : [])            // Admin sees all
      ]
    }
  }
}
```

### **Data Access Patterns**

#### **1. Organization-Based Access**
- Users can access data from their organization
- Cross-organizational access restricted (except admins)
- Organization membership determines base access level

#### **2. Assignment-Based Access**
- Users can access ventures they created
- Users can access ventures assigned to them
- Assignment overrides organization boundaries

#### **3. Role-Based Restrictions**
- Each role has specific functional permissions
- Data visibility varies by role type
- Some roles have specialized data access (e.g., GEDSI_ANALYST)

#### **4. Admin Override**
- Admin users bypass all restrictions
- Full cross-organizational access
- Complete system visibility

### **Security Benefits**

✅ **Advantages of Current Approach:**
- **Cost Efficient**: Single database, shared infrastructure
- **Easy Maintenance**: One schema, unified migrations
- **Cross-Tenant Analytics**: Portfolio-wide insights possible
- **Collaborative Features**: Inter-organization data sharing
- **Development Speed**: Faster iteration and testing
- **Resource Efficiency**: Optimal database connection usage

⚠️ **Security Considerations:**
- Query-level security enforcement required
- All API endpoints must implement filtering
- Risk of data exposure through query bugs
- Performance impact with large datasets
- Complex query construction

## 🔒 **Security Implementation**

### **API-Level Security**

Every API endpoint implements user context validation:

```typescript
export async function GET(request: NextRequest) {
  // Get user context with organization and permissions
  const userContext = await getUserContext()
  if (!userContext) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Create data access filter based on user context
  const dataAccessFilter = createDataAccessFilter(userContext)
  
  // Apply filter to all database queries
  const ventures = await prisma.venture.findMany({
    where: dataAccessFilter.ventures,
    // ... other query parameters
  })
}
```

### **Development Authentication Fallback**

For development environments, the system provides an admin user fallback:

```typescript
// Development fallback in getUserContext()
if (!session?.user?.id && process.env.NODE_ENV === 'development') {
  const adminUser = await prisma.user.findFirst({
    where: { role: 'ADMIN' }
  })
  if (adminUser) {
    console.log('🔧 Using development admin user fallback')
    return createUserContext(adminUser)
  }
}
```

### **Data Filtering Examples**

#### **Venture Access Control**
```sql
-- SQL equivalent of venture filtering
SELECT * FROM ventures 
WHERE (
  created_by_id = $userId OR           -- User created it
  assigned_to_id = $userId OR          -- Assigned to user
  created_by_id IN (                   -- Same organization
    SELECT id FROM users 
    WHERE organization = $userOrg
  ) OR
  $isAdmin = true                      -- Admin override
)
```

#### **Activity Logging**
```sql
-- Activity access follows venture access
SELECT * FROM activities 
WHERE (
  user_id = $userId OR                 -- User's own activities
  venture_id IN (                      -- Activities on accessible ventures
    SELECT id FROM ventures WHERE [venture_filter]
  ) OR
  $isAdmin = true
)
```

## 📊 **Current Database Statistics**

Based on seeded data:

### **User Distribution**
- **1 Admin** (Sarah Chen): Full system access
- **1 Manager** (Dr. Priya Patel): Organization management
- **1 Venture Manager** (James Thompson): Pipeline management
- **1 Analyst** (Marcus Rodriguez): Reporting access
- **1 GEDSI Analyst** (Aisha Nakamura): Impact metrics
- **1 Capital Facilitator** (Robert Kim): Fund management

### **Data Access Examples**
- **Admin** can see: All 3 ventures, 9 GEDSI metrics, all activities
- **Analyst** can see: Organization ventures, reporting data, limited admin functions
- **Venture Manager** can see: Assigned ventures, pipeline data, creation capabilities
- **GEDSI Analyst** can see: GEDSI metrics, impact data, specialized reporting

### **Organization Structure**
- **Primary Organization**: "Deakin MIV" (6 users)
- **Data Isolation**: Users only see their organization's data
- **Cross-Organizational**: Only admins can access multiple organizations

## 🚀 **Alternative Architectures**

### **1. Database-Per-Tenant**

**When to Consider:**
- Enterprise clients with strict compliance requirements
- Large organizations needing dedicated resources
- Regulatory requirements for physical data separation
- High-value, low-volume client base

**Implementation Approach:**
```typescript
class TenantDatabaseManager {
  async getTenantDatabase(organizationId: string): Promise<PrismaClient> {
    const databaseUrl = `postgresql://user:pass@host:5432/miv_tenant_${organizationId}`
    return new PrismaClient({ datasources: { db: { url: databaseUrl } } })
  }
}
```

**Benefits:**
- ✅ Complete physical data isolation
- ✅ Independent scaling per tenant
- ✅ Custom schema per organization
- ✅ Regulatory compliance ready
- ✅ Performance isolation

**Drawbacks:**
- ❌ Higher infrastructure costs
- ❌ Complex maintenance procedures
- ❌ No cross-tenant analytics
- ❌ Resource inefficiency for small tenants
- ❌ Development complexity

### **2. Schema-Per-Tenant**

**When to Consider:**
- PostgreSQL-based deployments
- Medium security requirements
- Hundreds of tenants (not thousands)
- Need for some customization per tenant

**Implementation Approach:**
```sql
-- Create tenant schema
CREATE SCHEMA org_deakin_miv;

-- Set search path for tenant
SET search_path TO org_deakin_miv;
```

**Benefits:**
- ✅ Good security with logical separation
- ✅ Single database maintenance
- ✅ Better performance isolation than row-level
- ✅ Moderate infrastructure costs

**Drawbacks:**
- ❌ Database-specific implementation
- ❌ Limited by database schema limits
- ❌ Complex schema switching logic
- ❌ Migration complexity

## 🔄 **Migration Strategies**

### **Current to Database-Per-Tenant**

If the platform needs to migrate to database-per-tenant:

1. **Preparation Phase**
   - Identify organizations and data boundaries
   - Plan tenant database provisioning
   - Develop migration scripts

2. **Migration Phase**
   - Create tenant databases
   - Export organization-specific data
   - Import into tenant databases
   - Update application routing

3. **Validation Phase**
   - Verify data integrity
   - Test access controls
   - Validate functionality
   - Performance testing

4. **Cutover Phase**
   - Update DNS/routing
   - Monitor system health
   - Rollback procedures ready

### **Hybrid Approach**

For enterprise growth, consider offering both:
- **Standard Tier**: Row-level filtering (current)
- **Enterprise Tier**: Database-per-tenant
- **Shared Services**: Cross-tenant analytics, reporting

## 📈 **Scalability Considerations**

### **Current Architecture Limits**
- **Database Size**: Single database handles all tenants
- **Query Performance**: Complex filtering on large datasets
- **Concurrent Users**: Shared database connections
- **Storage Growth**: All tenant data in one database

### **Scaling Strategies**
1. **Database Optimization**
   - Proper indexing on tenant fields
   - Query optimization
   - Connection pooling
   - Read replicas

2. **Caching Layer**
   - User context caching
   - Query result caching
   - Session management
   - Static asset caching

3. **Horizontal Scaling**
   - Database sharding by organization
   - Microservices architecture
   - Load balancing
   - CDN implementation

## 🛡️ **Security Best Practices**

### **Implementation Guidelines**

1. **Always Validate User Context**
   ```typescript
   const userContext = await getUserContext()
   if (!userContext) throw new Error('Unauthorized')
   ```

2. **Apply Data Filters Consistently**
   ```typescript
   const filter = createDataAccessFilter(userContext)
   const data = await prisma.model.findMany({ where: filter.model })
   ```

3. **Log Access Attempts**
   ```typescript
   console.log(`User ${userContext.user.email} accessed ${resourceType}`)
   ```

4. **Validate Permissions**
   ```typescript
   if (!userContext.canViewReports) {
     return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
   }
   ```

### **Security Testing**

1. **Access Control Testing**
   - Verify users can only access their data
   - Test cross-organization access restrictions
   - Validate role-based permissions

2. **Data Isolation Testing**
   - Attempt unauthorized data access
   - Test API endpoint security
   - Validate query filtering

3. **Authentication Testing**
   - Test session management
   - Verify user context handling
   - Test development fallbacks

## 📋 **Compliance & Governance**

### **Data Protection**
- **GDPR Compliance**: User data rights, consent management
- **Data Retention**: Automated cleanup procedures
- **Audit Logging**: Comprehensive access tracking
- **Data Encryption**: At rest and in transit

### **Access Governance**
- **Regular Access Reviews**: Quarterly permission audits
- **Role Assignment Process**: Formal role approval workflow
- **Offboarding Procedures**: Immediate access revocation
- **Privilege Escalation**: Documented approval process

## 🎯 **Recommendations**

### **For Current Implementation**
1. **Enhance Security**
   - Implement comprehensive audit logging
   - Add query performance monitoring
   - Strengthen input validation
   - Regular security testing

2. **Improve Performance**
   - Optimize database indexes
   - Implement query caching
   - Monitor slow queries
   - Connection pool optimization

3. **Prepare for Scale**
   - Document migration procedures
   - Plan for database-per-tenant option
   - Implement monitoring dashboards
   - Capacity planning

### **For Future Growth**
1. **Enterprise Readiness**
   - Offer database-per-tenant for large clients
   - Implement advanced compliance features
   - Custom schema support
   - Dedicated infrastructure options

2. **Platform Evolution**
   - Microservices architecture consideration
   - API-first design principles
   - Event-driven architecture
   - Cloud-native scaling

---

## 📞 **Support & Contact**

For questions about RBAC implementation, multi-tenancy architecture, or security concerns:

- **Technical Documentation**: `/docs/`
- **API Reference**: `/docs/API_REFERENCE.md`
- **Security Checklist**: `/docs/SECURITY_PRIVACY_CHECKLIST.md`
- **Development Setup**: `/docs/DEVELOPMENT_SETUP.md`

---

*This documentation reflects the current implementation as of the latest platform update. For the most current information, refer to the codebase and recent commit history.*

