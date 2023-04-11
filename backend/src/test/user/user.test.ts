import { describe, expect, it, vi } from "vitest"

import { create } from "../../user/services"

import prismaMock from "../../prisma/__mocks__/client"
import { faker } from "@faker-js/faker"

vi.mock("../prisma/client")

//TODO:
// Testar validação dos critérios de senha
// Testar cadastro com usuário repetido

describe("user management", async () => {
  // afterEach(async () => {
  //     await clearDatabase(prisma)
  //   })

  it("should validate password rules", async () => {
    const login = "elon"
    const password = "123"

    await expect(() => create(login, password)).rejects.toThrowError(
      "Sua senha deve ter menos 8 letras, pelo menos uma letra maiuscula, uma letra minúscula, um número e um caracter especial e não deve conter partes do login"
    )
  })

  it("password should not have parts of the login", async () => {
    const login = "elon"
    const password = "@elonE123"

    await expect(() => create(login, password)).rejects.toThrowError(
      "Sua senha deve ter menos 8 letras, pelo menos uma letra maiuscula, uma letra minúscula, um número e um caracter especial e não deve conter partes do login"
    )
  })

  it.skip("shoud not allow two users with the same login", async () => {
    prismaMock.user.findFirst.mockResolvedValue({
      id: 1,
      login: "mussum",
      password: faker.random.alphaNumeric(8),
    })

    const login = "mussum"
    const password = "@B1ritsS"

    await expect(() => create(login, password)).rejects.toThrowError(
      "O login fornecido não está disponível"
    )
  })
})
