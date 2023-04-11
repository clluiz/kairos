import type { Scheduling } from "@prisma/client"
//import { notifyViaWhatsapp } from "@/externalServices/whatsapp"
import type { KairosInstance } from "../types/kairos.js"
import SchedulingError from "./exception.js"
import { cancel, create, list } from "./services.js"

interface GetSchedulingParams {
  id: string
}

export default async function (app: KairosInstance) {
  app.post<{
    Body: Scheduling
  }>("/scheduling", (req, reply) => {
    create(req.body)
      .then((scheduling) => reply.send(scheduling))
      .catch((error) => {
        if (error instanceof SchedulingError) {
          reply.code(error.httpStatusCode).send(error)
        }
        reply.internalServerError()
      })
  })

  app.delete<{
    Params: GetSchedulingParams
    Reply: Scheduling
  }>("/scheduling/:id", (req, reply) => {
    cancel(parseInt(req.params.id))
      .then((scheduling) => reply.send(scheduling))
      .catch((error) => reply.code(500).send(error))
  })

  app.get<{
    Reply: Scheduling[]
  }>("/scheduling", (_, reply) => {
    list()
      .then((schedulings) => reply.send(schedulings))
      .catch((error) => reply.code(500).send(error))
  })
}
