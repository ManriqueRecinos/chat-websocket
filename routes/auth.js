const express = require('express');
const router = express.Router();
const { User } = require('../models');
const { Op } = require('sequelize');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const bcrypt = require('bcryptjs');

// Ruta para registrar un nuevo usuario
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validaciones básicas
    if (!username || !email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Todos los campos son obligatorios' 
      });
    }

    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ 
      where: { 
        [Op.or]: [
          { username },
          { email }
        ]
      } 
    });

    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        message: 'El nombre de usuario o correo electrónico ya está en uso' 
      });
    }

    // Crear el nuevo usuario
    const newUser = await User.create({
      username,
      email,
      password // El hook beforeCreate se encargará de hashear la contraseña
    });

    // Generar token JWT
    const token = jwt.sign(
      { id: newUser.id, username: newUser.username },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Responder con los datos del usuario (sin la contraseña)
    res.status(201).json({
      success: true,
      message: 'Usuario registrado correctamente',
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        avatar: newUser.avatar
      },
      token
    });

  } catch (error) {
    console.error('Error en el registro:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al registrar el usuario' 
    });
  }
});

// Ruta para iniciar sesión
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validar datos
    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Nombre de usuario y contraseña son obligatorios' });
    }

    // Buscar el usuario
    const user = await User.findOne({ where: { username } });

    // Verificar si el usuario existe
    if (!user) {
      return res.status(401).json({ success: false, message: 'Credenciales inválidas' });
    }

    // Verificar la contraseña
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: 'Credenciales inválidas' });
    }

    // Generar token JWT
    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Responder con los datos del usuario y el token
    res.json({
      success: true,
      message: 'Inicio de sesión exitoso',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        avatar: user.avatar
      },
      token
    });
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    res.status(500).json({ success: false, message: 'Error al iniciar sesión' });
  }
});

module.exports = router;
