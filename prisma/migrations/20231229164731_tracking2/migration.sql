/*
  Warnings:

  - You are about to drop the column `container` on the `Container` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `TrackingHistory` table. All the data in the column will be lost.
  - You are about to drop the column `locationId` on the `TrackingHistory` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `TrackingHistory` table. All the data in the column will be lost.
  - You are about to drop the `Location` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[containerNumber]` on the table `Container` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `containerNumber` to the `Container` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `Tracking` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "TrackingHistory" DROP CONSTRAINT "TrackingHistory_locationId_fkey";

-- DropForeignKey
ALTER TABLE "TrackingHistory" DROP CONSTRAINT "TrackingHistory_trackingId_fkey";

-- DropIndex
DROP INDEX "Container_container_key";

-- AlterTable
ALTER TABLE "Container" DROP COLUMN "container",
ADD COLUMN     "containerNumber" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Tracking" ADD COLUMN     "status" TEXT NOT NULL,
ALTER COLUMN "invoiceId" DROP NOT NULL,
ALTER COLUMN "containerId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "TrackingHistory" DROP COLUMN "createdAt",
DROP COLUMN "locationId",
DROP COLUMN "updatedAt",
ADD COLUMN     "containerDate" TIMESTAMP(3),
ADD COLUMN     "customsDate" TIMESTAMP(3),
ADD COLUMN     "deliveredDate" TIMESTAMP(3),
ADD COLUMN     "invoiceDate" TIMESTAMP(3),
ADD COLUMN     "pendingTransfertDate" TIMESTAMP(3),
ADD COLUMN     "portDate" TIMESTAMP(3),
ADD COLUMN     "transfertDate" TIMESTAMP(3),
ALTER COLUMN "trackingId" DROP NOT NULL;

-- DropTable
DROP TABLE "Location";

-- CreateIndex
CREATE UNIQUE INDEX "Container_containerNumber_key" ON "Container"("containerNumber");

-- AddForeignKey
ALTER TABLE "Tracking" ADD CONSTRAINT "Tracking_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "Invoice"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tracking" ADD CONSTRAINT "Tracking_containerId_fkey" FOREIGN KEY ("containerId") REFERENCES "Container"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrackingHistory" ADD CONSTRAINT "TrackingHistory_trackingId_fkey" FOREIGN KEY ("trackingId") REFERENCES "Tracking"("id") ON DELETE CASCADE ON UPDATE CASCADE;
