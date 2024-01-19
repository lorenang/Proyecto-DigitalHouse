const express = require('express');
const app = express();
const multer = require('multer');
const path = require('path');
const mainRoutes = require('./routes/mainRoutes');
const mainController = require('./controllers/mainController');
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// Configuración de Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/images/'); // Carpeta donde se guardarán las imágenes
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const fileExtension = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + fileExtension);
  },
});
const upload = multer({ storage: storage });
app.post('/productos/crear', upload.single('productImage'), (req, res) => {
  console.log('Procesando creación de producto...');
  mainController.procesarCreate(req, res);
});
app.post('/producto/editar/:id', upload.single('productImage'), (req, res) => {
  console.log('Procesando edición de producto...');
  mainController.procesarEdit(req, res);
});
app.post('/producto/eliminar/:id', mainController.procesarEliminar);

app.use(express.static(path.join(__dirname, 'public')));

// Configurar EJS como motor de plantillas
app.set('view engine', 'ejs');
app.use('/', mainRoutes);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`click para dirigirte al sitio: http://localhost:${PORT}/`);
});