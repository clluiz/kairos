import { expect, test, afterAll } from 'vitest'
import { main } from '../main'

let app
afterAll(async () => {
  await app.close()
})

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

