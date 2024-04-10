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
const Categorias = db.Categories;
const Orders = db.Orders;
const OrdersItems = db.OrderItem;
const OrdersStatus = db.OrdersStatus;
const Productos = db.Products;
const Users = db.Users;



const controller = {  
    
    index: async (req, res) => {
        
        return res.render('index')
    },
    products: async (req, res) => {
        try {
            const productosdata = await db.Productos.findAll({
                limit: 6
            });
            const productosRecientes = await db.Productos.findAll({
                order: [['createdAt', 'DESC']],
                limit: 3
            });
            const categorias = await db.Categorias.findAll(); // Obtener todas las categorías

            return res.render('products/products', { productosdata, productosRecientes, categorias });
        } catch (error) {
            console.error('Error al obtener productos:', error);
            res.status(500).send('Error interno del servidor');
        }
    },

    productsList: async (req, res) => {
        try {
            const  categoryId  = req.params.id; // Obtener el ID de la categoría de la URL
            console.log(req.params.id)
            const productosdata = await db.Productos.findAll({ 
                where: { categoria_id: categoryId }, // Filtrar productos por categoría
                include: "categoria"
            });
            return res.render('products/productsList', { productosdata });
        } catch (error) {
            console.error('Error al obtener productos por categoría:', error);
            res.status(500).send('Error interno del servidor');
        }
    },
//    categoyList: async (req, res) => {
//         try {
//             const { categoryId } = req.params; 
//             const productosdata = await db.Productos.findAll({ 
//                 where: { categoria_id: categoryId }, 
//                 include: "categoria"
//             });
//             return res.render('products/productsList', { productosdata });
//         } catch (error) {
//             console.error('Error al obtener productos por categoría:', error);
//             res.status(500).send('Error interno del servidor');
//         }
//     },

    profile: async(req, res) => {
        const username = req.params.username;
        // Aquí deberías obtener la información del producto según el id
        const profile = await db.Users.findOne({ where: { username:username } }); 
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
            const existingUser = await db.Users.findOne({ where: { username:username } });
            console.log(existingUser);
            if (existingUser) {
                const isPasswordCorrect = bcrypt.compareSync(password, existingUser.password);
                if (isPasswordCorrect) {
                    req.session.user = existingUser;
                    req.session.username = existingUser.username;
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
        const profileImage = req.file;
    
        try {
            // Verifica si el usuario ya existe
            const existingUser = await db.Users.findOne({ where: { username: username } });
            if (existingUser) {
                return res.status(400).send('El usuario ya existe.');
            }
    
            // Aplicar el método hashSync para encriptar el password
            const hashedPassword = bcrypt.hashSync(password, 10);
    
            // Crear el nuevo usuario en la base de datos
            await db.Users.create({
                user_fullName: fullname,
                username: username,
                user_email: email,
                password: hashedPassword,
                user_imagen: profileImage.filename,
                rol_id: 1
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
    carrito: (req, res) => {
        return res.render('products/carritoDeCompras')
    },
    altaproducto: (req, res) => {
        return res.render('products/createProduct');
    },


    detailsProduct: async (req, res) => {
        const productId = req.params.id;
        // Aquí deberías obtener la información del producto según el id
        const product = await db.Productos.findByPk(productId, {include: "categoria"});
        // const product = getProductById(productId); 
        // Renderiza la vista productDetail.ejs y pasa el objeto del producto
         res.render('products/productDetail', { product });
       
    },


    editProducto: async (req, res) => {
        const productId = req.params.id;
        // Aquí deberías obtener la información del producto según el id
        const product = await db.Productos.findByPk(productId);
        // const product = getProductById(productId); 
        return res.render('products/editProduct', { product });
    },
    
    procesarCreate : async (req, res) => {
        const errors= validationResult(req);
		if(errors.isEmpty()){
            const { name, descripcion, category, price, stock } = req.body;
            
            const productImage = req.file;
    
            // Crea un nuevo registro de producto en la base de datos
            await Productos.create({
                producto_descripcion: name,
                producto_detalle: descripcion,
                categoria_id: category,
                producto_precio: price,
                producto_stock: stock,
                producto_imagen: productImage.filename // Asume que productImage.filename contiene el nombre de la imagen
            });
    
            // Redirige a la página de productos después de crear el nuevo registro
            return res.redirect('/products');
        }
        else{
            
            return res.render('products/createProduct' , {errors: errors.mapped(), old:req.body})
           
        }
    
        
    },
    userList: async (req, res) => {
        // Lee el archivo JSON de productos
        const users = await db.Users.findAll();
        // Pasa los datos de productos a la vista
        return res.render('users/usersList', { users });
    },
   
    
    
    //OPCION 3 PROCESAR EDIT:
    procesarEdit : async function  (req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            // Si hay errores de validación, renderiza nuevamente el formulario de edición con los errores
            const productId = req.params.id;
            const product = await db.Productos.findByPk(productId);
            return res.render('products/editProduct', { product, errors: errors.mapped(), old: req.body });
        }
        const productId = req.params.id;
        const { name, descripcion, category, price, stock } = req.body;
        const productoImagen = req.file;

        // Verifica si productoImagen está definido, y si lo está, obtén el nombre de archivo
        let producto_imagen = null;
        if (productoImagen) {
            producto_imagen = productoImagen.filename;
            // Aquí puedes agregar la lógica para manejar la actualización de la imagen del producto
            // Por ejemplo, puedes eliminar la imagen anterior y guardar la nueva imagen en su lugar
        }

        // Actualiza el producto en la base de datos
        await Productos.update(
            {
                producto_descripcion: name,
                producto_detalle: descripcion,
                categoria_id: category,
                producto_precio: price,
                producto_stock: stock,
                producto_imagen: producto_imagen // Actualiza solo si hay una nueva imagen
            },
            {
                where: { producto_id: productId } // Asegúrate de usar el campo correcto para la condición where
            });

        // Redirige a la página de productos después de la actualización
        return res.redirect('/products');
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
        const defaultImagePath = '../../public/images/default-profile-image.jpg';
        try {
            const { id } = req.params;
            const { fullname, username, email } = req.body;
            const userImage = req.file;
    
            let user_imagen = null;
            if (userImage) {
                user_imagen = userImage.filename;
                // Lógica para manejar la actualización de la imagen del usuario
            } else {
                // Obtener la imagen actual del usuario de la base de datos
                const currentUser = await Users.findByPk(id);
                // Si el usuario tiene una imagen actual, conservarla
                if (currentUser && currentUser.user_imagen) {
                    user_imagen = currentUser.user_imagen;
                } else {
                    // Si no hay ninguna imagen actual y no se carga ninguna nueva, asigna la imagen predeterminada
                    user_imagen = fs.existsSync(defaultImagePath) ? defaultImagePath : null;
                }
            }
           
            await Users.update({  
                user_fullName: fullname,
                username: username,
                user_email: email,
                user_imagen: user_imagen
            }, { where: { user_id: id } });
    
            // Redireccionar al usuario a su perfil
            res.redirect('/users/profile/' + username);
        } catch (error) {
            console.error('Error al actualizar el usuario:', error);
            res.status(500).send('Internal Server Error');
        }
    },

   

    procesarEliminar: function (req,res) {
        let productId = req.params.id;
        Productos
        .destroy({where: {producto_id: productId}, force: true}) // force: true es para asegurar que se ejecute la acción
        .then(()=>{
            return res.redirect('/products')})
        .catch(error => res.send(error)) 
    },
    aboutController: (req,res)=>{
        res.render(("about"))
    },

    
    userProcesarEliminar: function (req,res) {
        let userId = req.params.id;
        Users
        .destroy({where: {user_id: userId}, force: true}) // force: true es para asegurar que se ejecute la acción
        .then(()=>{
            return res.redirect('/users/userlist')})
        .catch(error => res.send(error)) 
    },
    
    aboutController: (req,res)=>{
        res.render(("about"))
    },


}

module.exports = controller;