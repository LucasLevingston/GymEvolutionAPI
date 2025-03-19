/*
  Warnings:

  - You are about to drop the column `servingSize` on the `meals` table. All the data in the column will be lost.
  - Added the required column `day` to the `trainingDays` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "users" ADD COLUMN "currentBf" TEXT;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_mealItems" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "quantityType" TEXT NOT NULL DEFAULT 'g',
    "calories" INTEGER,
    "protein" REAL,
    "carbohydrates" REAL,
    "fat" REAL,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "isSubstitution" BOOLEAN NOT NULL DEFAULT false,
    "originalItemId" TEXT,
    "mealId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "mealItems_originalItemId_fkey" FOREIGN KEY ("originalItemId") REFERENCES "mealItems" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "mealItems_mealId_fkey" FOREIGN KEY ("mealId") REFERENCES "meals" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_mealItems" ("calories", "carbohydrates", "createdAt", "fat", "id", "isCompleted", "mealId", "name", "protein", "quantity", "updatedAt") SELECT "calories", "carbohydrates", "createdAt", "fat", "id", "isCompleted", "mealId", "name", "protein", "quantity", "updatedAt" FROM "mealItems";
DROP TABLE "mealItems";
ALTER TABLE "new_mealItems" RENAME TO "mealItems";
CREATE TABLE "new_meals" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT,
    "calories" INTEGER,
    "protein" REAL,
    "carbohydrates" REAL,
    "fat" REAL,
    "mealType" TEXT,
    "day" INTEGER,
    "hour" TEXT,
    "isCompleted" BOOLEAN DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "dietId" TEXT,
    CONSTRAINT "meals_dietId_fkey" FOREIGN KEY ("dietId") REFERENCES "diets" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_meals" ("calories", "carbohydrates", "createdAt", "day", "dietId", "fat", "hour", "id", "isCompleted", "mealType", "name", "protein", "updatedAt") SELECT "calories", "carbohydrates", "createdAt", "day", "dietId", "fat", "hour", "id", "isCompleted", "mealType", "name", "protein", "updatedAt" FROM "meals";
DROP TABLE "meals";
ALTER TABLE "new_meals" RENAME TO "meals";
CREATE TABLE "new_trainingDays" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "group" TEXT NOT NULL,
    "dayOfWeek" TEXT NOT NULL,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "comments" TEXT,
    "day" DATETIME NOT NULL,
    "trainingWeekId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "trainingDays_trainingWeekId_fkey" FOREIGN KEY ("trainingWeekId") REFERENCES "trainingWeeks" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_trainingDays" ("comments", "createdAt", "dayOfWeek", "group", "id", "isCompleted", "trainingWeekId", "updatedAt") SELECT "comments", "createdAt", "dayOfWeek", "group", "id", "isCompleted", "trainingWeekId", "updatedAt" FROM "trainingDays";
DROP TABLE "trainingDays";
ALTER TABLE "new_trainingDays" RENAME TO "trainingDays";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
