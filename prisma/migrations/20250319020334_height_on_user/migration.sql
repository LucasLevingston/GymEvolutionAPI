/*
  Warnings:

  - You are about to drop the column `current` on the `trainingWeeks` table. All the data in the column will be lost.
  - Added the required column `startDate` to the `trainingWeeks` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "users" ADD COLUMN "height" TEXT;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_exercises" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "variation" TEXT,
    "repetitions" INTEGER NOT NULL,
    "sets" INTEGER NOT NULL,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "trainingDayId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "exercises_trainingDayId_fkey" FOREIGN KEY ("trainingDayId") REFERENCES "trainingDays" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_exercises" ("createdAt", "id", "isCompleted", "name", "repetitions", "sets", "trainingDayId", "updatedAt", "variation") SELECT "createdAt", "id", "isCompleted", "name", "repetitions", "sets", "trainingDayId", "updatedAt", "variation" FROM "exercises";
DROP TABLE "exercises";
ALTER TABLE "new_exercises" RENAME TO "exercises";
CREATE TABLE "new_series" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "seriesIndex" INTEGER,
    "repetitions" INTEGER,
    "weight" INTEGER,
    "exerciseId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "series_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "exercises" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_series" ("createdAt", "exerciseId", "id", "repetitions", "seriesIndex", "updatedAt", "weight") SELECT "createdAt", "exerciseId", "id", "repetitions", "seriesIndex", "updatedAt", "weight" FROM "series";
DROP TABLE "series";
ALTER TABLE "new_series" RENAME TO "series";
CREATE TABLE "new_trainingDays" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "group" TEXT NOT NULL,
    "dayOfWeek" TEXT NOT NULL,
    "day" DATETIME NOT NULL,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "comments" TEXT,
    "trainingWeekId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "trainingDayId" TEXT,
    CONSTRAINT "trainingDays_trainingWeekId_fkey" FOREIGN KEY ("trainingWeekId") REFERENCES "trainingWeeks" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_trainingDays" ("comments", "createdAt", "day", "dayOfWeek", "group", "id", "isCompleted", "trainingWeekId", "updatedAt") SELECT "comments", "createdAt", "day", "dayOfWeek", "group", "id", "isCompleted", "trainingWeekId", "updatedAt" FROM "trainingDays";
DROP TABLE "trainingDays";
ALTER TABLE "new_trainingDays" RENAME TO "trainingDays";
CREATE TABLE "new_trainingWeeks" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "weekNumber" INTEGER NOT NULL,
    "startDate" DATETIME NOT NULL,
    "information" TEXT,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "userId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "trainingWeeks_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_trainingWeeks" ("createdAt", "id", "information", "isCompleted", "updatedAt", "userId", "weekNumber") SELECT "createdAt", "id", "information", "isCompleted", "updatedAt", "userId", "weekNumber" FROM "trainingWeeks";
DROP TABLE "trainingWeeks";
ALTER TABLE "new_trainingWeeks" RENAME TO "trainingWeeks";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
