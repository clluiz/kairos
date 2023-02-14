import { PrismaClient } from "@prisma/client";
import { FastifyInstance } from "fastify";
import { Services } from './services';

export interface KairosInstance extends FastifyInstance {
    prisma: PrismaClient,
    services: Services,
  }