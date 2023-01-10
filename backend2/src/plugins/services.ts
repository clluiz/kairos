import { FastifyInstance } from 'fastify'
import fp from 'fastify-plugin'
import { KairosInstance } from '../kairosInstance.js'
import { SchedulingService } from '../scheduling/services.js'

export default fp(async function (app : FastifyInstance) {
  app.decorate('services', {
    scheduling: SchedulingService(app as KairosInstance)
  })
})