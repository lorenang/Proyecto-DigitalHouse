const {check}= require("express-validator");
const db = require('../database/models');
// const sequelize = db.sequelize;
const { Op } = require("sequelize");
const moment = require('moment');
const { log } = require('console');
const Users = db.Users;
const bcrypt = require('bcrypt');

const validacionesLogin  = [

    check("username").notEmpty().withMessage("El usuario no puede ser vacío"),
    // check("password").isLength({ min: 6 }).withMessage("La contraseña debe tener un mínimo de 6 caracteres"),
    check("username").custom(async (value, { req }) => {
        let user = await db.Users.findOne({ where: { user_username: value } }); 
        if (!user) {
            throw new Error('Usuario no se encuentra registrado...');
        }
        return true;
    }),

    check("password").custom(async (password, { req }) => {
        let user = await db.Users.findOne({ where: { user_username: req.body.username } }); // Usa req.body.username para obtener el nombre de usuario
        console.log("llega a la check de la pass")
        if (!user || !(bcrypt.compareSync(password, user.user_password))) {
            console.log("llega al compareSync")
            throw new Error("Contraseña incorrecta");
        }
        return true; // Agrega este retorno para indicar que la validación pasó correctamente
    })
]

module.exports= validacionesLogin;