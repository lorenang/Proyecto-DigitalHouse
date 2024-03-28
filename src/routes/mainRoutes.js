const express = require('express');
const router = express.Router();
const mainController = require('../controllers/mainController');

// Rutas accesibles por cualquiera
router.get('/', mainController.index);

// Otras rutas...
// router.get('/search', mainController.search); 
router.get('/about', mainController.aboutController);
router.get('/carrito', mainController.carrito);
module.exports = router;


// const express = require('express');
// const router = express.Router();
// const upload= require('../middlewares/MulterMiddleware');
// const uploadUser= require('../middlewares/MulterMiddleware')
// const mainController = require('../controllers/mainController')
// const { guestMiddleware, authMiddleware } = require('../middlewares/authMiddleware');

// //rutas accesibles por cualquiera
// router.get('/', mainController.index); 
// router.get('/products', mainController.products);
// router.get('/details/:id', mainController.detailsProduct);

// // Rutas accesibles solo sin login (huéspedes)
// router.get('/guest-route', guestMiddleware, mainController.guestRoute);
// router.get('/login', guestMiddleware, mainController.login);
// router.get('/register', guestMiddleware, mainController.register);

// // Rutas accesibles solo con login (usuarios)
// router.get('/user-route', authMiddleware, mainController.userRoute);
// router.get('/profile/:username', authMiddleware, mainController.profile);
// router.get('/carrito', authMiddleware, mainController.carrito);
// router.get('/newproduct', authMiddleware, mainController.altaproducto);
// router.get('/editproduct/:id', authMiddleware, mainController.editProducto); 
// router.post('/producto/eliminar/:id', authMiddleware, mainController.procesarEliminar);

// // Otras rutas...
// router.get('/logout', mainController.logout);
// router.post('/user/login', mainController.procesarLogin);
// router.post('/user/register', mainController.procesarRegister);
// router.post('/productos/crear', mainController.procesarCreate);
// router.post('/producto/editar/:id', mainController.procesarEdit);


// // router.get('/search', mainController.search); 
// // router.get('/about', mainController.aboutController);

// module.exports = router;
