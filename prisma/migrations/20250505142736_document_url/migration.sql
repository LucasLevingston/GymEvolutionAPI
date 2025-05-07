/*
  Warnings:

  - You are about to drop the `documents` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "documents" DROP CONSTRAINT "documents_userId_fkey";

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "documentUrl" TEXT;

-- DropTable
DROP TABLE "documents";
