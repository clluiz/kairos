import esMain from 'es-main'
import fastify from 'fastify'
import closeWithGrace from 'close-with-grace'
import autoload from '@fastify/autoload'
import { join } from 'desm'
import { KairosInstance } from './types/kairos'
import { CloseWithGraceCallbackOptions } from './types/closeWithGraceCallBackOptins'
 
export async function create (options: any) : Promise<KairosInstance> {
  const app = fastify()
  app.register(autoload, {
    dir: join(import.meta.url, './plugins'),
    options,
    ignoreFilter: options.ignoreFilter,
  })
  app.register(autoload, {
    dir: join(import.meta.url, './routes'),
    options
  })
  return app as unknown as KairosInstance
}

if (esMain(import.meta)) {
  const app = await create({})

  await app.listen({ port: 3000 })

  closeWithGrace({ delay: 500 }, async function ({ err }: CloseWithGraceCallbackOptions) {
    if (err) {
      console.error(err)
    }
    await app.close()
  })
}
