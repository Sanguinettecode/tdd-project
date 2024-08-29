const Transaction = require('../entities/Transaction')

class CarController {
    constructor(carService) {
        this.carService = carService
    }

    async rentCar(request) {
        const {user, carCategory, numberOfDays} = request
        console.log(process.env.NODE_ENV)
        const transaction = await this.carService.rent(user, carCategory, numberOfDays)
        if(!transaction instanceof Transaction) {
            throw new Error('Um erro aconteceu1')
        }        
        return transaction
    }

    async getAvailableCar(request) {
        const {carCategory} = request
        const availableCar =  await this.carService.getAvailableCar(carCategory)
        return availableCar
    }

    async calculatePrice(request) {
        const {customer, carCategory, numberOfDays} = request
        const totalPrice = await this.carService.calculatePrice(customer, carCategory, numberOfDays)
        return totalPrice
    }
}

module.exports = CarController