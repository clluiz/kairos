import type { Scheduling } from "@prisma/client"
import type { KairosInstance } from "../types/kairos"
import { create, list } from "./services.js"

export default async function(app : KairosInstance) {
  app.get('/scheduling', async () => {
    return list()
  })

  app.post<{
    Body: Scheduling,
    
  }>('/scheduling', (req, reply) => {

    create(req.body)
      .then(scheduling => reply.send(scheduling))
      .catch(error => reply.code(409).send(error))
  })
}
