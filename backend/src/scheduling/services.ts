import prisma from "../prisma/client.js"
import type { Scheduling } from "@prisma/client"
import { extractDayOfWeek } from "../dates/index.js"
import SchedulingError from "./exception.js"

async function isProfessionalAvailableForInTimeRange(
  professionalId: number,
  startTime: Date,
  endTime: Date
): Promise<boolean> {
  const scheduling = await prisma.scheduling.findFirst({
    where: {
      professionalId,
      active: true,
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
              gt: startTime,
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
      active: true,
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
              gt: startTime,
              lte: endTime,
            },
          },
        ],
      },
    },
  })

  return scheduling == null
}

async function isCustomerAvailableInTimeRange(
  customerId: number,
  startTime: Date,
  endTime: Date
): Promise<boolean> {
  const scheduling = await prisma.scheduling.findFirst({
    where: {
      customerId,
      active: true,
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
      day: {
        equals: extractDayOfWeek(startTime),
      },
      startTime: {
        lte: startTime,
      },
      endTime: {
        gte: endTime,
      },
    },
  })
  return availability != null
}

export async function create(newScheduling: Scheduling) {
  if (
    !(await isProfessionalAvailable(
      newScheduling.professionalId,
      newScheduling.placeId,
      newScheduling.startTime,
      newScheduling.endTime
    ))
  ) {
    throw new SchedulingError(
      409,
      "O profissional escolhido não está disponível para esse horário ou lugar"
    )
  }

  if (
    !(await isCustomerAvailableInTimeRange(
      newScheduling.customerId,
      newScheduling.startTime,
      newScheduling.endTime
    ))
  ) {
    throw new SchedulingError(
      409,
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
    throw new SchedulingError(
      409,
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
    throw new SchedulingError(
      409,
      "Já existe um agendamento marcado para este horário com neste local"
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

export async function cancel(id: number) {
  return await prisma.scheduling.update({
    where: {
      id,
    },
    data: {
      active: false,
    },
  })
}

export async function list() {
  return prisma.scheduling.findMany()
}
