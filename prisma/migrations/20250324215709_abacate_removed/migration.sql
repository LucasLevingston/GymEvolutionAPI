/*
  Warnings:

  - You are about to drop the column `abacatePayConnected` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `abacatePayId` on the `users` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT,
    "sex" TEXT,
    "street" TEXT,
    "number" TEXT,
    "zipCode" TEXT,
    "city" TEXT,
    "state" TEXT,
    "birthDate" TEXT,
    "phone" TEXT,
    "currentWeight" TEXT,
    "currentBf" TEXT,
    "resetPasswordToken" TEXT,
    "height" TEXT,
    "resetPasswordExpires" DATETIME,
    "role" TEXT NOT NULL DEFAULT 'STUDENT',
    "bio" TEXT,
    "experience" INTEGER,
    "rating" REAL,
    "imageUrl" TEXT,
    "specialties" TEXT,
    "certifications" TEXT,
    "education" TEXT,
    "availability" TEXT,
    "reviews" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_users" ("availability", "bio", "birthDate", "certifications", "city", "createdAt", "currentBf", "currentWeight", "education", "email", "experience", "height", "id", "imageUrl", "name", "number", "password", "phone", "rating", "resetPasswordExpires", "resetPasswordToken", "reviews", "role", "sex", "specialties", "state", "street", "updatedAt", "zipCode") SELECT "availability", "bio", "birthDate", "certifications", "city", "createdAt", "currentBf", "currentWeight", "education", "email", "experience", "height", "id", "imageUrl", "name", "number", "password", "phone", "rating", "resetPasswordExpires", "resetPasswordToken", "reviews", "role", "sex", "specialties", "state", "street", "updatedAt", "zipCode" FROM "users";
DROP TABLE "users";
ALTER TABLE "new_users" RENAME TO "users";
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
