const {check}= require("express-validator");

let createValidations= [
    check('name').notEmpty().withMessage("El nombre no puede estar Vacio")
    .isLength({ min: 5 }).withMessage("El nombre debe tener al menos 5 caracteres"),
    check('descripcion').notEmpty().withMessage("la descripcion no puede estar Vacio")
    .isLength({ min: 20 }).withMessage("La descripción debe tener al menos 20 caracteres"), 
    check('category').notEmpty().withMessage("La categoria no puede estar Vacia"), 
    check('price').notEmpty().withMessage("El precio no puede ser vacio"),
    check('stock').notEmpty().withMessage("El stock no puede ser vacio"),
    // check('password').isLength({min: 6}).withMessage("La contraseña debe tener minimo 6 caracteres"),
    // check('confirm_password').isLength({min: 6}).withMessage("La confirmacion de la contraseña debe tener minimo 6 caracteres"),
    // check('confirm_password').custom((value, {req})=>  {
    //     if(!req.body.password == value){
    //         throw new Error ('Las contraseñas deben ser iguales')
    //     }
    //     return true;
    // }),
     check('productImage').custom((value, {req})=>{
     if(req.file== undefined){
        throw new Error ('Debe elegir una imagen con formato: JPG o JPEG o PNG');
     }
     return true;
     })
    

    // check('password ').notEmpty().withMessage("La contraseña no puede estar Vacio"),
]

module.exports= createValidations;