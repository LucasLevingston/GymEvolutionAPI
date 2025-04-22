-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_mealItems" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "quantity" TEXT NOT NULL,
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
INSERT INTO "new_mealItems" ("calories", "carbohydrates", "createdAt", "fat", "id", "isCompleted", "isSubstitution", "mealId", "name", "originalItemId", "protein", "quantity", "quantityType", "updatedAt") SELECT "calories", "carbohydrates", "createdAt", "fat", "id", "isCompleted", "isSubstitution", "mealId", "name", "originalItemId", "protein", "quantity", "quantityType", "updatedAt" FROM "mealItems";
DROP TABLE "mealItems";
ALTER TABLE "new_mealItems" RENAME TO "mealItems";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
