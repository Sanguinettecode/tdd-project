const { expect } = require('chai')
const sinon = require('sinon');
const { describe, it, before, after} = require('mocha')
const supertest = require('supertest')
const Transaction = require('../../src/entities/Transaction')
const SERVER_TEST_PORT = 5000
const mocks = {
    car: require('../mocks/validCar.json'),
    customer: require('../mocks/validCustomer.json'),
    carCategory: require('../mocks/validCategory.json')
}
describe('E2E Rent Car API suite test', () => {
    let app = {}
    let sendbox = {}

    beforeEach(() => {
        sendbox = sinon.createSandbox()
    })
    afterEach(() => sendbox.restore())

    before(() => {
        const now = new Date(2024, 7, 29)
        sinon.useFakeTimers(now.getTime())

        const api = require('../../api')
        const MakeCarController = require('../../src/factories/makeCarController')
        const instance = api(MakeCarController)

        app = {
            instance,
            server: instance.initialize(SERVER_TEST_PORT)
        }

    })
    describe('/rent:post', () => {
        
        
        const customer = {
            ...mocks.customer,
            age: 55
        }
        const carCategory = {
            ... mocks.carCategory,
            price: "1127.59",
            carId: ['19efc8c4-e933-46e1-8641-b47cc018f4a5']
        }
        
        it('should request the rent car API and return a valid transaction', async () => {
            const numberOfDays = 5
            const response = await supertest(app.server).post('/rent')
            .send({customer, carCategory, numberOfDays })
            .expect(200)

            
            const expected = new Transaction({
                customer: {"id":"723c023f-cc71-4401-857a-d05fac5015f4","name":"Augustus","age":55},
                car: {"id":"19efc8c4-e933-46e1-8641-b47cc018f4a5","name":"Jetta","releaseYear":2024,"availabe":true,"gasAvailable":true},
                amount: Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL'}).format(7329.34),
                dueDate: "3 de setembro de 2024"
            })
            expect(response.body.result).to.be.deep.equal(expected)
    })
        
    })
    describe('/getavailablecar:post', () => {
        it('should requeste the available car api and return a valid car object', async () => {
            const carCategory = Object.create(mocks.carCategory)
            carCategory.carId = ['9a2d01c9-a889-4736-b181-e752558d44d1']
            
            const result = await supertest(app.server).post('/getavailablecar')
            .send({carCategory}).expect(200)

            const expected = mocks.car

            expect(result.body.result).to.be.deep.equal(expected)
        })
    })

    describe('/calculateprice:post', () => {
        it('should requeste the calculate price api and return a valid car value', async () => {
            const customer = Object.create(mocks.customer)
            customer.age = 55
            const carCategory = {
                ...mocks.carCategory,
                price: '1127.59',
                carId: ['19efc8c4-e933-46e1-8641-b47cc018f4a5']
            }
            const numberOfDays = 5
            
            const result = await supertest(app.server).post('/calculateprice')
            .send({customer, carCategory, numberOfDays}).expect(200)

            const expected = Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL'}).format(7329.34)

            expect(result.body.result).to.be.deep.equal(expected)
        })
    })
})