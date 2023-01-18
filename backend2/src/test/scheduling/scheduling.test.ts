import { expect, test, afterEach, describe, vi } from 'vitest'
import { main } from '../../main'

vi.mock("../plugins/prisma.ts")

describe.skip('scheduling', async () => {
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



