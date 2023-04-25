import esMain from "es-main"
import fastify from "fastify"
import closeWithGrace from "close-with-grace"
import autoload from "@fastify/autoload"
import sensible from "@fastify/sensible"
import { join } from "desm"
import type { KairosInstance } from "./types/kairos.js"
import type { CloseWithGraceCallbackOptions } from "./types/closeWithGraceCallBackOptions.js"
import path from "path"

let remixFastifyPlugin: any

export async function create(): Promise<KairosInstance> {
  const app = fastify()

  app.register(autoload, {
    dir: join(import.meta.url, "./routes"),
    options: {
      prefix: "/api",
    },
  })

  if (process.env.MODE !== "test") {
    remixFastifyPlugin = await import("@mcansh/remix-fastify").then(
      (module) => module.remixFastifyPlugin
    )
    app.register(remixFastifyPlugin, {
      build: path.join(process.cwd(), "../webapp/build/index.js"),
      purgeRequireCacheInDevelopment: false,
      unstable_earlyHints: true,
    })
  }

  app.register(sensible)
  return app as unknown as KairosInstance
}

if (esMain(import.meta)) {
  const app = await create()

  await app.listen({ port: process.env.PORT })

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
