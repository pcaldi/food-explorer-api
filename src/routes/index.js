const { Router } = require('express');

const userRoutes = require('./users.routes');
const dishesRoutes = require('./dishes.routes');

const routes = Router();

routes.use('/users', userRoutes);
routes.use('/dishes', dishesRoutes);

module.exports = routes;
