
import { KairosInstance } from "../types/kairos"
import prisma from "../prisma/client"
import type { Scheduling } from "@prisma/client"

export async function list() {
  return prisma.scheduling.findMany()
}

export async function create(scheduling : Scheduling) {

  //
  const interposedScheduling = await prisma.scheduling.findFirst({
    where: {
      OR: [
        {
          startTime: { gte: scheduling.startTime }
        },
        {
          endTime: { lte: scheduling.endTime }
        }
      ]
    }
  })

  if(interposedScheduling) {
    throw new Error("Já existe um agendamento marcado para este horário")
  }

  return await prisma.scheduling.create({
    data: {
      startTime: scheduling.startTime,
      endTime: scheduling.endTime,
      professionalId: scheduling.professionalId,
      customerId: scheduling.customerId,
      placeId: scheduling.placeId,
      description: scheduling.description
    }
  })
}

// export function SchedulingService(app : KairosInstance) {
//   return {
//     async create(scheduling : Scheduling | null) {
//       return {}
//     },
//     async list() {
//       return prisma.scheduling.findMany()
//     }
//   }
// }