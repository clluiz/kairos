import { expect, test, afterEach, describe, vi } from "vitest"
import { create } from "../../app"
import prisma from "../../prisma/client"
import { clearDatabase } from "../utils"
import { faker } from "@faker-js/faker"
import fakerBR from "faker-br"
import {
  Address,
  Customer,
  DayOfWeek,
  Place,
  Professional,
  Tenant,
  User,
} from "@prisma/client"

//import prismaMock from '../../prisma/__mocks__/client'

//vi.mock('../../prisma/client')

// Testes que devem ser feitos:
// Não cadastrar mais de 1 agendamento para o mesmo cliente em horários sobrepostos : DONE
// Não cadastrar mais de 1 agendamento para o mesmo profissional em horários sobrepostos : DONE
// Não cadastrar mais de 1 agendamento para o mesmo lugar em horários sobrepostos : DONE
// Testar fim e inicio de agendamento em sequencia
// Cancelar agendamento

async function createProfessionalForTenant(
  tenandId: number
): Promise<Professional> {
  const user = await prisma.user.create({
    data: {
      login: faker.random.alpha({ count: 10 }),
      password: faker.random.alphaNumeric(20),
    },
  })

  const professional = await prisma.professional.create({
    data: {
      name: faker.name.fullName(),
      phone: faker.phone.number("## #####-####"),
      userId: user.id,
      tenantId: tenandId,
    },
  })

  return professional
}

async function createCustomer(): Promise<Customer> {
  const user = await prisma.user.create({
    data: {
      login: faker.random.alpha({ count: 10 }),
      password: faker.random.alphaNumeric(20),
    },
  })

  const customer = await prisma.customer.create({
    data: {
      name: faker.name.fullName(),
      phone: faker.phone.number("## #####-####"),
      userId: user.id,
      cpf: fakerBR.br.cpf(),
    },
  })

  return customer
}

describe("scheduling", async () => {
  let app
  afterEach(async () => {
    if (app) await app.close()
    await clearDatabase(prisma)
  })

  test("it should not create a new scheduling for the same customer with interposed times", async () => {
    const tenant1: Tenant = await prisma.tenant.create({
      data: {
        name: faker.company.name(),
      },
    })

    const tenant2: Tenant = await prisma.tenant.create({
      data: {
        name: faker.company.name(),
      },
    })

    const customer: Customer = await createCustomer()
    const professional1: Professional = await createProfessionalForTenant(
      tenant1.id
    )
    const professional2: Professional = await createProfessionalForTenant(
      tenant2.id
    )

    const address1: Address = await prisma.address.create({
      data: {
        public_area: faker.address.street(),
        number: faker.address.buildingNumber(),
        city: faker.address.cityName(),
        state: faker.address.stateAbbr(),
        country: faker.address.country(),
        zipCode: faker.address.zipCode(),
      },
    })

    const address2: Address = await prisma.address.create({
      data: {
        public_area: faker.address.street(),
        number: faker.address.buildingNumber(),
        city: faker.address.cityName(),
        state: faker.address.stateAbbr(),
        country: faker.address.country(),
        zipCode: faker.address.zipCode(),
      },
    })

    const place1: Place = await prisma.place.create({
      data: {
        tenantId: tenant1.id,
        addressId: address1.id,
      },
    })

    const place2: Place = await prisma.place.create({
      data: {
        tenantId: tenant2.id,
        addressId: address2.id,
      },
    })

    const startTime: Date = new Date()
    startTime.setHours(8, 0)

    const endTime: Date = new Date()
    endTime.setHours(18, 0)

    await prisma.professionalAvailability.createMany({
      data: [
        {
          day: DayOfWeek.MONDAY,
          startTime: startTime,
          endTime: endTime,
          professionalId: professional1.id,
          placeId: place1.id,
        },
        {
          day: DayOfWeek.MONDAY,
          startTime: startTime,
          endTime: endTime,
          professionalId: professional2.id,
          placeId: place2.id,
        },
      ],
    })

    await prisma.scheduling.create({
      data: {
        startTime: new Date(2023, 1, 24, 9, 0),
        endTime: new Date(2023, 1, 24, 10, 0),
        professionalId: professional1.id,
        customerId: customer.id,
        placeId: place1.id,
        description: "Consulta 1",
      },
    })

    app = await create({})

    const response = await app.inject({
      method: "POST",
      url: "/scheduling",
      payload: {
        startTime: new Date(2023, 1, 24, 9, 0),
        endTime: new Date(2023, 1, 24, 10, 30),
        description: "Consulta no mesmo horário com outro profissional",
        placeId: place2.id,
        professionalId: professional2.id,
        customerId: customer.id,
      },
    })

    expect(response.statusCode).toBe(409)
    expect(response.json().message).toBe(
      "Já existe um agendamento marcado para este horário com esse cliente"
    )
  })

  test("it should not create a new scheduling for the same professional with interposed times", async () => {
    const tenant: Tenant = await prisma.tenant.create({
      data: {
        name: faker.company.name(),
      },
    })

    const professional: Professional = await createProfessionalForTenant(
      tenant.id
    )

    const address: Address = await prisma.address.create({
      data: {
        public_area: faker.address.street(),
        number: faker.address.buildingNumber(),
        city: faker.address.cityName(),
        state: faker.address.stateAbbr(),
        country: faker.address.country(),
        zipCode: faker.address.zipCode(),
      },
    })

    const place: Place = await prisma.place.create({
      data: {
        tenantId: tenant.id,
        addressId: address.id,
      },
    })

    const startTime: Date = new Date()
    startTime.setHours(8, 0, 0, 0)

    const endTime: Date = new Date()
    endTime.setHours(18, 0, 0, 0)

    await prisma.professionalAvailability.createMany({
      data: [
        {
          day: DayOfWeek.MONDAY,
          startTime: startTime,
          endTime: endTime,
          professionalId: professional.id,
          placeId: place.id,
        },
        {
          day: DayOfWeek.TUESDAY,
          startTime: startTime,
          endTime: endTime,
          professionalId: professional.id,
          placeId: place.id,
        },
        {
          day: DayOfWeek.WEDNESDAY,
          startTime: startTime,
          endTime: endTime,
          professionalId: professional.id,
          placeId: place.id,
        },
        {
          day: DayOfWeek.THURSDAY,
          startTime: startTime,
          endTime: endTime,
          professionalId: professional.id,
          placeId: place.id,
        },
        {
          day: DayOfWeek.FRYDAY,
          startTime: startTime,
          endTime: endTime,
          professionalId: professional.id,
          placeId: place.id,
        },
        {
          day: DayOfWeek.SATURDAY,
          startTime: startTime,
          endTime: endTime,
          professionalId: professional.id,
          placeId: place.id,
        },
      ],
    })

    const customer1: Customer = await createCustomer()
    const customer2: Customer = await createCustomer()

    await prisma.scheduling.create({
      data: {
        startTime: new Date(2023, 2, 1, 13, 0),
        endTime: new Date(2023, 2, 1, 15, 30),
        professionalId: professional.id,
        placeId: place.id,
        description: "Consulta 1",
        customerId: customer1.id,
      },
    })

    app = await create({})

    const response = await app.inject({
      method: "POST",
      url: "/scheduling",
      payload: {
        startTime: new Date(2023, 2, 1, 9, 0),
        endTime: new Date(2023, 2, 1, 13, 30),
        description: "Consulta no mesmo horário com o mesmo profissional",
        placeId: place.id,
        professionalId: professional.id,
        customerId: customer2.id,
      },
    })

    expect(response.statusCode).toBe(409)
    expect(response.json().message).toBe(
      "Já existe um agendamento marcado para este horário com esse profissional"
    )
  })

  test("it should not create a new scheduling for the same place with interposed times", async () => {
    const tenant: Tenant = await prisma.tenant.create({
      data: {
        name: faker.company.name(),
      },
    })

    const professional: Professional = await createProfessionalForTenant(
      tenant.id
    )
    const professional2: Professional = await createProfessionalForTenant(
      tenant.id
    )

    const address: Address = await prisma.address.create({
      data: {
        public_area: faker.address.street(),
        number: faker.address.buildingNumber(),
        city: faker.address.cityName(),
        state: faker.address.stateAbbr(),
        country: faker.address.country(),
        zipCode: faker.address.zipCode(),
      },
    })

    const place: Place = await prisma.place.create({
      data: {
        tenantId: tenant.id,
        addressId: address.id,
      },
    })

    const startTime: Date = new Date()
    startTime.setHours(8, 0)

    const endTime: Date = new Date()
    endTime.setHours(18, 0)

    await prisma.professionalAvailability.createMany({
      data: [
        {
          day: DayOfWeek.MONDAY,
          startTime: startTime,
          endTime: endTime,
          professionalId: professional.id,
          placeId: place.id,
        },
        {
          day: DayOfWeek.MONDAY,
          startTime: startTime,
          endTime: endTime,
          professionalId: professional2.id,
          placeId: place.id,
        },
      ],
    })

    const customer1: Customer = await createCustomer()
    const customer2: Customer = await createCustomer()

    await prisma.scheduling.create({
      data: {
        startTime: new Date(2023, 2, 24, 13, 0),
        endTime: new Date(2023, 2, 24, 15, 30),
        professionalId: professional.id,
        placeId: place.id,
        description: "Consulta 1",
        customerId: customer1.id,
      },
    })

    app = await create({})

    const response = await app.inject({
      method: "POST",
      url: "/scheduling",
      payload: {
        startTime: new Date(2023, 2, 24, 9, 0),
        endTime: new Date(2023, 2, 24, 13, 30),
        description: "Consulta no mesmo horário com o mesmo profissional",
        placeId: place.id,
        professionalId: professional2.id,
        customerId: customer2.id,
      },
    })

    expect(response.statusCode).toBe(409)
    expect(response.json().message).toBe(
      "Já existe um agendamento marcado para este horário com neste local"
    )
  })

  test("it should not create a scheduling when a professional is not available for a place", async () => {
    const tenant: Tenant = await prisma.tenant.create({
      data: {
        name: faker.company.name(),
      },
    })

    const professional: Professional = await createProfessionalForTenant(
      tenant.id
    )

    const address: Address = await prisma.address.create({
      data: {
        public_area: faker.address.street(),
        number: faker.address.buildingNumber(),
        city: faker.address.cityName(),
        state: faker.address.stateAbbr(),
        country: faker.address.country(),
        zipCode: faker.address.zipCode(),
      },
    })

    const place: Place = await prisma.place.create({
      data: {
        tenantId: tenant.id,
        addressId: address.id,
      },
    })

    const customer: Customer = await createCustomer()

    const startTime: Date = new Date()
    startTime.setHours(8, 0)

    const endTime: Date = new Date()
    endTime.setHours(18, 0)

    await prisma.professionalAvailability.createMany({
      data: [
        {
          day: DayOfWeek.MONDAY,
          startTime: startTime,
          endTime: endTime,
          professionalId: professional.id,
          placeId: place.id,
        },
      ],
    })

    app = await create({})

    const response = await app.inject({
      method: "POST",
      url: "/scheduling",
      payload: {
        startTime: new Date(2023, 2, 7, 9, 0),
        endTime: new Date(2023, 2, 7, 13, 30),
        description: "Consulta no mesmo horário com o mesmo profissional",
        placeId: place.id,
        professionalId: professional.id,
        customerId: customer.id,
      },
    })

    expect(response.statusCode).toBe(409)
    expect(response.json().message).toBe(
      "O profissional escolhido não está disponível para esse horário ou lugar"
    )
  })

  // test.skip('it should not create a scheduling when a place is not available', async () => {

  // })
})
