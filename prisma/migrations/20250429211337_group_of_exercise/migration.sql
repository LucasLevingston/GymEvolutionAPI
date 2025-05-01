/*
  Warnings:

  - Added the required column `group` to the `exercises` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "exercises" ADD COLUMN     "group" TEXT NOT NULL;
