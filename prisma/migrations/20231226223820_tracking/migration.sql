/*
  Warnings:

  - You are about to drop the column `status` on the `Package` table. All the data in the column will be lost.
  - You are about to drop the `PackageStatusHistory` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "PackageStatusHistory" DROP CONSTRAINT "PackageStatusHistory_packageId_fkey";

-- AlterTable
ALTER TABLE "Package" DROP COLUMN "status";

-- DropTable
DROP TABLE "PackageStatusHistory";

-- DropEnum
DROP TYPE "PackageStatus";

-- CreateTable
CREATE TABLE "Tracking" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "packageId" INTEGER NOT NULL,
    "placeId" INTEGER NOT NULL,

    CONSTRAINT "Tracking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrackingPlace" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "TrackingPlace_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Tracking" ADD CONSTRAINT "Tracking_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "Package"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tracking" ADD CONSTRAINT "Tracking_placeId_fkey" FOREIGN KEY ("placeId") REFERENCES "TrackingPlace"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
