const {check}= require("express-validator");
const db = require('../database/models');
let registerValidations= [
    check('fullname').notEmpty().withMessage("El nombre no puede estar Vacio")
    .isLength({ min: 2 }).withMessage("El nombre debe tener al menos 2 caracteres"),
    // check('username').notEmpty().withMessage("El username no puede estar Vacio"), 
    // check('email').notEmpty().withMessage("El email no puede estar Vacio"), 
    // check('email').isEmail().withMessage("El email ingresado es invalido"),
    check('password').isLength({min: 8}).withMessage("La contraseña debe tener minimo 8 caracteres"),
    check('confirm_password').isLength({min: 8}).withMessage("La confirmacion de la contraseña debe tener minimo 8 caracteres"),
    check('confirm_password')
        .isLength({ min: 8 }).withMessage("La confirmación de la contraseña debe tener mínimo 8 caracteres")
        .custom((value, { req }) => {
            if (value !== req.body.password) { 
                throw new Error('Las contraseñas deben ser iguales');
            }
        return true;
    }),
    check('userImage').custom((value, {req})=>{
    if(req.file == undefined){
        throw new Error ('Debe elegir una imagen con formato: JPG o JPEG o PNG');
    }
    return true;
    }),
    check('email')
        .notEmpty().withMessage("El correo electrónico no puede estar vacío")
        .isEmail().withMessage("El correo electrónico ingresado es inválido")
        .custom(async (value) => {
            const user = await db.Users.findOne({ where: { user_email: value } });
            if (user) {
                throw new Error('Este correo electrónico ya está en uso');
            }
            return true;
        }),

        check('username')
        .notEmpty().withMessage("El nombre de usuario no puede estar vacío")
        .custom(async (value) => {
            const user = await db.Users.findOne({ where: { username: value } });
            if (user) {
                throw new Error('Este nombre de usuario ya está en uso');
            }
            return true;
        }),



]

module.exports= registerValidations;