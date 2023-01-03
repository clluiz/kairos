import esMain from 'es-main'
import fastify from 'fastify'
import closeWithGrace, { Signals } from 'close-with-grace'
import autoload from '@fastify/autoload'
import { join } from 'desm'

interface CloseWithGraceCallbackOptions {
  err?: Error,
  signal?: Signals,
  manual?: boolean,
}

export async function main (options: any) {
  const app = fastify()
  app.register(autoload, {
    dir: join(import.meta.url, './plugins'),
    options
  })
  app.register(autoload, {
    dir: join(import.meta.url, './routes'),
    options
  })
  return app
}

if (esMain(import.meta)) {
  const app = await main({})

  await app.listen({ port: 3000 })

  closeWithGrace({ delay: 500 }, async function ({ err }:CloseWithGraceCallbackOptions) {
    if (err) {
      console.error(err)
    }
    await app.close()
  })
}
