const {check}= require("express-validator");

let registerValidations= [
    check('fullname').notEmpty().withMessage("El nombre no puede estar Vacio")
    .isLength({ min: 2 }).withMessage("El nombre debe tener al menos 2 caracteres"),
    check('username').notEmpty().withMessage("El username no puede estar Vacio"), 
    check('email').notEmpty().withMessage("El email no puede estar Vacio"), 
    check('email').isEmail().withMessage("El email ingresado es invalido"),
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
    // check('userImage').custom((value, {req})=>{
    //     if(req.file== undefined) {
    //         throw new Error ('Debe elegir una imagen con formato: JPG o JPEG o PNG');
    //     }
    //     return true;
    // })
]

module.exports= registerValidations;