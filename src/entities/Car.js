const Base = require("./base/base");

class Car extends Base {
    constructor({id, name, releaseYear, availabe, gasAvailable}) {
        super({id,name});
        this.releaseYear = releaseYear;
        this.availabe = availabe;
        this.gasAvailable = gasAvailable;
    }
}
module.exports = Car