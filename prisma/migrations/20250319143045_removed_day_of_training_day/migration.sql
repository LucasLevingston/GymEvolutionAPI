/*
  Warnings:

  - You are about to drop the column `day` on the `trainingDays` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_trainingDays" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "group" TEXT NOT NULL,
    "dayOfWeek" TEXT NOT NULL,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "comments" TEXT,
    "trainingWeekId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "trainingDayId" TEXT,
    CONSTRAINT "trainingDays_trainingWeekId_fkey" FOREIGN KEY ("trainingWeekId") REFERENCES "trainingWeeks" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_trainingDays" ("comments", "createdAt", "dayOfWeek", "group", "id", "isCompleted", "trainingDayId", "trainingWeekId", "updatedAt") SELECT "comments", "createdAt", "dayOfWeek", "group", "id", "isCompleted", "trainingDayId", "trainingWeekId", "updatedAt" FROM "trainingDays";
DROP TABLE "trainingDays";
ALTER TABLE "new_trainingDays" RENAME TO "trainingDays";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
