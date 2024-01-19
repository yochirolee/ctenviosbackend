/*
  Warnings:

  - You are about to drop the column `hbl` on the `TrackingHistory` table. All the data in the column will be lost.
  - Added the required column `containerId` to the `Tracking` table without a default value. This is not possible if the table is not empty.
  - Made the column `trackingId` on table `TrackingHistory` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "TrackingHistory" DROP CONSTRAINT "TrackingHistory_trackingId_fkey";

-- AlterTable
ALTER TABLE "Tracking" ADD COLUMN     "containerId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "TrackingHistory" DROP COLUMN "hbl",
ALTER COLUMN "trackingId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "TrackingHistory" ADD CONSTRAINT "TrackingHistory_trackingId_fkey" FOREIGN KEY ("trackingId") REFERENCES "Tracking"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
