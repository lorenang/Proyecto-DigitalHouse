// const fs = require('fs');
// const path = require('path');

// const bcrypt = require('bcrypt');

// const productsFilePath = path.join(__dirname, '../product.json');
// const usersFilePath = path.join(__dirname, '../users.json');


// const usersService = {
//   users: JSON.parse(fs.readFileSync(usersFilePath, "utf-8")),


//   getUsers: function () {
//          return this.users;
//      },

// //      //  getOneEmail: function (email) {
// //     let user = this.users.find((elem) => elem.email == email);
// //     return user;
// //   },
//      getUserByUsername: function(username){
//         // const usersData = this.getUsers();
//         let user = this.users.find((elem) => elem.username.toLowerCase() === lowerCaseUsername);
//     return user;
//         console.log(user);
//      },


//     //  procesarLogin: (username, password, remember) => {
//     //     const existingUser = this.getUserByUsername;
//     //     if (existingUser) {
//     //       const isPasswordCorrect = bcrypt.compareSync(password, existingUser.password);
//     //       if (isPasswordCorrect) {
//     //         return { success: true, user: existingUser, remember };
//     //       } else {
//     //         return { success: false, error: 'Contraseña incorrecta' };
//     //       }
//     //     } else {
//     //       return { success: false, error: 'Usuario no encontrado' };
//     //     }
//     //   }
    




//     //  function getProductById(productId) {
//     //     // Lee el archivo JSON de productos
//     //     const productsData = getProducts();
//     //     // Busca el producto por ID
//     //     const product = productsData.products.find(item => item.id === parseInt(productId));
//     //     return product;
//     // }


































//   function getProducts() {
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

//   getAll: function () {
//     return this.users;
//   },

//   save: function (req) {
//     let user = req.body;
//     user.id =  this.users.length > 0 ? this.users[this.users.length - 1].id + 1 : 1;
//     const image = req.file ? req.file.filename : "default-image.png";
//     const password= bcrypt.hashSync(req.body.password,12);
//     user.password= password;
//     user.image = image;
//     this.users.push(user);
//     fs.writeFileSync(usersFilePath, JSON.stringify(this.users), "utf-8");
//   },

//   getOne: function (id) {
//     let user = this.users.find((elem) => elem.id == id);
//     return user;
//   },


//   getOneEmail: function (email) {
//     let user = this.users.find((elem) => elem.email == email);
//     return user;
//   },

//   delete: function (id) {
//     indice = this.users.findIndex((elem) => elem.id == id);
//     this.users.splice(indice, 1);
//     fs.writeFileSync(usersFilePath, JSON.stringify(this.users), "utf-8");
//   },

//   edit: function (data, id) {
//     let user = this.getOne(id);
//     let userNuevo = data;
//     user.firstname = userNuevo.firstname;
//     user.lastName = userNuevo.lastName;
//     user.email = userNuevo.email;
//     user.password = userNuevo.password;
//     //this.products[indice]= producto;
//     fs.writeFileSync(usersFilePath, JSON.stringify(this.users), "utf-8");
// //   },
// };

// module.exports = usersService;
