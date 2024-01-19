/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Tracking` table. All the data in the column will be lost.
  - You are about to drop the column `placeId` on the `Tracking` table. All the data in the column will be lost.
  - You are about to drop the `TrackingPlace` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Tracking" DROP CONSTRAINT "Tracking_placeId_fkey";

-- AlterTable
ALTER TABLE "Tracking" DROP COLUMN "createdAt",
DROP COLUMN "placeId";

-- DropTable
DROP TABLE "TrackingPlace";

-- CreateTable
CREATE TABLE "Location" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Location_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrackingHistory" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "hbl" TEXT NOT NULL,
    "locationId" INTEGER NOT NULL,
    "trackingId" INTEGER,

    CONSTRAINT "TrackingHistory_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TrackingHistory" ADD CONSTRAINT "TrackingHistory_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrackingHistory" ADD CONSTRAINT "TrackingHistory_trackingId_fkey" FOREIGN KEY ("trackingId") REFERENCES "Tracking"("id") ON DELETE SET NULL ON UPDATE CASCADE;
