# Chat WebSocket

## Primeras instalaciones
```bash
- npx create-expo-app chat-app
- cd chat-app
- npm install @react-navigation/native @react-navigation/stack socket.io-client
- npm install react-native-gesture-handler react-native-reanimated react-native-screens react-native-safe-area-context
- npm install @react-native-async-storage/async-storage
```

## Creacion de archivo server.js
```bash
- npm init -y
- npm install express socket.io cors
```

## Dependencias necesario
```bash
npm install socket.io-client @react-native-async-storage/async-storage
```
- mkdir config
- touch config/socket.js

## Configuracion del cliente SocketIO
Dentro de config/socket.js agregar:
```javascript
import { io } from 'socket.io-client';

// Cambia esto por tu IP local
const URL = 'http://TU_IP_LOCAL:3000';
export const socket = io(URL, {
  autoConnect: false
});
```

## Ahora crearemos las pantallas necesarias
Creamos la carpeta app/chat y dentro de ella
- index.js
- login.js
Creamos el archivor server.js
- npm init -y
- npm install express socket.io cors

## Dependencias para neon
```bash
npm install pg sequelize pg-hstore dotenv bcryptjs
```
