import { expect, test, afterEach, describe, vi } from 'vitest'
import { create } from '../../app'
import prisma from '../../prisma/client'
import { clearDatabase } from '../utils'
import { faker } from '@faker-js/faker'
import fakerBR from 'faker-br'
import { Address, Customer, DayOfWeek, Place, Professional, Tenant, User } from '@prisma/client'

import prismaMock from '../../prisma/__mocks__/client'

vi.mock('../../prisma/__mocks__/client')

// Testes que devem ser feitos:
// Retornar erro ao tentar fazer um agendamento em horários que interseccionam o horário de outro agendamento
// Retornar erro ao tentar fazer um agendamento com um profissional que não está disponível para o lugar
// Retornar erro ao tentar fazer um agendamento com um profissional que não está disponível no horário
// Cancelar agendamento

describe('scheduling', async () => {
  let app
  afterEach(async () => {
    if(app)
      await app.close()
    await clearDatabase(prisma)
  })

  test('it should not exists two schedulings with interposed times for the same place and professional', async () => {
    app = await create({})

    const tenants = prismaMock.tenant.findFirst.mockResolvedValue(
      {
        id: 1,
        name: 'Test',
        logo: 'asda'
      }
    )

    expect(tenants[0].name).toBe('Test')

    // // setup scenario
    // // create tenant, professional, customer, address, place and professional availability

    // const tenant : Tenant = await prisma.tenant.create({
    //   data: {
    //     name: faker.company.name()
    //   }
    // })
    
    // const userForCustomer : User = await prisma.user.create({
    //   data: {
    //     login: faker.random.alpha({ count: 10 }),
    //     password: faker.random.alphaNumeric(20),
    //   }
    // })

    // const firstCustomer : Customer = await prisma.customer.create({
    //   data: {
    //     name: faker.name.fullName(),
    //     phone: faker.phone.number('## #####-####'),
    //     userId: userForCustomer.id,
    //     cpf: fakerBR.br.cpf()
    //   }
    // })

    // const userForProfessional : User = await prisma.user.create({
    //   data: {
    //     login: faker.random.alpha({ count: 10 }),
    //     password: faker.random.alphaNumeric(20),
    //   }
    // })    

    // const professional : Professional = await prisma.professional.create({
    //   data: {
    //     name: faker.name.fullName(),
    //     phone: faker.phone.number('## #####-####'),
    //     userId: userForProfessional.id,
    //     tenantId: tenant.id,
    //   }
    // })

    // const address : Address = await prisma.address.create({
    //   data: {
    //     public_area: faker.address.street(),
    //     number: faker.address.buildingNumber(),
    //     city: faker.address.cityName(),
    //     state: faker.address.stateAbbr(),
    //     country: faker.address.country(),
    //     zipCode: faker.address.zipCode(),
    //   }
    // })

    // const place : Place = await prisma.place.create({
    //   data: {
    //     tenantId: tenant.id,
    //     addressId: address.id
    //   }
    // })

    // const startTime : Date = new Date()
    // startTime.setHours(8,0)

    // const endTime : Date = new Date()
    // endTime.setHours(18,0)

    // await prisma.professionalAvailability.createMany({
    //   data: [{
    //     day: DayOfWeek.MONDAY,
    //     startTime: startTime,
    //     endTime: endTime,
    //     professionalId: professional.id,
    //     placeId: place.id
    //   }, {
    //     day: DayOfWeek.TUESDAY,
    //     startTime: startTime,
    //     endTime: endTime,
    //     professionalId: professional.id,
    //     placeId: place.id
    //   }, {
    //     day: DayOfWeek.WEDNESDAY,
    //     startTime: startTime,
    //     endTime: endTime,
    //     professionalId: professional.id,
    //     placeId: place.id
    //   }, {
    //     day: DayOfWeek.THURSDAY,
    //     startTime: startTime,
    //     endTime: endTime,
    //     professionalId: professional.id,
    //     placeId: place.id
    //   },{
    //     day: DayOfWeek.FRYDAY,
    //     startTime: startTime,
    //     endTime: endTime,
    //     professionalId: professional.id,
    //     placeId: place.id
    //   },{
    //     day: DayOfWeek.SATURDAY,
    //     startTime: startTime,
    //     endTime: endTime,
    //     professionalId: professional.id,
    //     placeId: place.id
    //   }, {
    //     day: DayOfWeek.SUNDAY,
    //     startTime: startTime,
    //     endTime: endTime,
    //     professionalId: professional.id,
    //     placeId: place.id
    //   }]
    // })

    // await prisma.scheduling.create({
    //   data: {
    //     startTime: new Date(24, 1, 2023, 9, 0),
    //     endTime: new Date(24, 1, 2023, 10, 0),
    //     professionalId: professional.id,
    //     customerId: firstCustomer.id,
    //     placeId: place.id,
    //     description: "Consulta 1",
    //   }
    // })

    // const customer2 : Customer = await prisma.customer.create({
    //   data: {
    //     name: faker.name.fullName(),
    //     phone: faker.phone.number('## #####-####'),
    //     userId: userForCustomer.id,
    //     cpf: fakerBR.br.cpf()
    //   }
    // })

    // const response = await app.inject({
    //   method: 'POST',
    //   url: '/scheduling',
    //   payload: {
    //     startTime: new Date(24, 1, 2023, 9, 0),
    //     endTime: new Date(24, 1, 2023, 10, 30),
    //     description: "Consulta",
    //     placeId: place.id,
    //     professionalId: professional.id,
    //     customerId: customer2.id,
    //   }
    // })

    // expect(response.statusCode).toBe(409)
    // expect(response.json().message).toBe("Já existe um agendamento marcado para este horário")
  })

  // test.skip('it should not exists two scheduling with interposed times for a customer', async () => {

  // })

  // test.skip('it should not exists two scheduling with interposed times for a professional', async () => {

  // })
  
  // test.skip('it should not exists two scheduling with interposed times for a place', async () => {

  // })  

  // test.skip('it should not create a scheduling when a professional is not available', async () => {

  // })

  // test.skip('it should not create a scheduling when a place is not available', async () => {
    
  // })

})



