import { expect, test, afterEach, describe } from 'vitest'
import { main } from '../../main'

describe('scheduling', async () => {
  let app
  afterEach(async () => {
    await app.close()
  })

  test('should list all schedulings', async () => {
    app = await main({})
    const response = await app.inject({
      method: 'GET',
      url: '/scheduling',
    })
  
    expect(response.statusCode).toBe(200)
    expect(response.json()).toEqual([])
  })
})



