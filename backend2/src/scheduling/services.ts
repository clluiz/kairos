
import prisma from "../prisma/client"
import type { Scheduling } from "@prisma/client"

export async function list() {
  return prisma.scheduling.findMany()
}

async function isProfessionalAvailableForInTimeRange(professionalId: number, startTime: Date, endTime: Date): Promise<boolean> {
  
  const scheduling = await prisma.scheduling.findFirst({
    where: {
      professionalId,
      AND: {
        OR: [
          {
            startTime: { 
              gte: startTime,
              lte: endTime, 
            }
          },
          {
            endTime: {
              gte: startTime, 
              lte: endTime 
            }
          }
        ]
      }
    }
  })

  return scheduling == null
}

async function isPlaceAvailableForInTimeRange(placeId: number, startTime: Date, endTime: Date): Promise<boolean> {

  const scheduling = await prisma.scheduling.findFirst({
    where: {
      placeId,
      AND: {
        OR: [
          {
            startTime: { 
              gte: startTime,
              lte: endTime, 
            }
          },
          {
            endTime: {
              gte: startTime, 
              lte: endTime 
            }
          }
        ]
      }
    }
  })

  return scheduling == null
}

async function isCustomerAvailableForInTimeRange(customerId: number, startTime: Date, endTime: Date): Promise<boolean> {

  const scheduling = await prisma.scheduling.findFirst({
    where: {
      customerId,
      AND: {
        OR: [
          {
            startTime: { 
              gte: startTime,
              lte: endTime, 
            }
          },
          {
            endTime: {
              gte: startTime, 
              lte: endTime 
            }
          }
        ]
      }
    }
  })

  return scheduling == null

}

export async function create(newScheduling : Scheduling) {

  if(!(await isCustomerAvailableForInTimeRange(newScheduling.customerId, newScheduling.startTime, newScheduling.endTime))) {
    throw new Error("Já existe um agendamento marcado para este horário com esse cliente")
  
  }  
  
  if(!(await isProfessionalAvailableForInTimeRange(newScheduling.professionalId, newScheduling.startTime, newScheduling.endTime))) {
    throw new Error("Já existe um agendamento marcado para este horário com esse profissional")
  }

  if(!(await isPlaceAvailableForInTimeRange(newScheduling.placeId, newScheduling.startTime, newScheduling.endTime))) {
    throw new Error("Já existe um agendamento marcado para este horário com neste local")
  }

  return await prisma.scheduling.create({
    data: {
      startTime: newScheduling.startTime,
      endTime: newScheduling.endTime,
      professionalId: newScheduling.professionalId,
      customerId: newScheduling.customerId,
      placeId: newScheduling.placeId,
      description: newScheduling.description
    }
  })
}