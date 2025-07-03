const { Connection, User, Sequelize } = require('../models');
const Op = Sequelize.Op;

// Registrar una nueva conexión
const registerConnection = async (userId) => {
  try {
    // Crear un nuevo registro de conexión con fecha y hora actual
    const now = new Date();
    const connection = await Connection.create({
      userId,
      connectionTime: now,
      status: 'connected'
    });
    
    console.log(`Conexión registrada para usuario ID: ${userId} a las ${now.toISOString()}`);
    return connection;
  } catch (error) {
    console.error('Error al registrar conexión:', error);
    throw error;
  }
};

// Registrar una desconexión
const registerDisconnection = async (userId) => {
  try {
    // Buscar la conexión más reciente del usuario por connectionTime
    const latestConnection = await Connection.findOne({
      where: {
        userId,
        disconnectionTime: null // Solo buscar conexiones sin fecha de desconexión
      },
      order: [['connectionTime', 'DESC']], // Ordenar por connectionTime descendente (más reciente primero)
      limit: 1 // Limitar a 1 resultado (el más reciente)
    });
    
    if (latestConnection) {
      // Obtener la fecha y hora actual
      const now = new Date();
      
      // Actualizar con la hora de desconexión
      latestConnection.disconnectionTime = now;
      latestConnection.status = 'disconnected';
      await latestConnection.save();
      
      console.log(`Desconexión registrada para usuario ID: ${userId} a las ${now.toISOString()}`);
      console.log(`Duración de la sesión: ${Math.floor((now - latestConnection.connectionTime) / 1000)} segundos`);
      return latestConnection;
    } else {
      console.log(`No se encontró conexión activa para usuario ID: ${userId}`);
      return null;
    }
  } catch (error) {
    console.error('Error al registrar desconexión:', error);
    throw error;
  }
};

// Obtener historial de conexiones de un usuario
const getUserConnectionHistory = async (userId) => {
  try {
    const connections = await Connection.findAll({
      where: { userId },
      order: [['createdAt', 'DESC']],
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'username']
      }]
    });
    
    return connections;
  } catch (error) {
    console.error('Error al obtener historial de conexiones:', error);
    throw error;
  }
};

// Obtener todas las conexiones
const getAllConnections = async () => {
  try {
    const connections = await Connection.findAll({
      order: [['createdAt', 'DESC']],
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'username']
      }]
    });
    
    return connections;
  } catch (error) {
    console.error('Error al obtener todas las conexiones:', error);
    throw error;
  }
};

module.exports = {
  registerConnection,
  registerDisconnection,
  getUserConnectionHistory,
  getAllConnections
};
