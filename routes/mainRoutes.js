const express = require('express');
const router = express.Router();

const mainController = require('../controllers/mainController')

router.get('/', mainController.index);
router.get('/login', mainController.login);
router.get('/register', mainController.register);
router.get('/carrito', mainController.carrito);
router.get('/newproduct', mainController.altaproducto);
router.get('/details/:id', mainController.detailsProduct);
router.get('/editproduct/:id', mainController.editProducto); 
router.post('/productos/crear', mainController.procesarCreate);
router.post('/productos/editar/:id', mainController.procesarEdit);

/*rutas para ver las vistas de las pantallas*/
router.get('/details', mainController.details);
router.get('/edit', mainController.edit); 
module.exports = router;