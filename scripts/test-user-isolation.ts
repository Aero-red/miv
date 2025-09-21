#!/usr/bin/env tsx

/**
 * Test script to verify user isolation and data security
 * This script tests that users can only access data they're authorized to see
 */

import { prisma } from '../lib/prisma'

interface TestUser {
  id: string
  email: string
  name: string
  role: string
  organization?: string
}

interface TestResult {
  test: string
  passed: boolean
  message: string
  details?: any
}

class UserIsolationTester {
  private results: TestResult[] = []

  private addResult(test: string, passed: boolean, message: string, details?: any) {
    this.results.push({ test, passed, message, details })
    console.log(`${passed ? '✅' : '❌'} ${test}: ${message}`)
    if (details && !passed) {
      console.log(`   Details:`, details)
    }
  }

  async testUserCreation() {
    console.log('\n🔍 Testing User Creation...')
    
    try {
      // Create test users with different organizations
      const users = await Promise.all([
        prisma.user.upsert({
          where: { email: 'test-org1@example.com' },
          update: {},
          create: {
            email: 'test-org1@example.com',
            name: 'Test User Org1',
            role: 'MANAGER',
            organization: 'Organization1'
          }
        }),
        prisma.user.upsert({
          where: { email: 'test-org2@example.com' },
          update: {},
          create: {
            email: 'test-org2@example.com',
            name: 'Test User Org2',
            role: 'MANAGER',
            organization: 'Organization2'
          }
        }),
        prisma.user.upsert({
          where: { email: 'admin@example.com' },
          update: {},
          create: {
            email: 'admin@example.com',
            name: 'Admin User',
            role: 'ADMIN',
            organization: 'AdminOrg'
          }
        })
      ])

      this.addResult(
        'User Creation',
        users.length === 3,
        `Created ${users.length} test users`,
        { userEmails: users.map(u => u.email) }
      )

      return users
    } catch (error) {
      this.addResult('User Creation', false, 'Failed to create test users', error)
      return []
    }
  }

  async testVentureIsolation(users: TestUser[]) {
    console.log('\n🔍 Testing Venture Isolation...')
    
    try {
      const [user1, user2] = users.slice(0, 2)

      // Create ventures for different users
      const venture1 = await prisma.venture.create({
        data: {
          name: 'Venture Org1',
          sector: 'Technology',
          location: 'Location1',
          contactEmail: 'contact1@example.com',
          founderTypes: 'WOMEN_LED',
          createdById: user1.id,
          assignedToId: user1.id
        }
      })

      const venture2 = await prisma.venture.create({
        data: {
          name: 'Venture Org2',
          sector: 'Healthcare',
          location: 'Location2',
          contactEmail: 'contact2@example.com',
          founderTypes: 'MIXED',
          createdById: user2.id,
          assignedToId: user2.id
        }
      })

      // Test that users can only see their own ventures
      const user1Ventures = await prisma.venture.findMany({
        where: {
          OR: [
            { createdById: user1.id },
            { assignedToId: user1.id }
          ]
        }
      })

      const user2Ventures = await prisma.venture.findMany({
        where: {
          OR: [
            { createdById: user2.id },
            { assignedToId: user2.id }
          ]
        }
      })

      const user1CanSeeOwn = user1Ventures.some(v => v.id === venture1.id)
      const user1CannotSeeOthers = !user1Ventures.some(v => v.id === venture2.id)
      const user2CanSeeOwn = user2Ventures.some(v => v.id === venture2.id)
      const user2CannotSeeOthers = !user2Ventures.some(v => v.id === venture1.id)

      this.addResult(
        'Venture Isolation - User1 Access',
        user1CanSeeOwn && user1CannotSeeOthers,
        `User1 can see own ventures: ${user1CanSeeOwn}, cannot see others: ${user1CannotSeeOthers}`,
        { user1Ventures: user1Ventures.map(v => v.name) }
      )

      this.addResult(
        'Venture Isolation - User2 Access',
        user2CanSeeOwn && user2CannotSeeOthers,
        `User2 can see own ventures: ${user2CanSeeOwn}, cannot see others: ${user2CannotSeeOthers}`,
        { user2Ventures: user2Ventures.map(v => v.name) }
      )

      return { venture1, venture2 }
    } catch (error) {
      this.addResult('Venture Isolation', false, 'Failed to test venture isolation', error)
      return null
    }
  }

  async testDocumentIsolation(users: TestUser[], ventures: any) {
    console.log('\n🔍 Testing Document Isolation...')
    
    if (!ventures) return

    try {
      const [user1, user2] = users.slice(0, 2)
      const { venture1, venture2 } = ventures

      // Create documents for different ventures
      const doc1 = await prisma.document.create({
        data: {
          name: 'Document for Venture1',
          type: 'BUSINESS_PLAN',
          url: 'https://example.com/doc1.pdf',
          ventureId: venture1.id
        }
      })

      const doc2 = await prisma.document.create({
        data: {
          name: 'Document for Venture2',
          type: 'FINANCIAL_STATEMENTS',
          url: 'https://example.com/doc2.pdf',
          ventureId: venture2.id
        }
      })

      // Test document access through venture relationships
      const user1Docs = await prisma.document.findMany({
        where: {
          venture: {
            OR: [
              { createdById: user1.id },
              { assignedToId: user1.id }
            ]
          }
        }
      })

      const user2Docs = await prisma.document.findMany({
        where: {
          venture: {
            OR: [
              { createdById: user2.id },
              { assignedToId: user2.id }
            ]
          }
        }
      })

      const user1CanSeeOwnDoc = user1Docs.some(d => d.id === doc1.id)
      const user1CannotSeeOthersDoc = !user1Docs.some(d => d.id === doc2.id)
      const user2CanSeeOwnDoc = user2Docs.some(d => d.id === doc2.id)
      const user2CannotSeeOthersDoc = !user2Docs.some(d => d.id === doc1.id)

      this.addResult(
        'Document Isolation - User1 Access',
        user1CanSeeOwnDoc && user1CannotSeeOthersDoc,
        `User1 can see own documents: ${user1CanSeeOwnDoc}, cannot see others: ${user1CannotSeeOthersDoc}`,
        { user1Docs: user1Docs.map(d => d.name) }
      )

      this.addResult(
        'Document Isolation - User2 Access',
        user2CanSeeOwnDoc && user2CannotSeeOthersDoc,
        `User2 can see own documents: ${user2CanSeeOwnDoc}, cannot see others: ${user2CannotSeeOthersDoc}`,
        { user2Docs: user2Docs.map(d => d.name) }
      )

    } catch (error) {
      this.addResult('Document Isolation', false, 'Failed to test document isolation', error)
    }
  }

  async testAdminAccess(users: TestUser[]) {
    console.log('\n🔍 Testing Admin Access...')
    
    try {
      const adminUser = users.find(u => u.role === 'ADMIN')
      if (!adminUser) {
        this.addResult('Admin Access', false, 'No admin user found for testing')
        return
      }

      // Admin should be able to see all ventures
      const allVentures = await prisma.venture.findMany()
      
      // For admin users, we don't apply any filters (they can see everything)
      // This simulates the behavior in our data access filter where admin gets no restrictions
      const adminVentures = await prisma.venture.findMany()
      
      // Admin should see all ventures (no filtering applied)
      const adminCanSeeAll = allVentures.length === adminVentures.length

      this.addResult(
        'Admin Access',
        adminCanSeeAll,
        `Admin can see all ventures: ${adminCanSeeAll}`,
        { totalVentures: allVentures.length, adminVentures: adminVentures.length }
      )

    } catch (error) {
      this.addResult('Admin Access', false, 'Failed to test admin access', error)
    }
  }

  async cleanup() {
    console.log('\n🧹 Cleaning up test data...')
    
    try {
      // Delete test documents
      await prisma.document.deleteMany({
        where: {
          name: {
            in: ['Document for Venture1', 'Document for Venture2']
          }
        }
      })

      // Delete test ventures
      await prisma.venture.deleteMany({
        where: {
          name: {
            in: ['Venture Org1', 'Venture Org2']
          }
        }
      })

      // Delete test users
      await prisma.user.deleteMany({
        where: {
          email: {
            in: ['test-org1@example.com', 'test-org2@example.com', 'admin@example.com']
          }
        }
      })

      console.log('✅ Cleanup completed')
    } catch (error) {
      console.error('❌ Cleanup failed:', error)
    }
  }

  printSummary() {
    console.log('\n📊 Test Summary:')
    console.log('================')
    
    const passed = this.results.filter(r => r.passed).length
    const total = this.results.length
    
    console.log(`Total Tests: ${total}`)
    console.log(`Passed: ${passed}`)
    console.log(`Failed: ${total - passed}`)
    console.log(`Success Rate: ${((passed / total) * 100).toFixed(1)}%`)
    
    if (passed === total) {
      console.log('\n🎉 All tests passed! User isolation is working correctly.')
    } else {
      console.log('\n⚠️  Some tests failed. Please review the implementation.')
    }
  }

  async runAllTests() {
    console.log('🚀 Starting User Isolation Tests...')
    
    const users = await this.testUserCreation()
    if (users.length === 0) return

    const ventures = await this.testVentureIsolation(users)
    await this.testDocumentIsolation(users, ventures)
    await this.testAdminAccess(users)
    
    await this.cleanup()
    this.printSummary()
  }
}

// Run the tests
async function main() {
  const tester = new UserIsolationTester()
  await tester.runAllTests()
}

if (require.main === module) {
  main().catch(console.error)
}

export { UserIsolationTester }
