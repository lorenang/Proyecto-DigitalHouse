const express = require('express');
const router = express.Router();
const mainController = require('../controllers/mainController');
const { authMiddleware } = require('../middlewares/authMiddleware');
const createValidations= require('../middlewares/createValidations')

// Rutas accesibles por cualquiera
router.get('/', mainController.products);
router.get('/details/:id', mainController.detailsProduct);

// Rutas accesibles solo con login (usuarios)

/*ALTA DE UN PRODUCTO*/
router.get('/newproduct', authMiddleware, mainController.altaproducto);
router.post('/', upload.single('productImage'), createValidations,authMiddleware, mainController.procesarCreate);

/*EDIT DE UN PRODUCTO*/
router.get('/editproduct/:id', authMiddleware, mainController.editProducto); 
router.post('/editproduct/:id', upload.single('productImage'), createValidations, mainController.procesarEdit);

router.post('/producto/eliminar/:id', authMiddleware, mainController.procesarEliminar);

module.exports = router;
