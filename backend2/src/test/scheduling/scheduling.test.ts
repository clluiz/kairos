import { expect, test, afterEach, describe, vi } from 'vitest'
import { create } from '../../app'

vi.mock("../plugins/prisma.ts")

describe('scheduling', async () => {
  let app
  afterEach(async () => {
    await app.close()
  })

  test('should list all schedulings', async () => {
    app = await create({})
    const response = await app.inject({
      method: 'GET',
      url: '/scheduling',
    })
  
    expect(response.statusCode).toBe(200)
    expect(response.json()).toEqual([])
  })
})



