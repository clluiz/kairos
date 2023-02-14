import { KairosInstance } from "../types/kairos"

export default async function(app : KairosInstance) {
  app.get('/scheduling', async () => {
    return app.services.scheduling.list()
  })

  app.post('/scheduling', async () => {
    return {}
  })
}
