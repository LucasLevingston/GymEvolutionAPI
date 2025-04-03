-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_trainingWeeks" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "weekNumber" INTEGER NOT NULL,
    "startDate" DATETIME NOT NULL,
    "endDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "information" TEXT,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "userId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "trainingWeeks_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_trainingWeeks" ("createdAt", "endDate", "id", "information", "isCompleted", "startDate", "updatedAt", "userId", "weekNumber") SELECT "createdAt", coalesce("endDate", CURRENT_TIMESTAMP) AS "endDate", "id", "information", "isCompleted", "startDate", "updatedAt", "userId", "weekNumber" FROM "trainingWeeks";
DROP TABLE "trainingWeeks";
ALTER TABLE "new_trainingWeeks" RENAME TO "trainingWeeks";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
