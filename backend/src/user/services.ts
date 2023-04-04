import prisma from "../prisma/client"

const TAMANHO_MINIMO_SENHA: number = 8
const PADRAO_SENHA: RegExp =
  /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).+$/

function hasSubstring(target: string, substringToCheck: string): boolean {
  if (!target || !substringToCheck) return false

  let result = []
  for (let i = 0; i < target.length - 2; i++) {
    let substring = target.slice(i, i + 3)
    if (substringToCheck.includes(substring)) {
      result.push(substring)
    }
  }
  return result.length > 0
}

function isPasswordValid(password: string, username: string): boolean {
  if (!password) return false

  return (
    password.length >= TAMANHO_MINIMO_SENHA &&
    PADRAO_SENHA.test(password) &&
    !hasSubstring(password, username)
  )
}

export async function create(login: string, password: string) {
  if (!isPasswordValid(password, login))
    throw new Error(
      "Sua senha deve ter menos 8 letras, pelo menos uma letra maiuscula, uma letra minúscula, um número e um caracter especial e não deve conter partes do login"
    )

  const existingUser = await prisma.user.findFirst({
    where: {
      login,
    },
  })

  if (existingUser != null) {
    throw new Error("O login fornecido não está disponível")
  }

  return await prisma.user.create({
    data: {
      login,
      password,
    },
  })
}
