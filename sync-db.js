const sequelize = require('./config/database');
const { User, Message } = require('./models');
const bcrypt = require('bcryptjs');

const syncDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('Conexión establecida correctamente.');
    
    // Sincronizar modelos
    await sequelize.sync({ force: true }); // Usar { force: true } solo en desarrollo
    console.log('Modelos sincronizados correctamente.');
    
    // Datos de ejemplo (opcional)
    await seedDatabase();
    
  } catch (error) {
    console.error('Error al sincronizar la base de datos:', error);
  } finally {
    await sequelize.close();
  }
};

const seedDatabase = async () => {
  // Crear usuarios de ejemplo
  const users = await User.bulkCreate([
    { username: 'usuario1', email: 'usuario1@example.com', password: 'password123' },
    { username: 'usuario2', email: 'usuario2@example.com', password: 'password123' }
  ]);

  // Crear mensajes de ejemplo
  await Message.bulkCreate([
    { content: 'Hola, ¿cómo estás?', userId: 1, room: 'general' },
    { content: '¡Muy bien, gracias!', userId: 2, room: 'general' }
  ]);
  
  console.log('Datos de ejemplo creados correctamente.');
};

syncDatabase();