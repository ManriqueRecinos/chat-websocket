const express = require('express');
const router = express.Router();
const { upload, cloudinary } = require('../config/cloudinary');

// Ruta para subir imágenes
router.post('/image', upload.single('image'), async (req, res) => {
  try {
    // Si llegamos aquí, la imagen ya fue subida a Cloudinary por el middleware
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No se proporcionó ninguna imagen'
      });
    }

    // Devolver la URL de la imagen subida
    res.status(200).json({
      success: true,
      imageUrl: req.file.path,
      publicId: req.file.filename
    });
  } catch (error) {
    console.error('Error al subir imagen:', error);
    res.status(500).json({
      success: false,
      message: 'Error al procesar la imagen'
    });
  }
});

module.exports = router;
