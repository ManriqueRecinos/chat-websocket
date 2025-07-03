const express = require('express');
const router = express.Router();
const { Connection, User } = require('../models');
const connectionController = require('../controllers/connectionController');

// Obtener todas las conexiones
router.get('/', async (req, res) => {
  try {
    const connections = await connectionController.getAllConnections();
    res.json(connections);
  } catch (error) {
    console.error('Error al obtener conexiones:', error);
    res.status(500).json({ error: 'Error al obtener conexiones' });
  }
});

// Obtener conexiones de un usuario específico
router.get('/user/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const connections = await connectionController.getUserConnectionHistory(userId);
    res.json(connections);
  } catch (error) {
    console.error('Error al obtener conexiones del usuario:', error);
    res.status(500).json({ error: 'Error al obtener conexiones del usuario' });
  }
});

module.exports = router;
