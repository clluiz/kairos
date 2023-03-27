import type { FastifyReply, FastifyRequest } from "fastify"

export async function notifyViaWhatsapp(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  // if(reply.statusCode === 200) {
  //     console.log("enviando notificações")
  //     console.log(request.body)
  // }
  //throw new Error("Not implemented.")
}
