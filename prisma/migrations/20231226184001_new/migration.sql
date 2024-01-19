-- DropForeignKey
ALTER TABLE "Package" DROP CONSTRAINT "Package_invoiceId_fkey";

-- AlterTable
ALTER TABLE "Package" ALTER COLUMN "invoiceId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Package" ADD CONSTRAINT "Package_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "Invoice"("id") ON DELETE SET NULL ON UPDATE CASCADE;
