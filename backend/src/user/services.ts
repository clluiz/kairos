import prisma from "../prisma/client"

const TAMANHO_MINIMO_SENHA: number = 8
const PADRAO_SENHA: RegExp =
  /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).+$/

function isPasswordValid(password: string): boolean {
  if (!password) return false

  return password.length >= TAMANHO_MINIMO_SENHA && PADRAO_SENHA.test(password)
}

export async function create(login: string, password: string) {
  if (!isPasswordValid(password))
    throw new Error(
      "Verifique se sua senha tem pelo menos 8 letras, pelo menos uma letra maiuscula, uma letra minúscula, um número e um caracter especial"
    )

  if (
    (await prisma.user.findFirst({
      where: {
        login,
      },
    })) != null
  ) {
    throw new Error("O login fornecido não está disponível")
  }

  return await prisma.user.create({
    data: {
      login,
      password,
    },
  })
}
