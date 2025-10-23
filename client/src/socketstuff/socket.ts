import { io } from 'socket.io-client';


const socketServerAddress = 'http://localhost:2025';

const socketClient = io(socketServerAddress, {
  autoConnect: false,
});

export default socketClient;
