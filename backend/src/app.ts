import esMain from "es-main"
import fastify from "fastify"
import closeWithGrace from "close-with-grace"
import autoload from "@fastify/autoload"
import sensible from "@fastify/sensible"
import { join } from "desm"
import type { KairosInstance } from "./types/kairos"
import type { CloseWithGraceCallbackOptions } from "./types/closeWithGraceCallBackOptions"
import path from "path"

export async function create(): Promise<KairosInstance> {
  const app = fastify()

  // app.register(autoload, {
  //   dir: join(import.meta.url, "./plugins"),
  //   options,
  //   ignoreFilter: options.ignoreFilter,
  // })

  app.register(autoload, {
    dir: join(import.meta.url, "./routes"),
    options: {
      prefix: "/api",
    },
  })

  app.register(sensible)
  return app as unknown as KairosInstance
}

if (esMain(import.meta)) {
  const app = await create()

  await app.listen({ port: 1986 })

  closeWithGrace(
    { delay: 500 },
    async function ({ err }: CloseWithGraceCallbackOptions) {
      if (err) {
        console.error(err)
      }
      await app.close()
    }
  )
}
