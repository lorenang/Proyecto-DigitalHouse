const {body} = require ("express-validator");
const path = require('path');

const registerValidations = [
    body("nombre").notEmpty().withMessage("El campo nombre no puede quedar vacío"),
    body("apellido").notEmpty().withMessage("El campo apellido no puede quedar vacío"),
    body("email")
        .notEmpty().withMessage("El campo email no puede quedar vacío").bail()
        .isEmail().withMessage("Debes ingresar un email válido"),
    body("dir").notEmpty().withMessage("El campo dirección no puede quedar vacío"),
    body("telefono").notEmpty().withMessage("El campo teléfono no puede quedar vacío"),
    body("categoria").notEmpty().withMessage("El campo categoria no puede quedar vacío"),
    body("contrasenia")
        .notEmpty().withMessage("Debe ingresar una contraseña").bail()
        .isLength({ min: 8 }).withMessage("La contraseña debe tener 8 caracteres mínimo"),
    body("confirmar").custom((value, {req})=>{
            let valorContrasenia = req.body.contrasenia;
            let valorConfirmar = req.body.confirmar;
            if (valorContrasenia !== valorConfirmar){
                throw new Error('Las contraseñas no coinciden, verifique por favor.');
            }
            return true;
        }),
    body("foto").custom((value, {req})=>{
        let file = req.file;
        let acceptExt = ['.jpg', '.png'];

        if (!file){
            throw new Error('Debe seleccionar una imagen');
        } else {
            let fileExt = path.extname(file.originalname);
            if (!acceptExt.includes(fileExt)){
                throw new Error(`Las extensiones permitidas para las imagenes son ${acceptExt.join(', ')}`);
            }
        }
        return true;
    })
];

module.exports = registerValidations;