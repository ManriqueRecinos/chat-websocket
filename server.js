const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());

app.use(express.static(path.join(__dirname, 'web-build')));


app.get('/', (req, res) => {
    res.send('Servidor corriendo');
    // res.sendFile(path.join(__dirname, 'web-build', 'index.html'));
})

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*', // En producción, reemplaza con tu URL de frontend
    methods: ['GET', 'POST']
  }
});

// Almacén de usuarios conectados
const users = {};

io.on('connection', (socket) => {
  console.log('Usuario conectado:', socket.id);

  // Manejar nuevo usuario
  socket.on('new_user', (username) => {
    users[socket.id] = username;
    io.emit('user_connected', username);
  });

  // Manejar mensajes
  socket.on('send_message', (data) => {
    io.emit('receive_message', {
      ...data,
      userId: socket.id,
      username: users[socket.id]
    });
  });

  // Manejar desconexión
  socket.on('disconnect', () => {
    const username = users[socket.id];
    if (username) {
      io.emit('user_disconnected', username);
      delete users[socket.id];
    }
    console.log('Usuario desconectado:', socket.id);
  });
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Servidor Socket.IO escuchando en el puerto ${PORT}`);
});