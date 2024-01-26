const fs = require('fs');
const path = require('path');

const bcrypt = require('bcrypt');

const productsFilePath = path.join(__dirname, '../data/product.json');
const usersFilePath = path.join(__dirname, '../data/users.json');
const toThousand = n => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

function getProducts() {
    return JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));
}
function getProductById(productId) {
    // Lee el archivo JSON de productos
    const productsData = getProducts();
    // Busca el producto por ID
    const product = productsData.products.find(item => item.id === parseInt(productId));
    return product;
}
function getUsers() {
    return JSON.parse(fs.readFileSync(usersFilePath, 'utf-8'));
}
function getUserByUsername(username) {
    // Lee el archivo JSON de productos
    const usersData = getUsers();
    // Busca el producto por ID
    const user = usersData.users.find(item => item.username === username);
    return user;
}


const controller = {  
    guestRoute: (req, res) => {
        // Lógica para la ruta de huéspedes (accesible solo sin login)
        res.render('guest-route');
    },

    userRoute: (req, res) => {
        // Lógica para la ruta de usuarios (accesible solo con login)
        res.render('user-route');
    },

    index: (req, res) => {
        // Lee el archivo JSON de productos
        const productsData = getProducts();
        // Pasa los datos de productos a la vista
        return res.render('index', { products: productsData.products });
    },
    products: (req, res) => {
        // Lee el archivo JSON de productos
        const productsData = getProducts();
        // Pasa los datos de productos a la vista
        return res.render('products/products', { products: productsData.products });
    },
    profile: (req, res) => {
        const username = req.params.username;
        // Aquí deberías obtener la información del producto según el id
        const profile = getUserByUsername(username); 
        // Renderiza la vista productDetail.ejs y pasa el objeto del producto
        return res.render('users/profile', { profile });
    },
    login: (req, res) => {
        return res.render('users/login')
    },
    procesarLogin: (req, res) => {
        try {
            const { username, password, remember } = req.body;
            const existingUser = getUserByUsername(username);
            if (existingUser) {
                const isPasswordCorrect = bcrypt.compareSync(password, existingUser.password);
                if (isPasswordCorrect) {
                    req.session.user = existingUser;
                    req.session.username = existingUser.username;
                     // Si el usuario marcó "recordarme", establecer una cookie
                    if (remember) {
                        res.cookie('remember', 'true', { maxAge: 604800000 }); // 7 días en milisegundos
                    }
                    res.redirect(`/profile/${username}`);

                } else {
                    res.redirect('/login');
                }
            } else {
                res.redirect('/login');
            }
        } catch(error) {
            console.error('Error al procesar el login:', error);
            res.status(500).send('Error interno del servidor');
        }
    },
    register: (req, res) => {
        return res.render('users/register')
    },
    procesarRegister: (req, res) => {
        try {
            const { fullname, username, email, password, confirmPassword } = req.body;
            const profileImage = req.file;
        
            // Verifica si el archivo users.json existe, si no, crea una estructura inicial
            if (!fs.existsSync(usersFilePath)) {
                const initialData = { users: [] };
                fs.writeFileSync(usersFilePath, JSON.stringify(initialData, null, 2));
            }
        
            // Verificar si el usuario ya existe
            const existingUser = getUserByUsername(username);
            if (existingUser) {
                return res.status(400).send('El usuario ya existe.');
            } else {
                if (password !== confirmPassword) {
                    return res.status(400).send('Las contraseñas no coinciden.');
                } else {
                    // Aplicar el método hashSync para encriptar el password
                    const hashedPassword = bcrypt.hashSync(password, 10);
                    // Establece el tipo de imagen como 'user'
                    profileImage.type = 'user';
                    // Lee el contenido actual del archivo JSON
                    const usersData = getUsers();
                    
                    const newUser = {
                        id: usersData.users.length + 1,
                        fullname,
                        username,
                        email,
                        password: hashedPassword,
                        image: profileImage.filename,
                    };

                    // Agrega el nuevo usuario al array de usuarios
                    usersData.users.push(newUser);

                    // Escribe el nuevo contenido al archivo JSON
                    fs.writeFileSync(usersFilePath, JSON.stringify(usersData, null, 2));

                    // Redirige después de un registro exitoso
                    res.redirect('/login');
                }
            }
        } catch (error) {
          console.error('Error al procesar la creación del usuario:', error);
          res.status(500).send('Error interno del servidor');
        }
    },
    logout: (req, res) => {
        req.session.destroy(err => {
            if (err) {
                console.error('Error al cerrar sesión:', err);
            } else {
                res.redirect('/login');
            }
        });
    },    
    carrito: (req, res) => {
        return res.render('products/carritoDeCompras')
    },
    altaproducto: (req, res) => {
        return res.render('products/createProduct');
    },
    detailsProduct: (req, res) => {
        const productId = req.params.id;
        // Aquí deberías obtener la información del producto según el id
        const product = getProductById(productId); 
        // Renderiza la vista productDetail.ejs y pasa el objeto del producto
        res.render('products/productDetail', { product });
    },
    editProducto: (req, res) => {
        const productId = req.params.id;
        // Aquí deberías obtener la información del producto según el id
        const product = getProductById(productId); 
        return res.render('products/editProduct', { product });
    },
    
    procesarCreate: (req, res) => {
        try {
            const { name, description, category, price, stock } = req.body;
            const productImage = req.file;
            // Verifica si el archivo product.json existe, si no, crea una estructura inicial
            if (!fs.existsSync(productsFilePath)) {
                const initialData = { products: [] };
                fs.writeFileSync(productsFilePath, JSON.stringify(initialData, null, 2));
            }
            // Lee el contenido actual del archivo JSON
            const productsData = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));
            // Crea un nuevo objeto de producto
            const newProduct = {
                id: productsData.products.length + 1, // Asigna un ID único (puedes usar alguna lógica específica)
                name,
                description,
                category,
                price,
                stock,
                image: productImage.filename,
            };
            // Agrega el nuevo producto al array de productos
            productsData.products.push(newProduct);
            // Escribe el nuevo contenido al archivo JSON
            fs.writeFileSync(productsFilePath, JSON.stringify(productsData, null, 2));
            res.redirect('/products');
        } catch (error) {
            console.error('Error al procesar la creación del producto:', error);
            res.status(500).send('Error interno del servidor');
        }
    },

    procesarEdit: (req, res) => {
        try {
            const productId = req.params.id;
            const { name, description, category, price, stock } = req.body;
            const productImage = req.file;
    
            // Obtiene la información actual del producto
            const product = getProductById(productId);

            // Actualiza los datos del producto
            product.name = name;
            product.description = description;
            product.category = category;
            product.price = price;
            product.stock = stock;
    
            // Actualiza la imagen si se proporciona una nueva
            if (productImage) {
                // Asigna el nombre de la nueva imagen al producto
                product.image = `productImage-${Date.now()}${path.extname(productImage.originalname)}`;
                const newImagePath = path.join(__dirname, '../public/images/', product.image);
                fs.renameSync(productImage.path, newImagePath);
            }
    
            // Lee el contenido actual del archivo JSON
            const productsData = getProducts();
    
            // Busca el índice del producto en el array
            const productIndex = productsData.products.findIndex(item => item.id === parseInt(productId));
    
            if (productIndex !== -1) {
                // Actualiza el producto en el array de productos
                productsData.products[productIndex] = product;
    
                // Escribe el nuevo contenido al archivo JSON
                fs.writeFileSync(productsFilePath, JSON.stringify(productsData, null, 2));
    
                res.redirect('/products');
            } else {
                console.error('Producto no encontrado en el array de productos');
                res.status(500).send('Error interno del servidor');
            }
        } catch (error) {
            console.error('Error al procesar la edición del producto:', error);
            res.status(500).send('Error interno del servidor');
        }

    },

    procesarEliminar: (req, res) => {
        try {
            const productId = req.params.id;
    
            // Obtiene la información actual del producto
            const product = getProductById(productId);
    
            // Verifica si hay una imagen asociada al producto antes de intentar eliminarla
            if (product && product.image) {
                const imagePath = path.join(__dirname, '../public/images/', product.image);
    
                // Verifica si el archivo existe antes de intentar eliminarlo
                if (fs.existsSync(imagePath)) {
                    fs.unlinkSync(imagePath);
                    console.log(`Archivo eliminado: ${imagePath}`);
                } else {
                    console.log(`El archivo no existe: ${imagePath}`);
                }
            }
    
            // Lee el contenido actual del archivo JSON
            const productsData = getProducts();
    
            // Busca el índice del producto en el array
            const productIndex = productsData.products.findIndex(item => item.id === parseInt(productId));
    
            if (productIndex !== -1) {
                // Elimina el producto del array de productos
                productsData.products.splice(productIndex, 1);
    
                // Escribe el nuevo contenido al archivo JSON
                fs.writeFileSync(productsFilePath, JSON.stringify(productsData, null, 2));
    
                console.log(`Producto eliminado: ${productId}`);
                res.redirect('/products');
            } else {
                console.error('Producto no encontrado en el array de productos');
                res.status(500).send('Error interno del servidor');
            }
        } catch (error) {
            console.error('Error al procesar la eliminación del producto:', error);
            res.status(500).send('Error interno del servidor');
        }
    },

}

module.exports = controller;
module.exports.getUserByUsername = getUserByUsername;
