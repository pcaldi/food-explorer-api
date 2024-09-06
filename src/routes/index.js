const { Router } = require('express');

const userRoutes = require('./users.routes');
const dishesRoutes = require('./dishes.routes');
const sessionsRoutes = require('./sessions.routes');
const favoritesRoutes = require('./favorites.routes');

const routes = Router();

routes.use('/users', userRoutes);
routes.use('/dishes', dishesRoutes);
routes.use('/sessions', sessionsRoutes);
routes.use('/favorites', favoritesRoutes);

module.exports = routes;
