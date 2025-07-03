import { io } from 'socket.io-client';

const URL = 'http://10.10.15.6:3000';
export const socket = io(URL, {
  autoConnect: false
});