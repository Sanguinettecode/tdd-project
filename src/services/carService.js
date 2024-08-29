const BaseRepository = require('../repositpries/base/baseRepository')
const Tax = require('../entities/Tax')
const Transaction = require('../entities/Transaction')
class CarService {
    constructor({cars}) {
        this.carRepository = new BaseRepository({file: cars})
        this.taxesBasedOnAge = Tax.taxesBasedOnAge
        this.currencyFormatter = Intl.NumberFormat('pt-br', {style: 'currency', currency: 'BRL'})
    }

    getRandomPositionFromArray(list) {
        const length =list.length
        return Math.floor(Math.random() * length)
    }

    chooseRandomCar (carCategory) {
        const randomCarIndex = this.getRandomPositionFromArray(carCategory.carId)
        const carId = carCategory.carId[randomCarIndex]
        return carId
    }

    async getAvailableCar(carCategory) {
        const carId = this.chooseRandomCar(carCategory)
        const car = await this.carRepository.find(carId)
        return car
    }

    calculatePrice (customer, category, numberOfDays) {
        const {age} = customer
        const {price} =  category
        const {then: tax} = this.taxesBasedOnAge.find(tax => age >= tax.from && age <= tax.to)

        const totalValue = this.currencyFormatter.format(
            (price * tax) * numberOfDays
        )

        return totalValue
    }

    async rent(customer, carCategory, numberOfDays) {
        const car = await this.getAvailableCar(carCategory)
        const totalAmount = this.calculatePrice(customer, carCategory, numberOfDays)
        
        const today = new Date()
        today.setDate(today.getDate() + numberOfDays)
        const options = {year: "numeric", month: "long", day: "numeric"}
        const dueDate = today.toLocaleDateString("pt-BR", options)

        const transaction = new Transaction({
            customer,
            car,
            amount: totalAmount,
            dueDate
        })

        return transaction
    }
}

module.exports = CarService