import { PrismaClient } from "@prisma/client";
import { FastifyInstance } from "fastify";

export interface KairosInstance extends FastifyInstance {
  prisma: PrismaClient
}