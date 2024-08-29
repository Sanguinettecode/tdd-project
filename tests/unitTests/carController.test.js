const { expect } = require('chai')
const {describe, it} = require('mocha')
const {createSandbox} = require('sinon')
const CarController = require('../../src/controllers/carController')
const Transaction = require('../../src/entities/Transaction')
describe('carController suite test', () => {
    const sandbox = createSandbox()
    const numberOfDays = 5
    let carService = {}
    let carController = {}
    let mocks = {
        customer: require('../mocks/validCustomer.json'),
        carCategory: require('../mocks/validCategory.json'),
        car: require('../mocks/validCar.json')
    }
    const carCategory = mocks.carCategory
    const customer = mocks.customer
    const car = mocks.car
    before(() => {
        carService = {
            rent: sandbox.stub(),
            getAvailableCar: sandbox.stub(),
            calculatePrice: sandbox.stub()
        }
        carController = new CarController(carService)
    })
    it('should carService have be called with correct arguments', async () => {
        await carController.rentCar({user: customer, carCategory, numberOfDays})
        expect(carService.rent.calledWithExactly(customer, carCategory, numberOfDays)).to.be.ok
        expect(carService.rent.calledOnce).to.be.ok

    })

    it('should carService returns a Transaction instance with correct values', async () => {
        carService.rent.resolves(new Transaction(
            {
                customer,
                car,
                amount: 'R$ 206.80',
                dueDate: '10 de novembro de 2024'
            }
        ))

        const result = await carController.rentCar({user: customer, carCategory, numberOfDays})

        expect(result).to.be.deep.equal(new Transaction(
            {
                customer,
                car,
                amount: 'R$ 206.80',
                dueDate: '10 de novembro de 2024'
            }
        ))
        
    })

    it('should return a error if carService returns an error', () => {
        carService.rent.rejects(new Error('Um erro aconteceu'))

        return carController.rentCar({user: customer, carCategory, numberOfDays})
           .catch(error => expect(error.message).to.be.equal('Um erro aconteceu'))
    })

    describe('getAvailavailableCar suite tests', () => {
        it('should getAvailavailableCar method have be called with correct params', async () => {
            const carCategory = mocks.carCategory
            await carController.getAvailableCar({carCategory})

            expect(carService.getAvailableCar.calledOnce).to.be.ok
            expect(carService.getAvailableCar.calledWithExactly(carCategory)).to.be.ok
        })

        it('should carService getAvailableCar returns corret car', async () => {
            const car = mocks.car
            carService.getAvailableCar.resolves(car)
            const result = await carController.getAvailableCar({carCategory})
            expect(result).to.be.deep.equal(car)
        })

        it('should return a error if carService returns an error', async () => {
            carService.getAvailableCar.rejects(new Error('deu ruim'))
            return carController.getAvailableCar({carCategory})
            .catch(error => expect(error.message).to.be.equal('deu ruim'))
        })
    })

    describe('get total price controller suite test', () => {

        it('should carService calculatePrice service have been called with correct params', async () => {
            const customer = Object.create(mocks.customer)
            customer.age = 55
            const carCategory = {
                ...mocks.carCategory,
                price: '1127.59',
                carId: ['19efc8c4-e933-46e1-8641-b47cc018f4a5']
            }
            const numberOfDays = 5

            await carController.calculatePrice({customer, carCategory, numberOfDays})

            expect(carService.calculatePrice.calledOnce).to.be.ok
            expect(carService.calculatePrice.calledWithExactly(customer, carCategory, numberOfDays)).to.be.ok
        })

        it('should carService calculatePrice service have been called with correct params', async () => {
            carService.calculatePrice.resolves(Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL'}).format(7329.34))
            const customer = Object.create(mocks.customer)
            customer.age = 55
            const carCategory = {
                ...mocks.carCategory,
                price: '1127.59',
                carId: ['19efc8c4-e933-46e1-8641-b47cc018f4a5']
            }
            const numberOfDays = 5

            const response = await carController.calculatePrice({customer, carCategory, numberOfDays})

            const value = (carCategory.price * 1.3) * numberOfDays 
            const expected = Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL'}).format(value)

            expect(response).to.be.equal(expected)
        })
    })


})