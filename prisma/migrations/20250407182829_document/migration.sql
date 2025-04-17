-- AlterTable
ALTER TABLE "users" ADD COLUMN "approvalStatus" TEXT DEFAULT 'NOTSOLICITED';
ALTER TABLE "users" ADD COLUMN "approvedAt" DATETIME;
ALTER TABLE "users" ADD COLUMN "rejectedAt" DATETIME;
ALTER TABLE "users" ADD COLUMN "rejectionReason" TEXT;

-- CreateTable
CREATE TABLE "documents" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "url" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "documents_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
