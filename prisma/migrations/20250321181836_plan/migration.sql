-- CreateTable
CREATE TABLE "plans" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "price" REAL NOT NULL,
    "duration" INTEGER NOT NULL,
    "features" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "professionalId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "plans_professionalId_fkey" FOREIGN KEY ("professionalId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "purchases" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "buyerId" TEXT NOT NULL,
    "professionalId" TEXT NOT NULL,
    "planId" TEXT NOT NULL,
    "planName" TEXT NOT NULL,
    "planDescription" TEXT,
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

-- CreateTable
CREATE TABLE "meetings" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "meetLink" TEXT,
    "meetingCode" TEXT,
    "startTime" DATETIME NOT NULL,
    "endTime" DATETIME NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'SCHEDULED',
    "professionalId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "purchaseId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "meetings_professionalId_fkey" FOREIGN KEY ("professionalId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "meetings_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "meetings_purchaseId_fkey" FOREIGN KEY ("purchaseId") REFERENCES "purchases" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

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
    "abacatePayId" TEXT,
    "abacatePayConnected" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_users" ("availability", "bio", "birthDate", "certifications", "city", "createdAt", "currentBf", "currentWeight", "education", "email", "experience", "height", "id", "imageUrl", "name", "number", "password", "phone", "rating", "resetPasswordExpires", "resetPasswordToken", "reviews", "role", "sex", "specialties", "state", "street", "updatedAt", "zipCode") SELECT "availability", "bio", "birthDate", "certifications", "city", "createdAt", "currentBf", "currentWeight", "education", "email", "experience", "height", "id", "imageUrl", "name", "number", "password", "phone", "rating", "resetPasswordExpires", "resetPasswordToken", "reviews", "role", "sex", "specialties", "state", "street", "updatedAt", "zipCode" FROM "users";
DROP TABLE "users";
ALTER TABLE "new_users" RENAME TO "users";
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "purchases_relationshipId_key" ON "purchases"("relationshipId");
