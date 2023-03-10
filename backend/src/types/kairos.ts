import type { PrismaClient } from "@prisma/client"
import type { FastifyInstance } from "fastify"

export interface KairosInstance extends FastifyInstance {
  prisma: PrismaClient
}
