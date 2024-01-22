const {body} = require ("express-validator");


const loginValidations = [
    body("email").notEmpty().withMessage("El campo email no puede quedar vacío").bail()
    .isEmail().withMessage("Debes ingresar un email válido")
];

module.exports = loginValidations;