const multer= require('multer');
const path = require ('path');


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      // Define la carpeta principal según el tipo de imagen
      let mainFolder = 'public/images/';
  
      // Añade la subcarpeta según el campo 'type' de la solicitud
      if ( req.body.type === 'user') {
        mainFolder += 'users/';
      } 
      if ( req.body.type === 'product') {
        mainFolder += 'products/';
      }
      cb(null, mainFolder);
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const fileExtension = path.extname(file.originalname);
      cb(null, file.fieldname + '-' + uniqueSuffix + fileExtension);
    },
  });
  
  const storageUser = multer.diskStorage({
    destination: function (req, file, cb) {
      // Define la carpeta principal según el tipo de imagen
      let mainFolder = 'public/images/users/';
      cb(null, mainFolder);
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const fileExtension = path.extname(file.originalname);
      cb(null, file.fieldname + '-' + uniqueSuffix + fileExtension);
    },
  });

  module.exports= upload = multer({ storage: storage });
  module.exports= uploadUser = multer({ storage: storageUser });