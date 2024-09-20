const { Router } = require('express');
const FavoritesController = require('../controllers/FavoritesController');
const ensureAuthenticated = require('../middleware/ensureAuthenticated');

const favoritesRoutes = Router();

const favoritesController = new FavoritesController();

favoritesRoutes.use(ensureAuthenticated);

favoritesRoutes.post('/', favoritesController.create);
favoritesRoutes.get('/', favoritesController.index);
favoritesRoutes.delete('/:dish_id', favoritesController.delete);

module.exports = favoritesRoutes;
