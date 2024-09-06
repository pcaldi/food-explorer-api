const { Router } = require('express');
const FavoritesController = require('../controllers/FavoritesController');
const ensureAuthenticated = require('../middleware/ensureAuthenticated');

const favoritesRoutes = Router();

const favoritesController = new FavoritesController();

favoritesRoutesRoutes.use(ensureAuthenticated);

userRoutes.post('/', favoritesController.create);
userRoutes.get('/', favoritesController.index);
userRoutes.delete('/:id', favoritesController.delete);

module.exports = favoritesRoutes;
