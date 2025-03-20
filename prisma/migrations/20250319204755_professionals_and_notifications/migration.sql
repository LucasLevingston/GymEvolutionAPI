-- AlterTable
ALTER TABLE "users" ADD COLUMN "availability" TEXT;
ALTER TABLE "users" ADD COLUMN "bio" TEXT;
ALTER TABLE "users" ADD COLUMN "certifications" TEXT;
ALTER TABLE "users" ADD COLUMN "education" TEXT;
ALTER TABLE "users" ADD COLUMN "experience" INTEGER;
ALTER TABLE "users" ADD COLUMN "imageUrl" TEXT;
ALTER TABLE "users" ADD COLUMN "rating" REAL;
ALTER TABLE "users" ADD COLUMN "reviews" TEXT;
ALTER TABLE "users" ADD COLUMN "specialties" TEXT;

-- CreateTable
CREATE TABLE "notifications" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "link" TEXT,
    "userId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
