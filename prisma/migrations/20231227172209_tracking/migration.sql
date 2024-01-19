/*
  Warnings:

  - You are about to drop the column `packageId` on the `Tracking` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[hbl]` on the table `Tracking` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `hbl` to the `Tracking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `invoiceId` to the `Tracking` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Tracking" DROP CONSTRAINT "Tracking_packageId_fkey";

-- AlterTable
ALTER TABLE "Tracking" DROP COLUMN "packageId",
ADD COLUMN     "hbl" TEXT NOT NULL,
ADD COLUMN     "invoiceId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Tracking_hbl_key" ON "Tracking"("hbl");
