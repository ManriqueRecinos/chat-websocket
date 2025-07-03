const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Configuración de Cloudinary
cloudinary.config({
  cloud_name: 'ds1gk7zla',
  api_key: '565965692788896',
  api_secret: 'Ti0iiLxrYCRbBaY1V-AdYDONirM'
});

// Configuración del almacenamiento para imágenes de chat
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'chat-app',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif'],
    transformation: [{ width: 800, crop: 'limit' }]
  }
});

// Middleware para subir imágenes
const upload = multer({ storage: storage });

module.exports = {
  cloudinary,
  upload
};
