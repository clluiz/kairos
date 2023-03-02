/*
  Warnings:

  - You are about to drop the `professionalAvailability` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "professionalAvailability" DROP CONSTRAINT "professionalAvailability_place_id_fkey";

-- DropForeignKey
ALTER TABLE "professionalAvailability" DROP CONSTRAINT "professionalAvailability_professional_id_fkey";

-- DropTable
DROP TABLE "professionalAvailability";

-- CreateTable
CREATE TABLE "professional_availability" (
    "id" SERIAL NOT NULL,
    "day" "DayOfWeek" NOT NULL,
    "start_time" TIME NOT NULL,
    "end_time" TIME NOT NULL,
    "professional_id" INTEGER NOT NULL,
    "place_id" INTEGER NOT NULL,

    CONSTRAINT "professional_availability_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "professional_availability" ADD CONSTRAINT "professional_availability_professional_id_fkey" FOREIGN KEY ("professional_id") REFERENCES "professional"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "professional_availability" ADD CONSTRAINT "professional_availability_place_id_fkey" FOREIGN KEY ("place_id") REFERENCES "place"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
