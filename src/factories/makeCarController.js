const CarController = require("../controllers/carController");
const CarService = require("../services/carService");
const {join} = require('path')
const carsDatabase  =  join(__dirname, "..", "..", "database", "cars.json")

class MakeCarController {
    static createInstance() {
        const carService = new CarService({cars: carsDatabase})
        const carController = new CarController(carService)
        return carController
    }
}

module.exports = MakeCarController