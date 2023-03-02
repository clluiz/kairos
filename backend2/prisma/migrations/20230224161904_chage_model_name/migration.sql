/*
  Warnings:

  - You are about to drop the `professional_availability` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "professional_availability" DROP CONSTRAINT "professional_availability_place_id_fkey";

-- DropForeignKey
ALTER TABLE "professional_availability" DROP CONSTRAINT "professional_availability_professional_id_fkey";

-- DropTable
DROP TABLE "professional_availability";

-- CreateTable
CREATE TABLE "professionalAvailability" (
    "id" SERIAL NOT NULL,
    "day" "DayOfWeek" NOT NULL,
    "start_time" TIME NOT NULL,
    "end_time" TIME NOT NULL,
    "professional_id" INTEGER NOT NULL,
    "place_id" INTEGER NOT NULL,

    CONSTRAINT "professionalAvailability_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "professionalAvailability" ADD CONSTRAINT "professionalAvailability_professional_id_fkey" FOREIGN KEY ("professional_id") REFERENCES "professional"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "professionalAvailability" ADD CONSTRAINT "professionalAvailability_place_id_fkey" FOREIGN KEY ("place_id") REFERENCES "place"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
