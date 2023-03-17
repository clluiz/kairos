import type { Scheduling } from "@prisma/client"
import type { KairosInstance } from "../types/kairos"
import { cancel, create, list } from "./services.js"

interface GetSchedulingParams {
  id: string
}

export default async function (app: KairosInstance) {
  app.get("/scheduling", async () => {
    return list()
  })

  app.post<{
    Body: Scheduling
  }>("/scheduling", (req, reply) => {
    create(req.body)
      .then((scheduling) => reply.send(scheduling))
      .catch((error) => reply.code(409).send(error))
  })

  app.delete<{
    Params: GetSchedulingParams
    Reply: Scheduling
  }>("/scheduling/:id", (req, reply) => {
    cancel(parseInt(req.params.id))
      .then((scheduling) => reply.send(scheduling))
      .catch((error) => reply.code(500).send(error))
  })
}
