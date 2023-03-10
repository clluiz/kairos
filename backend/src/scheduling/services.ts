import prisma from "../prisma/client"
import type { Scheduling } from "@prisma/client"
import { extractDayOfWeek } from "../dates"

async function isProfessionalAvailableForInTimeRange(
  professionalId: number,
  startTime: Date,
  endTime: Date
): Promise<boolean> {
  const scheduling = await prisma.scheduling.findFirst({
    where: {
      professionalId,
      AND: {
        OR: [
          {
            startTime: {
              gte: startTime,
              lte: endTime,
            },
          },
          {
            endTime: {
              gte: startTime,
              lte: endTime,
            },
          },
        ],
      },
    },
  })

  return scheduling == null
}

async function isPlaceAvailableForInTimeRange(
  placeId: number,
  startTime: Date,
  endTime: Date
): Promise<boolean> {
  const scheduling = await prisma.scheduling.findFirst({
    where: {
      placeId,
      AND: {
        OR: [
          {
            startTime: {
              gte: startTime,
              lte: endTime,
            },
          },
          {
            endTime: {
              gte: startTime,
              lte: endTime,
            },
          },
        ],
      },
    },
  })

  return scheduling == null
}

async function isCustomerAvailableForInTimeRange(
  customerId: number,
  startTime: Date,
  endTime: Date
): Promise<boolean> {
  const scheduling = await prisma.scheduling.findFirst({
    where: {
      customerId,
      AND: {
        OR: [
          {
            startTime: {
              gte: startTime,
              lte: endTime,
            },
          },
          {
            endTime: {
              gte: startTime,
              lte: endTime,
            },
          },
        ],
      },
    },
  })

  return scheduling == null
}

async function isProfessionalAvailable(
  professionalId: number,
  placeId: number,
  startTime: Date,
  endTime: Date
): Promise<boolean> {
  const availability = await prisma.professionalAvailability.findFirst({
    where: {
      professionalId,
      placeId,
      AND: {
        day: {
          equals: extractDayOfWeek(startTime),
        },
        AND: {
          day: {
            equals: extractDayOfWeek(endTime),
          },
        },
      },
      startTime: {
        gte: startTime,
      },
      endTime: {
        lte: endTime,
      },
    },
  })

  return availability != null
}

export async function create(newScheduling: Scheduling) {
  if (
    !(await isCustomerAvailableForInTimeRange(
      newScheduling.customerId,
      newScheduling.startTime,
      newScheduling.endTime
    ))
  ) {
    throw new Error(
      "Já existe um agendamento marcado para este horário com esse cliente"
    )
  }

  if (
    !(await isProfessionalAvailableForInTimeRange(
      newScheduling.professionalId,
      newScheduling.startTime,
      newScheduling.endTime
    ))
  ) {
    throw new Error(
      "Já existe um agendamento marcado para este horário com esse profissional"
    )
  }

  if (
    !(await isPlaceAvailableForInTimeRange(
      newScheduling.placeId,
      newScheduling.startTime,
      newScheduling.endTime
    ))
  ) {
    throw new Error(
      "Já existe um agendamento marcado para este horário com neste local"
    )
  }

  if (
    !(await isProfessionalAvailable(
      newScheduling.professionalId,
      newScheduling.placeId,
      newScheduling.startTime,
      newScheduling.endTime
    ))
  ) {
    throw new Error(
      "O profissional escolhido não está disponível para esse horário, ou lugar"
    )
  }

  return await prisma.scheduling.create({
    data: {
      startTime: newScheduling.startTime,
      endTime: newScheduling.endTime,
      professionalId: newScheduling.professionalId,
      customerId: newScheduling.customerId,
      placeId: newScheduling.placeId,
      description: newScheduling.description,
    },
  })
}

export async function list() {
  return prisma.scheduling.findMany()
}
