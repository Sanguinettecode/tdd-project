const http = require('http')
const MakeCarController = require('../src/factories/makeCarController')

const DEFAULT_PORT = 3000
const DEFAULT_HEADERS = {
    'Content-Type': 'application/json'
}


class Api {
    constructor(dependencies =  MakeCarController) {
        this.carController = dependencies.createInstance()
    }
    generateRoute() {
        return {
            '/rent:post': async (req, res) => {
                for await (const data of req) {
                    try {
                        const {customer, carCategory, numberOfDays} = JSON.parse(data)
                        const result = await this.carController.rentCar({user: customer, carCategory, numberOfDays})
                        res.writeHead(200, DEFAULT_HEADERS)
    
                        res.write(JSON.stringify({ result }))
                        res.end()
                    } catch (error) {
                        console.log('error', error)
                        res.writeHead(500, DEFAULT_HEADERS)
                        res.write(JSON.stringify({ error: 'Deu Ruim!' }))
                        res.end()
                    }
                }
            },

            '/getavailablecar:post': async (req, res) => {
               for await (const data of req) { 
                    try {
                        const {carCategory} = JSON.parse(data)
                        const result = await this.carController.getAvailableCar({carCategory})
                        res.writeHead(200, DEFAULT_HEADERS)

                        res.write(JSON.stringify({ result }))
                        res.end()
                    } catch (error) {
                        console.log('error', error)
                        res.writeHead(500, DEFAULT_HEADERS)
                        res.write(JSON.stringify({ error: 'Deu Ruim!' }))
                        res.end()
                    }
                }
            },

            '/calculateprice:post': async (req, res) => {
                for await (const data of req) {
                    try {
                        const {customer, carCategory, numberOfDays} = JSON.parse(data)
                        const result = await this.carController.calculatePrice({customer, carCategory, numberOfDays})
                        res.writeHead(200, DEFAULT_HEADERS)

                        res.write(JSON.stringify({ result }))
                        res.end()
                    } catch (error) {
                        console.log('error', error)
                        res.writeHead(500, DEFAULT_HEADERS)
                        res.write(JSON.stringify({ error: 'Deu Ruim!' }))
                        res.end()
                    }
                }
            },

            default : (req, res) => {
                res.writeHead(404, { 'content-type': 'application/json'})
                res.end(JSON.stringify('página não encontrada'))
            }
        }
    }

    handler (req, res) {
        const {url, method} = req
        const routeKey = `${url}:${method.toLowerCase()}`
        console.log(routeKey)
        const routes = this.generateRoute();
        const chosen = routes[routeKey] ?? routes.default

        res.writeHead(200, DEFAULT_HEADERS)

        return chosen(req, res)
    }

    initialize (port = DEFAULT_PORT) {
        const app = http.createServer(this.handler.bind(this))
        .listen(port, _ => console.log('app running  on port ' + port))

        return app
    }

}

if(process.env.NODE_ENV !== 'test') {
    console.log(process.env.NODE_ENV)
    const api = new Api()
    api.initialize()
}

module.exports = (dependencies) => new Api(dependencies )