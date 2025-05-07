/*
  Warnings:

  - You are about to drop the `features` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "FeatureType" AS ENUM ('TRAINING_WEEK', 'DIET', 'FEEDBACK', 'CONSULTATION', 'RETURN', 'MATERIALS');

-- DropForeignKey
ALTER TABLE "diets" DROP CONSTRAINT "diets_featureId_fkey";

-- DropForeignKey
ALTER TABLE "features" DROP CONSTRAINT "features_planId_fkey";

-- DropForeignKey
ALTER TABLE "trainingWeeks" DROP CONSTRAINT "trainingWeeks_featureId_fkey";

-- DropTable
DROP TABLE "features";

-- CreateTable
CREATE TABLE "Feature" (
    "id" TEXT NOT NULL,
    "planId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "FeatureType" NOT NULL,
    "trainingWeekId" TEXT,
    "dietId" TEXT,
    "feedback" TEXT,
    "scheduledDay" INTEGER,
    "consultationMeetingId" TEXT,
    "returnMeetingId" TEXT,
    "linkToResolve" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Feature_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Feature" ADD CONSTRAINT "Feature_planId_fkey" FOREIGN KEY ("planId") REFERENCES "plans"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trainingWeeks" ADD CONSTRAINT "trainingWeeks_featureId_fkey" FOREIGN KEY ("featureId") REFERENCES "Feature"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "diets" ADD CONSTRAINT "diets_featureId_fkey" FOREIGN KEY ("featureId") REFERENCES "Feature"("id") ON DELETE SET NULL ON UPDATE CASCADE;
