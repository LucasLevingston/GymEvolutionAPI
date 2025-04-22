/*
  Warnings:

  - You are about to drop the `Feature` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Feature";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "features" (
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
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "features_planId_fkey" FOREIGN KEY ("planId") REFERENCES "plans" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
