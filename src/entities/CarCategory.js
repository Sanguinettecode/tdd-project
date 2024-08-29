const Base = require("./base/base");

class CarCategory extends Base {
    constructor({id, name, carId, price}) {
        super({id, name})
        this.price = price
        this.carId = carId
    }
}
module.exports = CarCategory