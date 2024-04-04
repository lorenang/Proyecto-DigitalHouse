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

const sequelize = db.sequelize;

// function getProducts() {
//     return JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));
// }
// function getProductById(productId) {
//     // Lee el archivo JSON de productos
//     const productsData = getProducts();
//     // Busca el producto por ID
//     const product = productsData.products.find(item => item.id === parseInt(productId));
//     return product;
// }
// function getUsers() {
//     return JSON.parse(fs.readFileSync(usersFilePath, 'utf-8'));
// }
// function getUserByUsername(username) {
//     // Lee el archivo JSON de productos
//     const usersData = getUsers();
//     // Busca el producto por ID
//     const user = usersData.users.find(item => item.username === username);
//     return user;
// }


const controller = {  
    
    index: async (req, res) => {
        const productosdata = await db.Products.findAll();
        return res.render('index', { productosdata })
    },
    products: async (req, res) => {
        // Lee el archivo JSON de productos
        const productosdata = await db.Products.findAll({include: "categoria"});
        // Pasa los datos de productos a la vista
        return res.render('products/products', { productosdata });
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
    
    // procesarCreate : async (req, res) => {
    //     // const errors= validationResult(req);
    //     try{
    //         const { name, description, category, price, stock } = req.body;
    //         const productImage = req.file;
    //         // if(errors.isEmpty()){
    //         // Crea un nuevo registro de producto en la base de datos
    //         await Productos.create({
    //             producto_descripcion: name,
    //             producto_detalle: description,
    //             categoria_id: category,
    //             producto_precio: price,
    //             producto_stock: stock,
    //             producto_imagen: productImage.filename // Asume que productImage.filename contiene el nombre de la imagen
    //         });
    // console.log(errors);
    //         // Redirige a la página de productos después de crear el nuevo registro
    //         return res.redirect('/products');
    //     }
    //         // else {res.render("./products/createProduct"), {errors: errors.mapped(), old:req.body}}
    // catch (error){
    //      res.status(500).send('Error interno del servidor');}
    // },
    
    
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

    

    // edit: async (req, res) => {
    //     try {
    //       const { id } = req.params;
    //       const user = await db.Users.findByPk(id);
    //       res.render('users/editUsers');
    //     } catch (error) {
    //       console.error('Error al mostrar el formulario de edición de usuario:', error);
    //       res.status(500).send('Internal Server Error');
    //     }
    //   },
      
    //   update: async (req, res) => {
    //     try {
    //       const { id } = req.params;
    //       const { fullname, username, email, password } = req.body;
    //       console.log(fullname,username,email,password);
    //       const userImagen = req.file;

    //     // Verifica si productoImagen está definido, y si lo está, obtén el nombre de archivo
    //     let user_imagen = null;
    //     if (userImagen) {
    //         user_imagen =userImagen.filename;
    //         // Aquí puedes agregar la lógica para manejar la actualización de la imagen del producto
    //         // Por ejemplo, puedes eliminar la imagen anterior y guardar la nueva imagen en su lugar
    //     }
    //       await db.User.update({  
    //         user_fullName: fullname,
    //         username: username,
    //         user_email: email,
    //         password: password,
    //         user_imagen: user_imagen }, { where: { id } });
    //       res.redirect('profile/'+req.session.username);
    //     } catch (error) {
    //       console.error('Error al actualizar el usuario:', error);
    //       res.status(500).send('Internal Server Error');
    //     }
    //   },



    // procesarEditUser : async function  (req, res) {
    //     // const errors = validationResult(req);
    //     // if (!errors.isEmpty()) {
    //     //     // Si hay errores de validación, renderiza nuevamente el formulario de edición con los errores
    //     //     const userId = req.params.id;
    //     //     const user = await db.Users.findByPk(userId);
    //     //     return res.render('users/editUsers', { user, errors: errors.mapped(), old: req.body });
    //     // }
    //     const userId = req.params.id;
    //     const { fullname, username, email, password } = req.body;
    //     const userImagen = req.file;

    //     // Verifica si productoImagen está definido, y si lo está, obtén el nombre de archivo
    //     let user_imagen = null;
    //     if (userImagen) {
    //         user_imagen =userImagen.filename;
    //         // Aquí puedes agregar la lógica para manejar la actualización de la imagen del producto
    //         // Por ejemplo, puedes eliminar la imagen anterior y guardar la nueva imagen en su lugar
    //     }

    //     // Actualiza el producto en la base de datos
    //     await Users.update(
    //         {
    //             user_fullName: fullname,
    //             username: username,
    //             user_email: email,
    //             password: password,
    //             // producto_stock: stock,
    //             user_imagen: user_imagen // Actualiza solo si hay una nueva imagen
    //         },
    //         {
    //             where: { user_id: userId } // Asegúrate de usar el campo correcto para la condición where
    //         });

    //     // Redirige a la página de productos después de la actualización
    //     res.redirect("/users/profile/"+userId); //cambiar a profile
    // },



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
}

module.exports = controller;

