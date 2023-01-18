import fp from 'fastify-plugin'

export default fp(async function (app, options) {
  app.decorate('greeting', async () => 'world')

  app.addHook('onClose', async () => {
    console.log('stopping shared')
  })
})
