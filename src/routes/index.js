const { Router } = require('express')

const userRoutes = require('./users.route')

const routes = Router()

routes.use('/users', userRoutes)

module.exports = routes;
