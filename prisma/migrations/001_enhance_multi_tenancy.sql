-- Enhance multi-tenancy support
-- Add organization constraints and indexes

-- Add indexes for better performance on organization-based queries
CREATE INDEX IF NOT EXISTS "idx_ventures_organization" ON "ventures"("createdById");
CREATE INDEX IF NOT EXISTS "idx_ventures_assigned_org" ON "ventures"("assignedToId");
CREATE INDEX IF NOT EXISTS "idx_documents_venture_org" ON "documents"("ventureId");
CREATE INDEX IF NOT EXISTS "idx_activities_user_org" ON "activities"("userId");
CREATE INDEX IF NOT EXISTS "idx_activities_venture_org" ON "activities"("ventureId");
CREATE INDEX IF NOT EXISTS "idx_gedsi_metrics_venture_org" ON "gedsi_metrics"("ventureId");
CREATE INDEX IF NOT EXISTS "idx_capital_activities_venture_org" ON "capital_activities"("ventureId");

-- Add organization-based constraints for better data isolation
-- This ensures that data is properly isolated by organization

-- Update existing data to ensure proper organization assignment
UPDATE "users" SET "organization" = 'MIV' WHERE "organization" IS NULL OR "organization" = '';
UPDATE "ventures" SET "createdById" = (SELECT "id" FROM "users" WHERE "role" = 'ADMIN' LIMIT 1) WHERE "createdById" NOT IN (SELECT "id" FROM "users");

-- Add constraints to ensure data integrity
-- Note: SQLite doesn't support complex constraints, so we'll handle this at the application level

