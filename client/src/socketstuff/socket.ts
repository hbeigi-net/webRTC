import { io } from 'socket.io-client';

export const user = 'user-'+ Math.random().toString(36).substring(2, 15);
const socketServerAddress = 'http://192.168.1.67:2025';

const socketClient = io(socketServerAddress, {
  autoConnect: false,
  auth: {
    user: user,
  }, 
  
});

export default socketClient;
