const controller = {
    index: (req, res) => {
        return res.render('index')
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
    editProducto: (req, res) => {
        const productId = req.params.id;
        return res.render('products/editProduct', { productId });
    },
    detailsProduct: (req, res) => {
        const productId = req.params.id;
        return res.render('products/productDetail', { productId });
    },
    
    procesarCreate: (req, res) => {
        // Lógica para procesar los datos del formulario y guardar el nuevo producto
        res.redirect('/'); // Redirigir a la lista de productos después de la creación
    },
    procesarEdit: (req, res) => {
        const productId = req.params.id;
        // Lógica para actualizar el producto en la base de datos con los nuevos datos del formulario
        res.redirect('/'); // Redirigir a la lista de productos después de la edición
    },

    /*controlador para poder visualizar las pantallas*/
    edit: (req, res) => {
        return res.render('products/editProduct');
    },
    details: (req, res) => {
        return res.render('products/productDetail');
    },
}

module.exports = controller;
