const express = require('express');
const app = express();
const multer = require('multer');
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const bodyParser = require('body-parser');
const upload= require('../src/middlewares/MulterMiddleware');
const uploadUser= require('../src/middlewares/MulterMiddleware');
const methodOverride = require("method-override");

const mainRoutes = require("./routes/mainRoutes");
const productsRoutes = require("./routes/productsRoutes");
const usersRoutes = require("./routes/usersRoutes");


const mainController = require('./controllers/mainController');

const { authMiddleware, guestMiddleware, rememberMiddleware } = require('./middlewares/authMiddleware');
const { validationResult } = require('express-validator');
const createValidations = require('./middlewares/createValidations');
app.use(methodOverride("_method"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(cookieParser());
app.use(session({
    secret: 'tu_secreto_aqui',
    resave: false,
    saveUninitialized: true
}));


// Agrega el middleware de recordar al usuario
app.use(rememberMiddleware);



// Middleware para pasar información del usuario a todas las vistas
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});
app.use((req, res, next) => {
  // console.log('Middleware res.locals.user:', res.locals.user);
  res.locals.user = req.session.user || null;
  next();
});



// app.post('/user/register', uploadUser.single('profileImage'), (req, res) => {
//   req.body.type = 'user';
//   console.log('Procesando creación del usuario...');
//   mainController.procesarRegister(req, res);
// });
// app.post('/user/login', (req, res) => {
//   console.log('Procesando login del usuario...');
//   mainController.procesarLogin(req, res);
// });

// app.post('/productos/crear', upload.single('productImage'), (req, res) => {
//   // Establece el tipo de imagen como 'product' en la solicitud
//   req.body.type = 'product';
//   console.log('Procesando creación de producto...');
//   mainController.procesarCreate(req, res);
// });
// app.post('/producto/editar/:id', upload.single('productImage'), (req, res) => {
//   req.body.type = 'product';
//   console.log('Procesando edición de producto...');
//   mainController.procesarEdit(req, res);
// });
// app.post('/producto/eliminar/:id', mainController.procesarEliminar);

app.use(express.static(path.join('./public')));

// Configurar EJS como motor de plantillas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));

/*Rutas Principales*/
app.use('/', mainRoutes);

/*Rutas Para productos*/
app.use('/products', productsRoutes);

/*Rutas Para usuarios*/
app.use('/users', usersRoutes);

app.use((req, res, next) => {
  res.status(404).render("error404");
  next();
}); 


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`click para dirigirte al sitio: http://localhost:${PORT}/`);
});


// Configuración de Multer
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     // Define la carpeta principal según el tipo de imagen
//     let mainFolder = 'public/images/';

//     // Añade la subcarpeta según el campo 'type' de la solicitud
//     if ( req.body.type === 'user') {
//       mainFolder += 'users/';
//     } 
//     if ( req.body.type === 'product') {
//       mainFolder += 'products/';
//     }
//     cb(null, mainFolder);
//   },
//   filename: function (req, file, cb) {
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//     const fileExtension = path.extname(file.originalname);
//     cb(null, file.fieldname + '-' + uniqueSuffix + fileExtension);
//   },
// });

// const storageUser = multer.diskStorage({
//   destination: function (req, file, cb) {
//     // Define la carpeta principal según el tipo de imagen
//     let mainFolder = 'public/images/users';
//     cb(null, mainFolder);
//   },
//   filename: function (req, file, cb) {
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//     const fileExtension = path.extname(file.originalname);
//     cb(null, file.fieldname + '-' + uniqueSuffix + fileExtension);
//   },
// });


// const upload = multer({ storage: storage });
// const uploadUser = multer({ storage: storageUser });