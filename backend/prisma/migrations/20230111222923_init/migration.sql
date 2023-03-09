/*
  Warnings:

  - Added the required column `customer_id` to the `scheduling` table without a default value. This is not possible if the table is not empty.
  - Added the required column `professional_id` to the `scheduling` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "scheduling" ADD COLUMN     "customer_id" INTEGER NOT NULL,
ADD COLUMN     "professional_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "scheduling" ADD CONSTRAINT "scheduling_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scheduling" ADD CONSTRAINT "scheduling_professional_id_fkey" FOREIGN KEY ("professional_id") REFERENCES "professional"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
