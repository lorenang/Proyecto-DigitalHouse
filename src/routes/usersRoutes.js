const express = require('express');
const router = express.Router();

const mainController = require('../controllers/mainController');
const { authMiddleware } = require('../middlewares/authMiddleware');
const registerValidations= require('../middlewares/registerValidations');
const validacionesLogin=require('../middlewares/loginValidations');
const guestMiddleware = require('../middlewares/guestMiddleware');
//middleware para usuarixs logeadxs - que impide que usuarixs NO logueadxs entren a perfil y carrito 

const loggedMiddleware = require('../middlewares/loggedMiddleware');
const adminAuthMiddleware = require("../middlewares/adminAuthMiddleware");
// 

// Rutas accesibles por cualquiera
router.get('/guest-route', guestMiddleware, mainController.guestRoute);
router.get('/login', guestMiddleware, mainController.login);
router.get('/register', guestMiddleware, mainController.register);
router.post('/',upload.single('userImage'),registerValidations, guestMiddleware, mainController.procesarRegister);
router.get('/userlist', adminAuthMiddleware.noLoggedAdmin, mainController.userList);
// Rutas accesibles solo con login (usuarios)
//router.get('/user-route', authMiddleware, usersController.userRoute);
router.get('/profile/:username', authMiddleware, usersController.profileController);
//router.get('/carrito', authMiddleware, usersController.carrito);
// router.get('/profile/edit/:id', authMiddleware, mainController.editUser);
// router.put('/', authMiddleware, mainController.procesarEditUser); en desarrollo


/*** EDIT ONE USER ***/
// router.get('/:id/edit', mainController.editUser);
// router.put('/:id', mainController.procesarEditUser);

/*** DELETE ONE USER***/
// router.delete('/:id', mainController.destroy);

//prueba 22/3
/*EDIT DE UN PRODUCTO*/
//router.get('/edituser/:id', authMiddleware, usersController.edit); 
//router.post('/edituser/:id', upload.single('userImage'),  usersController.update);
/*prueba 21/3*/
// router.get('/:id/edit', authMiddleware, mainController.edit);
// router.post('/:id/profile', authMiddleware, mainController.update);
router.post('/eliminar/:id', authMiddleware, usersController.deleteController);

// router.put('/:id', mainController.procesarEditUser);
router.get('/logout', usersController.logoutController);
router.put('/',validacionesLogin, usersController.procesarLogin);
// router.post('/producto/editar/:id', mainController.procesarEdit);

module.exports = router;