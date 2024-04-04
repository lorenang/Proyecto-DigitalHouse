const { Router } = require("express");
const userController = require("../controllers/usersController");
const {body} = require ("express-validator");
const loginValidations = require ("../middlewares/loginMiddleware");
const guestMiddleware = require ("../middlewares/invitadoMiddleware");
const authMiddleware = require ("../middlewares/autorizacionMiddleware");
const adminMiddleware = require("../middlewares/adminMiddleware");
const registerValidations = require("../middlewares/registerMiddleware");

const path = require("path");
const multer = require("multer");
const routerUsers = Router();

// Multer - manejo del almacenamiento
const storage = multer.diskStorage({
	destination: (req , file , cb) => {
		cb (null , path.resolve(__dirname , "../../public/images/user"));
	},
	filename: (req , file , cb) => {
		cb (null , file.fieldname + "-" + Date.now() + path.extname(file.originalname))
	}
});

// Instanciar multer para manejar los métodos
const upload = multer ({ storage });

const routesUser = {
    loginRoute: "/login",
    registerRoute: "/register",
    profileRoute: "/profile",
	listUsersRoute: "/usersList",
    logoutRoute: "/logout",
    deleteRoute: "/delete/:id"
};

routerUsers.get(routesUser.loginRoute, guestMiddleware , userController.loginController);
routerUsers.post(routesUser.loginRoute , loginValidations , userController.loginProcess);

routerUsers.get(routesUser.profileRoute, authMiddleware , userController.profileController);

routerUsers.get(routesUser.logoutRoute, userController.logoutController);
routerUsers.get(routesUser.deleteRoute, userController.deleteController);
routerUsers.delete(routesUser.deleteRoute, userController.destroyController);

// get-post form registración
routerUsers.get(routesUser.registerRoute, guestMiddleware, userController.registerController);
routerUsers.post(routesUser.registerRoute, upload.single("foto"), registerValidations, userController.addRegisterController);
 
routerUsers.get(routesUser.listUsersRoute, authMiddleware, adminMiddleware, userController.listUsersController);

module.exports = routerUsers;