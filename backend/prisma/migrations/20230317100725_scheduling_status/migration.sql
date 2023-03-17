/*
  Warnings:

  - Added the required column `active` to the `scheduling` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "scheduling" ADD COLUMN     "active" BOOLEAN NOT NULL;
