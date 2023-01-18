import { expect, test, beforeEach, describe, afterAll } from 'vitest'
import { main } from '../main'
import { KairosInstance } from '../kairosInstance'
import { clearDatabase } from './utils'

let app : KairosInstance

beforeEach(async () => {
  if(app)
    await clearDatabase(app.prisma)
})

afterAll(async () => {
  if(app)
    await clearDatabase(app.prisma)
  await app.close()
})

describe('main', () => {

  test('hello world', async () => {

    app = await main({})

    const response = await app.inject({
      method: 'GET',
      url: '/',
    })
  
    expect(response.statusCode).toBe(200)
    expect(response.json()).toEqual({ hello: 'world' })
  })
  
  test('scheduling list', async () => {
    app = await main({})
    const response = await app.inject({
      method: 'GET',
      url: '/scheduling',
    })
  
    expect(response.statusCode).toBe(200)
    expect(response.json()).toEqual([])
  })
})


