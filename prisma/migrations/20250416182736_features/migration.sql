/*
  Warnings:

  - You are about to drop the column `features` on the `plans` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "Feature" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "isTrainingWeek" BOOLEAN NOT NULL DEFAULT false,
    "trainingWeekId" TEXT,
    "isDiet" BOOLEAN NOT NULL DEFAULT false,
    "dietId" TEXT,
    "isFeedback" BOOLEAN NOT NULL DEFAULT false,
    "feedback" TEXT NOT NULL,
    "isConsultation" BOOLEAN NOT NULL DEFAULT false,
    "consultationMeetingId" TEXT NOT NULL,
    "isReturn" BOOLEAN NOT NULL DEFAULT false,
    "returnMeetingId" TEXT NOT NULL,
    "linkToResolve" TEXT,
    "planId" TEXT,
    CONSTRAINT "Feature_planId_fkey" FOREIGN KEY ("planId") REFERENCES "plans" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_plans" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "price" REAL NOT NULL,
    "duration" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "metadata" TEXT,
    "professionalId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "plans_professionalId_fkey" FOREIGN KEY ("professionalId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_plans" ("createdAt", "description", "duration", "id", "isActive", "metadata", "name", "price", "professionalId", "updatedAt") SELECT "createdAt", "description", "duration", "id", "isActive", "metadata", "name", "price", "professionalId", "updatedAt" FROM "plans";
DROP TABLE "plans";
ALTER TABLE "new_plans" RENAME TO "plans";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
