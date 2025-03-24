/*
  Warnings:

  - You are about to drop the column `planDescription` on the `purchases` table. All the data in the column will be lost.
  - You are about to drop the column `planName` on the `purchases` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_purchases" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "buyerId" TEXT NOT NULL,
    "professionalId" TEXT NOT NULL,
    "planId" TEXT NOT NULL,
    "amount" REAL NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "paymentMethod" TEXT,
    "paymentId" TEXT,
    "cancelReason" TEXT,
    "cancelComment" TEXT,
    "cancelledAt" DATETIME,
    "relationshipId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userId" TEXT,
    CONSTRAINT "purchases_buyerId_fkey" FOREIGN KEY ("buyerId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "purchases_professionalId_fkey" FOREIGN KEY ("professionalId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "purchases_relationshipId_fkey" FOREIGN KEY ("relationshipId") REFERENCES "relationships" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "purchases_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "purchases_planId_fkey" FOREIGN KEY ("planId") REFERENCES "plans" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_purchases" ("amount", "buyerId", "cancelComment", "cancelReason", "cancelledAt", "createdAt", "id", "paymentId", "paymentMethod", "planId", "professionalId", "relationshipId", "status", "updatedAt", "userId") SELECT "amount", "buyerId", "cancelComment", "cancelReason", "cancelledAt", "createdAt", "id", "paymentId", "paymentMethod", "planId", "professionalId", "relationshipId", "status", "updatedAt", "userId" FROM "purchases";
DROP TABLE "purchases";
ALTER TABLE "new_purchases" RENAME TO "purchases";
CREATE UNIQUE INDEX "purchases_relationshipId_key" ON "purchases"("relationshipId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
