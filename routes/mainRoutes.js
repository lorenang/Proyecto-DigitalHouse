const express = require('express');
const router = express.Router();

const mainController = require('../controllers/mainController')


router.get('/', mainController.index);
router.get('/products', mainController.products);
// router.get('/search', mainController.search); 
// router.get('/about', mainController.aboutController);
router.get('/login', mainController.login);
router.get('/register', mainController.register);
router.get('/carrito', mainController.carrito);
router.get('/newproduct', mainController.altaproducto);

router.get('/details/:id', mainController.detailsProduct);
router.get('/editproduct/:id', mainController.editProducto); 

router.post('/productos/crear', mainController.procesarCreate);
router.post('/producto/editar/:id', mainController.procesarEdit);
router.post('/producto/eliminar/:id', mainController.procesarEliminar);


module.exports = router;
