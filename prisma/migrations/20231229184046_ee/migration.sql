/*
  Warnings:

  - You are about to drop the `TrackingHistory` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "TrackingHistory" DROP CONSTRAINT "TrackingHistory_trackingId_fkey";

-- AlterTable
ALTER TABLE "Tracking" ADD COLUMN     "containerDate" TIMESTAMP(3),
ADD COLUMN     "customsDate" TIMESTAMP(3),
ADD COLUMN     "deliveredDate" TIMESTAMP(3),
ADD COLUMN     "invoiceDate" TIMESTAMP(3),
ADD COLUMN     "pendingTransfertDate" TIMESTAMP(3),
ADD COLUMN     "portDate" TIMESTAMP(3),
ADD COLUMN     "transfertDate" TIMESTAMP(3);

-- DropTable
DROP TABLE "TrackingHistory";
