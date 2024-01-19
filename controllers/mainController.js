const fs = require('fs');
const path = require('path');

const productsFilePath = path.join(__dirname, '../data/product.json');
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

const controller = {  
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
    login: (req, res) => {
        return res.render('users/login')
    },
    register: (req, res) => {
        return res.render('users/register')
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
