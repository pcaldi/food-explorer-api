const { Router } = require('express');
const multer = require('multer');
const uploadConfig = require('../configs/upload');

const DishesController = require('../controllers/DishesController');
const ensureAuthenticated = require('../middleware/ensureAuthenticated');
const verifyUserAuthorization = require('../middleware/verifyUserAuthorization');


const dishesRoutes = Router();

const upload = multer(uploadConfig.MULTER);

const dishesController = new DishesController();

dishesRoutes.use(ensureAuthenticated);

dishesRoutes.get('/', dishesController.index);
dishesRoutes.get('/:id', dishesController.show);
dishesRoutes.delete('/:id', verifyUserAuthorization("is_admin"), dishesController.delete);
dishesRoutes.post('/', verifyUserAuthorization("is_admin"), upload.single("image"), dishesController.create);
dishesRoutes.put('/:id', verifyUserAuthorization("is_admin"), upload.single("image"), dishesController.update);

module.exports = dishesRoutes;
