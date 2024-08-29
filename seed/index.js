const {faker} = require('@faker-js/faker')

const Car = require('../src/entities/Car')
const CarCategory = require('../src/entities/CarCategory')
const Customer = require('../src/entities/Customer')
const {join} = require('path')
const seederFolder = join(__dirname, '..', 'database')
const {writeFile} = require('fs/promises')
const ITEMS_AMOUNT = 2

const carCategory = new CarCategory({
    id: faker.string.uuid(),
    name: faker.vehicle.type(),
    carId: [],
    price: faker.finance.amount({min: 1000, max: 5000}),
})
const cars = []
const customers = []
for(let i = 0; i <= ITEMS_AMOUNT; i++) {
    const car = new Car({
        id: faker.string.uuid(),
        releaseYear: faker.date.past().getFullYear(),
        availabe: true,
        name: faker.vehicle.model(),
        gasAvailable: true
    })
    carCategory.carId.push(car.id)
    cars.push(car)

    const customer = new Customer({
        id: faker.string.uuid(),
        name: faker.person.firstName(),
        age: faker.helpers.rangeToNumber({min: 18, max: 55})
    })

    customers.push(customer)
}

const write = (filename, data) => writeFile(join(seederFolder, filename), JSON.stringify(data) )
;(async () => {
    await write('cars.json', cars)
    await write('customers.json', customers)
    await write('carCategory.json', [carCategory])

})()