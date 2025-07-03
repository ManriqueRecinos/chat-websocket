const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const path = require('path');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Importar modelos
const { User, Message } = require('./models');

// Importar rutas
const authRoutes = require('./routes/auth');
const uploadRoutes = require('./routes/upload');

const app = express();
app.use(cors());
app.use(express.json());

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Usar rutas de autenticación
app.use('/api/auth', authRoutes);
app.use('/api/upload', uploadRoutes);

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

  // Manejar conexión de nuevo usuario
  socket.on('new_user', async (data) => {
    try {
      // Verificar si recibimos un objeto con token o solo un username
      const username = typeof data === 'object' ? data.username : data;
      const token = typeof data === 'object' ? data.token : null;
      
      let user;
      
      // Si hay token, verificarlo
      if (token) {
        try {
          // Verificar el token JWT
          const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_key');
          
          // Buscar usuario por ID desde el token
          user = await User.findByPk(decoded.id);
          
          if (!user) {
            return socket.emit('error', 'Usuario no encontrado');
          }
          
          console.log(`Usuario autenticado con token: ${user.username}`);
        } catch (tokenError) {
          console.error('Error al verificar token:', tokenError);
          return socket.emit('error', 'Token inválido');
        }
      } else {
        // Modo de compatibilidad: buscar por nombre de usuario
        user = await User.findOne({ where: { username } });
        
        if (!user) {
          return socket.emit('error', 'Usuario no encontrado');
        }
        
        console.log(`Usuario autenticado sin token: ${user.username}`);
      }
      
      // Guardar usuario en el socket
      socket.user = user;
      
      // Notificar al usuario que se ha conectado
      socket.emit('user_joined', {
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
      if (!socket.user) {
        return socket.emit('error', 'Debes iniciar sesión para enviar mensajes');
      }

      // Crear mensaje en la base de datos con soporte para imágenes
      const message = await Message.create({
        content: data.content || '',
        imageUrl: data.imageUrl || null,
        messageType: data.messageType || 'text',
        room: data.room || 'general',
        UserId: socket.user.id
      });

      // Cargar el usuario asociado al mensaje
      const messageWithUser = await Message.findByPk(message.id, {
        include: [User]
      });

      // Emitir mensaje a todos los usuarios (sin filtrar por sala por ahora)
      io.emit('receive_message', messageWithUser);
      
      // Registrar el tipo de mensaje en la consola
      console.log(`Mensaje tipo ${data.messageType} enviado por ${socket.user.username}`);
      if (data.imageUrl) {
        console.log('Imagen incluida en el mensaje');
      }
    } catch (error) {
      console.error('Error al enviar mensaje:', error);
      socket.emit('error', 'Error al enviar el mensaje');
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
app.get('/api/test', (req, res) => {
  res.json({ message: 'API funcionando correctamente' });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
  console.log(`Accede a http://10.10.15.6:${PORT} para probar la aplicación`);
});