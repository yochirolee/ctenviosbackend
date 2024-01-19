/*
  Warnings:

  - You are about to drop the column `containerId` on the `Tracking` table. All the data in the column will be lost.
  - You are about to drop the column `invoiceId` on the `Tracking` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Tracking" DROP CONSTRAINT "Tracking_containerId_fkey";

-- DropForeignKey
ALTER TABLE "Tracking" DROP CONSTRAINT "Tracking_invoiceId_fkey";

-- AlterTable
ALTER TABLE "Tracking" DROP COLUMN "containerId",
DROP COLUMN "invoiceId";
