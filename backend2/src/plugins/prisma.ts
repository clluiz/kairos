import fp from 'fastify-plugin'
import { PrismaClient } from '@prisma/client'
import { FastifyInstance } from 'fastify';

export default fp(async function (app : FastifyInstance) {
  console.log('starting shared')

  const prismaClient : PrismaClient = new PrismaClient()

  app.decorate('prisma', prismaClient)

  app.addHook('onClose', async () => {
    prismaClient.$disconnect();
  })
})
