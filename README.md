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

## Configuracion del cliente SocketIO
Crear un archivo en src/config/socket.js
```javascript
import { io } from "socket.io-client";

const socket = io("http://localhost:3000");

export default socket;
```
