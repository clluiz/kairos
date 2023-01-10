import { PrismaClient } from "@prisma/client"
import { FastifyInstance } from "fastify"
import { SchedulingService } from "./scheduling/services.js"

interface Services {
  scheduling : ReturnType<typeof SchedulingService>,
}

export interface KairosInstance extends FastifyInstance {
  prisma: PrismaClient,
  services: Services,
}