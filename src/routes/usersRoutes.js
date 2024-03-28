const express = require('express');
const router = express.Router();
const mainController = require('../controllers/mainController');
const { guestMiddleware, authMiddleware } = require('../middlewares/authMiddleware');
const registerValidations= require('../middlewares/registerValidations');
const validacionesLogin=require('../middlewares/loginValidations');
// Rutas accesibles por cualquiera
router.get('/guest-route', guestMiddleware, mainController.guestRoute);
router.get('/login', guestMiddleware, mainController.login);
router.get('/register', guestMiddleware, mainController.register);
router.post('/',upload.single('userImage'),registerValidations, guestMiddleware, mainController.procesarRegister);
router.get('/userlist', mainController.userList);
// Rutas accesibles solo con login (usuarios)
router.get('/user-route', authMiddleware, mainController.userRoute);
router.get('/profile/:username', authMiddleware, mainController.profile);
router.get('/carrito', authMiddleware, mainController.carrito);
// router.get('/profile/edit/:id', authMiddleware, mainController.editUser);
// router.put('/', authMiddleware, mainController.procesarEditUser); en desarrollo
// Otras rutas...

/*** EDIT ONE USER ***/
// router.get('/:id/edit', mainController.editUser);
// router.put('/:id', mainController.procesarEditUser);

/*** DELETE ONE USER***/
// router.delete('/:id', mainController.destroy);

//prueba 22/3
/*EDIT DE UN PRODUCTO*/
router.get('/edituser/:id', authMiddleware, mainController.edit); 
router.post('/edituser/:id', upload.single('userImage'),  mainController.update);
/*prueba 21/3*/
// router.get('/:id/edit', authMiddleware, mainController.edit);
// router.post('/:id/profile', authMiddleware, mainController.update);
router.post('/eliminar/:id', authMiddleware, mainController.userProcesarEliminar);

// router.put('/:id', mainController.procesarEditUser);
router.get('/logout', mainController.logout);
router.put('/',validacionesLogin, mainController.procesarLogin);
// router.post('/producto/editar/:id', mainController.procesarEdit);

module.exports = router;



