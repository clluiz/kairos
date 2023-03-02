import type { Scheduling } from "@prisma/client"
import { FastifyRequest } from "fastify"
import { KairosInstance } from "../types/kairos"
import { create, list } from "./services"

export default async function(app : KairosInstance) {
  app.get('/scheduling', async () => {
    return list()
  })

  app.post<{
    Body: Scheduling
  }>('/scheduling', async (req) => {
    const result = await create(req.body)
    return result
  })
}
