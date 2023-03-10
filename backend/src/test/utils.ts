import type { PrismaClient } from "@prisma/client"

export async function clearDatabase(prismaInstance: PrismaClient) {
  const tablenames = await prismaInstance.$queryRaw<
    Array<{ tablename: string }>
  >`SELECT tablename FROM pg_tables WHERE schemaname='main'`

  const tables = tablenames
    .map(({ tablename }) => tablename)
    .filter((name) => name !== "_prisma_migrations")
    .map((name) => `"main"."${name}"`)
    .join(", ")

  try {
    await prismaInstance.$executeRawUnsafe(`TRUNCATE TABLE ${tables} CASCADE;`)
  } catch (error) {
    console.log({ error })
  }
}
