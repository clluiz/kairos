import { KairosInstance } from "../kairosInstance"

export default async function(app : KairosInstance) {
  app.get('/scheduling', async () => {
    return []
  })

  app.post('/scheduling', async () => {
    //app.services.scheduling.create();
  })
}
