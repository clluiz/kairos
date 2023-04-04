import { expect, test, beforeEach, describe, afterAll } from "vitest"
import { create } from "@/app"
import { KairosInstance } from "@/types/kairos"
import { clearDatabase } from "@/test/utils"

let app: KairosInstance

beforeEach(async () => {
  if (app) await clearDatabase(app.prisma)
})

afterAll(async () => {
  if (app) {
    await clearDatabase(app.prisma)
    await app.close()
  }
})

describe.skip("main", () => {
  test("hello world", async () => {
    app = await create({})

    const response = await app.inject({
      method: "GET",
      url: "/",
    })

    expect(response.statusCode).toBe(200)
    expect(response.json()).toEqual({ hello: "world" })
  })

  test("scheduling list", async () => {
    app = await create({})
    const response = await app.inject({
      method: "GET",
      url: "/scheduling",
    })

    expect(response.statusCode).toBe(200)
    expect(response.json()).toEqual([])
  })
})
