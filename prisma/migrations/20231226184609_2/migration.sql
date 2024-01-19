-- DropForeignKey
ALTER TABLE "Package" DROP CONSTRAINT "Package_containerId_fkey";

-- AlterTable
ALTER TABLE "Package" ALTER COLUMN "containerId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Package" ADD CONSTRAINT "Package_containerId_fkey" FOREIGN KEY ("containerId") REFERENCES "Container"("id") ON DELETE SET NULL ON UPDATE CASCADE;
