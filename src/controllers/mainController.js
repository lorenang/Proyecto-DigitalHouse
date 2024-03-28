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
    guestRoute: (req, res) => {
        // Lógica para la ruta de huéspedes (accesible solo sin login)
        res.render('guest-route');
    },

    userRoute: (req, res) => {
        // Lógica para la ruta de usuarios (accesible solo con login)
        res.render('user-route');
    },

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
    editUser: async (req, res) => {
        const userId = req.params.id;
        // Aquí deberías obtener la información del producto según el id
        const user = await db.Users.findByPk(userId);
        // const product = getProductById(productId); 
        return res.render('users/editUsers', { user });
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




//OPCION 1 PROCESAREDIT NO FUNCIONA (TODAVIA)
    // procesarEdit: async (req, res) => {
    //     try {
    //         const productId = req.params.id;
    //         const { descripcion, detalle, category, precio, stock } = req.body;
    //         const productImage = req.file;
    
    //         // Obtiene la información actual del producto
    //         const product = await db.Productos.findByPk(productId);

    //         // Actualiza los datos del producto
    //         product.producto_descripcion = descripcion;
    //         product.producto_detalle = detalle;
    //         product.categoria_id = category;
    //         product.producto_precio = precio;
    //         product.producto = stock;
    
    //         // Actualiza la imagen si se proporciona una nueva
    //         if (productImage) {
    //             // Asigna el nombre de la nueva imagen al producto
    //             product.producto_imagen = `productImage-${Date.now()}${path.extname(productImage.originalname)}`;
    //             const newImagePath = path.join(__dirname, '../public/images/', product.producto_imagen);
    //             fs.renameSync(productImage.path, newImagePath);
    //         }
    
    //         // Lee el contenido actual del archivo JSON
    //         const productosdata = await db.Productos.findAll();

    //         // Busca el índice del producto en el array
    //         const productIndex = productosdata.findIndex(item => item.producto_id === parseInt(productId));

            
    //         if (productIndex !== -1) {
    //             // Actualiza el producto en el array de productos
    //             productosdata[productIndex] = product;
    
    //             // Escribe el nuevo contenido al archivo JSON
    //             fs.writeFileSync(productsFilePath, JSON.stringify(productosdata, null, 2));
    
    //             res.redirect('/products');
    //         } else {
    //             console.error('Producto no encontrado en el array de productos');
    //             res.status(500).send('Error interno del servidor');
    //         }
    //     } catch (error) {
    //         console.error('Error al procesar la edición del producto:', error);
    //         res.status(500).send('Error interno del servidor');
    //     }

    // },

    // procesarEliminar: (req, res) => {
    //     try {
    //         const productId = req.params.id;
    
    //         // Obtiene la información actual del producto
    //         const product = getProductById(productId);
    
    //         // Verifica si hay una imagen asociada al producto antes de intentar eliminarla
    //         if (product && product.image) {
    //             const imagePath = path.join(__dirname, '../public/images/', product.image);
    
    //             // Verifica si el archivo existe antes de intentar eliminarlo
    //             if (fs.existsSync(imagePath)) {
    //                 fs.unlinkSync(imagePath);
    //                 console.log(`Archivo eliminado: ${imagePath}`);
    //             } else {
    //                 console.log(`El archivo no existe: ${imagePath}`);
    //             }
    //         }
    
    //         // Lee el contenido actual del archivo JSON
    //         const productsData = getProducts();
    
    //         // Busca el índice del producto en el array
    //         const productIndex = productsData.products.findIndex(item => item.id === parseInt(productId));
    
    //         if (productIndex !== -1) {
    //             // Elimina el producto del array de productos
    //             productsData.products.splice(productIndex, 1);
    
    //             // Escribe el nuevo contenido al archivo JSON
    //             fs.writeFileSync(productsFilePath, JSON.stringify(productsData, null, 2));
    
    //             console.log(`Producto eliminado: ${productId}`);
    //             res.redirect('/products');
    //         } else {
    //             console.error('Producto no encontrado en el array de productos');
    //             res.status(500).send('Error interno del servidor');
    //         }
    //     } catch (error) {
    //         console.error('Error al procesar la eliminación del producto:', error);
    //         res.status(500).send('Error interno del servidor');
    //     }
    // },

}

module.exports = controller;

