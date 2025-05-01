/*
  Warnings:

  - The `status` column on the `professionalSubscriptions` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `paymentStatus` column on the `purchases` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `status` column on the `purchases` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `role` column on the `users` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `approvalStatus` column on the `users` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `relationships` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "RoleEnum" AS ENUM ('STUDENT', 'NUTRITIONIST', 'TRAINER', 'ADMIN');

-- CreateEnum
CREATE TYPE "approvalStatusEnum" AS ENUM ('NOTSOLICITED', 'APPROVED', 'REJECTED', 'WAITING');

-- CreateEnum
CREATE TYPE "ProfessionalSubscriptionStatusEnum" AS ENUM ('ACTIVE', 'CANCELLED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "paymentStatusEnum" AS ENUM ('PENDING', 'COMPLETED');

-- CreateEnum
CREATE TYPE "purchaseStatusEnum" AS ENUM ('WAITINGPAYMENT', 'ACTIVE', 'COMPLETED', 'CANCELLED');

-- DropForeignKey
ALTER TABLE "purchases" DROP CONSTRAINT "purchases_relationshipId_fkey";

-- DropForeignKey
ALTER TABLE "relationships" DROP CONSTRAINT "relationships_nutritionistId_fkey";

-- DropForeignKey
ALTER TABLE "relationships" DROP CONSTRAINT "relationships_student2Id_fkey";

-- DropForeignKey
ALTER TABLE "relationships" DROP CONSTRAINT "relationships_studentId_fkey";

-- DropForeignKey
ALTER TABLE "relationships" DROP CONSTRAINT "relationships_trainerId_fkey";

-- AlterTable
ALTER TABLE "features" ADD COLUMN     "dateToResolve" TEXT;

-- AlterTable
ALTER TABLE "professionalSubscriptions" DROP COLUMN "status",
ADD COLUMN     "status" "ProfessionalSubscriptionStatusEnum" NOT NULL DEFAULT 'ACTIVE';

-- AlterTable
ALTER TABLE "purchases" DROP COLUMN "paymentStatus",
ADD COLUMN     "paymentStatus" "paymentStatusEnum" NOT NULL DEFAULT 'PENDING',
DROP COLUMN "status",
ADD COLUMN     "status" "purchaseStatusEnum" NOT NULL DEFAULT 'WAITINGPAYMENT';

-- AlterTable
ALTER TABLE "users" DROP COLUMN "role",
ADD COLUMN     "role" "RoleEnum" NOT NULL DEFAULT 'STUDENT',
DROP COLUMN "approvalStatus",
ADD COLUMN     "approvalStatus" "approvalStatusEnum" DEFAULT 'NOTSOLICITED';

-- DropTable
DROP TABLE "relationships";
