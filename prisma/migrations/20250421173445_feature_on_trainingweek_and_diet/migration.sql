-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_diets" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "weekNumber" INTEGER NOT NULL,
    "totalCalories" INTEGER,
    "totalProtein" REAL,
    "totalCarbohydrates" REAL,
    "totalFat" REAL,
    "isCurrent" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userId" TEXT,
    "featureId" TEXT,
    CONSTRAINT "diets_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "diets_featureId_fkey" FOREIGN KEY ("featureId") REFERENCES "features" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_diets" ("createdAt", "id", "isCurrent", "totalCalories", "totalCarbohydrates", "totalFat", "totalProtein", "updatedAt", "userId", "weekNumber") SELECT "createdAt", "id", "isCurrent", "totalCalories", "totalCarbohydrates", "totalFat", "totalProtein", "updatedAt", "userId", "weekNumber" FROM "diets";
DROP TABLE "diets";
ALTER TABLE "new_diets" RENAME TO "diets";
CREATE TABLE "new_trainingWeeks" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "weekNumber" INTEGER NOT NULL,
    "startDate" DATETIME NOT NULL,
    "endDate" DATETIME NOT NULL,
    "information" TEXT,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "userId" TEXT NOT NULL,
    "featureId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "trainingWeeks_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "trainingWeeks_featureId_fkey" FOREIGN KEY ("featureId") REFERENCES "features" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_trainingWeeks" ("createdAt", "endDate", "id", "information", "isCompleted", "startDate", "updatedAt", "userId", "weekNumber") SELECT "createdAt", "endDate", "id", "information", "isCompleted", "startDate", "updatedAt", "userId", "weekNumber" FROM "trainingWeeks";
DROP TABLE "trainingWeeks";
ALTER TABLE "new_trainingWeeks" RENAME TO "trainingWeeks";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
