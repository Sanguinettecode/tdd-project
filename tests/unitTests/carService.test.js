const {describe, it, before, beforeEach, afterEach} = require('mocha')
const {expect} = require('chai')
const sinon = require('sinon')
const CarService =  require('../../src/services/carService')
const {join} = require('path')
const carsDatabase = join(__dirname, './../../database', 'cars.json' ) 
const mocks = {
    validCar : require('../mocks/validCar.json'),
    validCategory : require('../mocks/validCategory.json'),
    validCustomer : require('../mocks/validCustomer.json')
}
const Transaction = require('../../src/entities/Transaction')
describe('carService suite test', () => {
    let carService = {}
    let baseRepository
    let sandbox
    before(() => {
        carService = new CarService({cars: carsDatabase})
    })
    beforeEach(() => {
        sandbox = sinon.createSandbox()
    })

    afterEach(() => {
        sandbox.restore()
    })
    it('shuold retrive a random position from an array', () => {
        const data = [0, 1, 2, 3, 4]
        const result = carService.getRandomPositionFromArray(data)

        expect(result).to.be.lte(data.length).to.be.gte(0)
    })

    it('should choose the first id from carIds in carCategory', async() => {
        
        const carCategory = mocks.validCategory
        const carIndex = 0
        
        sandbox.stub(
            carService,
            carService.getRandomPositionFromArray.name
        ).returns(carIndex)

        const result = await carService.chooseRandomCar(carCategory)
        const expected = carCategory.carId[carIndex]

        expect(carService.getRandomPositionFromArray.calledOnce).to.be.ok
        expect(result).to.be.equal(expected)
    })

    it('given a category should return a available car', async () => {
        const car = mocks.validCar
        const category = Object.create(mocks.validCategory)
        category.carId = [car.id]

        sandbox.stub(
            carService.carRepository,
            carService.carRepository.find.name
        ).returns(car)

        sandbox.spy(
            carService,
            carService.chooseRandomCar.name
        )

        const result = await carService.getAvailableCar(category)
        const expected = car

        expect(carService.chooseRandomCar.calledOnce).to.be.ok
        expect(carService.carRepository.find.calledWithExactly(car.id)).to.be.ok
        expect(result).to.be.deep.equal(expected)
    })

    it('should return rent prince with tax applied when customer rent a car',  () => {
        const numberOfDays =  5
        const customer = Object.create(mocks.validCustomer)
        customer.age = 50
        const category = {
            ...mocks.validCategory,
            price: 37.6
        }

        sandbox.stub(
            carService,
            'taxesBasedOnAge'
        ).get(() => [{from: 40, to: 50, then: 1.3}])

        const value = (category.price * 1.3) * numberOfDays 
        const expected = Intl.NumberFormat('pt-br', {style: 'currency', currency: 'BRL'}).format(value)
        
        
        const result = carService.calculatePrice(customer, category, numberOfDays)
        
        
        expect(result).to.be.deep.equal(expected)
        
    })

    it('should return a transaction from rent to customer', async () => {
        const customer = Object.create(mocks.validCustomer)
        customer.age = 21
        const car = mocks.validCar
        const category = {
            ...mocks.validCategory,
            price: 37.6,
            carId: [car.id]
        }
        const numberOfDays = 5
        const dueDate = '10 de novembro de 2024'

        const now = new Date(2024, 10, 5)
        sandbox.useFakeTimers(now.getTime())
        sandbox.stub(
            carService.carRepository,
            carService.carRepository.find.name
        ).returns(car)

        const expectedAmount = carService.currencyFormatter.format(206.8)
        const result = await carService.rent(customer, category, numberOfDays)
        const exprected = new Transaction({
            customer, 
            car, 
            amount:expectedAmount, 
            dueDate
        })

        expect(result).to.be.deep.equal(exprected)
    })

    
})