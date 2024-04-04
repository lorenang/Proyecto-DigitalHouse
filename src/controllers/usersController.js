const fs = require('fs');
const path = require('path');
const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const { Op } = require("sequelize");
const moment = require('moment');
const { log } = require('console');

// const productsFilePath = path.join(__dirname, '../data/product.json');
// const usersFilePath = path.join(__dirname, '../data/users.json');
const createValidations = require('../middlewares/createValidations');

// modelos
const db = require('../database/models'); // Aquí movemos la importación después de las demás importaciones
const Users = db.Users;
const sequelize = db.sequelize;

const controller = {
    guestRoute: (req, res) => {
        // Lógica para la ruta de huéspedes (accesible solo sin login)
        res.render('guest-route');
    },

    userRoute: (req, res) => {
        // Lógica para la ruta de usuarios (accesible solo con login)
        res.render('user-route');
    },

    profile: async(req, res) => {
        const username = req.params.username;
        // Aquí deberías obtener la información del producto según el id
        const profile = await db.Users.findOne({ where: { user_username:username } }); 
        // Renderiza la vista productDetail.ejs y pasa el objeto del producto
        return res.render('users/profile', { profile });
    },

    login: (req, res) => {
        return res.render('users/login')
    },
    procesarLogin: async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            // Si hay errores de validación, renderiza nuevamente el formulario de registro con los errores
            return res.render('users/login', { errors: errors.mapped(), old:req.body });
        }
        const { username, password, remember } = req.body;
        const existingUser = await db.Users.findOne({ where: { user_username:username } });
        if (existingUser) {
            const isPasswordCorrect = bcrypt.compareSync(password, existingUser.user_password);
            if (isPasswordCorrect) {
                req.session.user = existingUser;
                req.session.username = existingUser.user_username;
                if (existingUser.role_id === 1) {
                    req.session.role = 'ADMIN'
                } else {
                    req.session.role = 'BUYER'
                }
                // Si el usuario marcó "recordarme", establecer una cookie
                if (remember) {
                    res.cookie('remember', 'true', { maxAge: 604800000 }); // 7 días en milisegundos
                }
                res.redirect(`/users/profile/${username}`);
            } else {
                res.redirect('/users/login');
            }
        } else {
            res.redirect('/users/login');
        }
    },

    register: (req, res) => {
        return res.render('users/register')
    },
    procesarRegister: async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            // Si hay errores de validación, renderiza nuevamente el formulario de registro con los errores
            return res.render('users/register', { errors: errors.mapped(), old:req.body });
        }
        // Si no hay errores de validación, procede con el registro del usuario
        const { fullname, username, email, password } = req.body;
        let profileImage; // Variable para almacenar el nombre de la imagen de perfil
        if (req.file) {
            profileImage = req.file.filename;
        } else {
            // Si no se ha subido una imagen, utiliza la imagen por defecto
            profileImage = 'user-default.png';
        }
        try {
            // Verifica si el usuario ya existe
            const existingUser = await db.Users.findOne({ where: { user_username: username } });
            if (existingUser) {
                return res.status(400).send('El usuario ya existe.');
            }
            // Aplicar el método hashSync para encriptar el password
            const hashedPassword = bcrypt.hashSync(password, 10);
            // Crear el nuevo usuario en la base de datos
            await db.Users.create({
                user_fullName: fullname,
                user_username: username,
                user_email: email,
                user_password: hashedPassword,
                user_image: profileImage,
                role_id: 2,
            });
            // Redirigir al usuario a la página de inicio de sesión
            res.redirect('/users/login');
        } catch (error) {
            // Manejar cualquier error que ocurra durante el proceso de registro
            console.error('Error al registrar usuario:', error);
            res.status(500).send('Se produjo un error al procesar el registro.');
        }
    },
  
    logout: (req, res) => {
        req.session.destroy(err => {
            if (err) {
                console.error('Error al cerrar sesión:', err);
            } else {
                res.redirect('/users/login');
            }
        });
    }, 
    userList: async (req, res) => {
        // Lee el archivo JSON de productos
        const users = await db.Users.findAll();
        // Pasa los datos de productos a la vista
        return res.render('users/usersList', { users });
    },
    carrito: (req, res) => {
        return res.render('products/carritoDeCompras')
    },
    
    edit: async (req, res) => {
        try {
            const { id } = req.params;
            const user = await db.Users.findByPk(id);
            res.render('users/editUsers', { user });
        } catch (error) {
            console.error('Error al mostrar el formulario de edición de usuario:', error);
            res.status(500).send('Internal Server Error');
        }
    },
    update: async (req, res) => {
        try {
            
            const { id } = req.params;
            const { fullname, username, email, password } = req.body;
            const userImage = req.file;
    
            let user_imagen = null;
            if (userImage) {
                user_imagen = userImage.filename;
                // Lógica para manejar la actualización de la imagen del usuario
            }
            const hashedPassword = bcrypt.hashSync(password, 10);
    
            await Users.update({  
                user_fullName: fullname,
                user_username: username,
                user_email: email,
                user_password: hashedPassword,
                user_image: user_imagen
            }, { where: { user_id: id } });
    
            req.session.destroy(err => {
                if (err) {
                    console.error('Error al cerrar la sesión:', err);
                    res.status(500).send('Internal Server Error');
                } else {
                    // alert("Los datos del usuario han sido modificados, por favor reinicia la sesion");
                    res.redirect('/users/login');
                }
            });
            // res.redirect('/users/profile/' + req.session.username);
        } catch (error) {
            console.error('Error al actualizar el usuario:', error);
            res.status(500).send('Internal Server Error');
        }
    },

    userProcesarEliminar: function (req,res) {
        let userId = req.params.id;
        Users
        .destroy({where: {user_id: userId}, force: true}) // force: true es para asegurar que se ejecute la acción
        .then(()=>{
            return res.redirect('/users/userlist')})
        .catch(error => res.send(error)) 
    },

}

module.exports = controller;