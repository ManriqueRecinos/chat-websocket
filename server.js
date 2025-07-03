const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Importar modelos
const { User, Message } = require('./models');

// Importar rutas
const authRoutes = require('./routes/auth');

const app = express();
app.use(cors());
app.use(express.json());

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Usar rutas de autenticación
app.use('/api/auth', authRoutes);

const server = http.createServer(app);

// Configuración de Socket.IO
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Almacén temporal de usuarios conectados
const users = {};

// Manejo de conexiones de Socket.IO
io.on('connection', async (socket) => {
  console.log('Nuevo cliente conectado:', socket.id);

  // Manejar nuevo usuario
  socket.on('new_user', async (username) => {
    try {
      const user = await User.findOne({ where: { username } });
      if (!user) {
        return socket.emit('error', 'Usuario no encontrado');
      }
      
      // Guardar referencia del usuario
      users[socket.id] = {
        id: user.id,
        username: user.username
      };
      
      // Notificar a todos que el usuario se ha unido
      io.emit('user_joined', {
        userId: user.id,
        username: user.username
      });
      
      // Notificar a todos los usuarios
      io.emit('user_connected', {
        userId: user.id,
        username: user.username
      });
      
      // Enviar historial de mensajes
      const messages = await Message.findAll({
        include: [{
          model: User,
          attributes: ['id', 'username', 'avatar']
        }],
        order: [['createdAt', 'ASC']],
        limit: 50
      });
      
      socket.emit('message_history', messages);
      
    } catch (error) {
      console.error('Error en new_user:', error);
      socket.emit('error', 'Error al conectar usuario');
    }
  });

  // Manejar mensajes
  socket.on('send_message', async (data) => {
    try {
      const { content, room = 'general' } = data;
      const user = users[socket.id];
      
      if (!user) {
        return socket.emit('error', 'No autenticado');
      }

      // Guardar mensaje en la base de datos
      const message = await Message.create({
        content,
        room,
        userId: user.id
      });

      // Obtener el mensaje con los datos del usuario
      const messageWithUser = await Message.findByPk(message.id, {
        include: [{
          model: User,
          attributes: ['id', 'username', 'avatar']
        }]
      });

      // Enviar a todos los clientes
      io.emit('receive_message', messageWithUser);
      
    } catch (error) {
      console.error('Error en send_message:', error);
      socket.emit('error', 'Error al enviar mensaje');
    }
  });

  // Manejar desconexión
  socket.on('disconnect', () => {
    const user = users[socket.id];
    if (user) {
      io.emit('user_disconnected', {
        userId: user.id,
        username: user.username
      });
      delete users[socket.id];
    }
    console.log('Cliente desconectado:', socket.id);
  });
});

// Ruta de prueba
app.get('/api/status', (req, res) => {
  res.json({ status: 'Servidor funcionando correctamente' });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
  console.log(`Accede a http://10.10.15.6:${PORT} para probar la aplicación`);
});