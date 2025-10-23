import express from 'express';
import { readFileSync } from 'fs';
import { Server as SocketIOServer } from 'socket.io';
import cors from 'cors';
import {createServer} from 'http'

interface RTCSessionDescription {
  type: 'offer' | 'answer' | 'pranswer' | 'rollback';
  sdp: string;
}

interface RTCIceCandidate {
  candidate: string;
  sdpMLineIndex?: number;
  sdpMid?: string;
}

interface ServerToClientEvents {
  message: (data: { message: string; timestamp: number; user: string }) => void;
  userJoined: (data: { user: string; timestamp: number }) => void;
  userLeft: (data: { user: string; timestamp: number }) => void;
  offer: (data: { offer: RTCSessionDescription; from: string }) => void;
  answer: (data: { answer: RTCSessionDescription; from: string }) => void;
  iceCandidate: (data: { candidate: RTCIceCandidate; from: string }) => void;
}

interface ClientToServerEvents {
  message: (data: { message: string; user: string }) => void;
  joinRoom: (data: { room: string; user: string }) => void;
  leaveRoom: (data: { room: string; user: string }) => void;
  offer: (data: { offer: RTCSessionDescription; to: string; room: string }) => void;
  answer: (data: { answer: RTCSessionDescription; to: string; room: string }) => void;
  iceCandidate: (data: { candidate: RTCIceCandidate; to: string; room: string }) => void;
}

interface InterServerEvents {
  ping: () => void;
}

interface SocketData {
  user: string;
  room: string;
}

const app = express();
const PORT =2025;

app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true
}));

app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    message: 'Socket.IO server is running'
  });
});

let httpsServer = createServer(app);

const io = new SocketIOServer(
  httpsServer,
  {
    cors: {
      origin: process.env.CLIENT_URL || "http://localhost:5173",
      methods: ["GET", "POST"],
      credentials: true
    }
  }
);

const connectedUsers = new Map<string, { socketId: string; room: string; user: string }>();
const rooms = new Map<string, Set<string>>();

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on('cts-message', (data) => {
    
    console.log("message from client", data);
  });

  socket.on('joinRoom', (data) => {
    const { room, user } = data;
    
    if (socket.data.room) {
      socket.leave(socket.data.room);
      const roomUsers = rooms.get(socket.data.room);
      if (roomUsers) {
        roomUsers.delete(socket.id);
        if (roomUsers.size === 0) {
          rooms.delete(socket.data.room);
        }
      }
    }

    socket.join(room);
    socket.data.room = room;
    socket.data.user = user;

    connectedUsers.set(socket.id, { socketId: socket.id, room, user });
    
    if (!rooms.has(room)) {
      rooms.set(room, new Set());
    }
    rooms.get(room)!.add(socket.id);

    socket.to(room).emit('userJoined', {
      user,
      timestamp: Date.now()
    });

    console.log(`User ${user} joined room ${room}`);
  });

  socket.on('leaveRoom', (data) => {
    const { room, user } = data;
    
    socket.leave(room);
    
    connectedUsers.delete(socket.id);
    const roomUsers = rooms.get(room);
    if (roomUsers) {
      roomUsers.delete(socket.id);
      if (roomUsers.size === 0) {
        rooms.delete(room);
      }
    }

    socket.to(room).emit('userLeft', {
      user,
      timestamp: Date.now()
    });

    console.log(`User ${user} left room ${room}`);
  });

  socket.on('message', (data) => {
    const { message, user } = data;
    const room = socket.data.room;
    
    if (room) {
      socket.to(room).emit('message', {
        message,
        user,
        timestamp: Date.now()
      });
    }
  });

  socket.on('offer', (data) => {
    const { offer, to, room } = data;
    socket.to(to).emit('offer', {
      offer,
      from: socket.data.user || socket.id
    });
  });

  socket.on('answer', (data) => {
    const { answer, to, room } = data;
    socket.to(to).emit('answer', {
      answer,
      from: socket.data.user || socket.id
    });
  });

  socket.on('iceCandidate', (data) => {
    const { candidate, to, room } = data;
    socket.to(to).emit('iceCandidate', {
      candidate,
      from: socket.data.user || socket.id
    });
  });

  socket.on('disconnect', () => {
    const userData = connectedUsers.get(socket.id);
    if (userData) {
      const { room, user } = userData;
      
      socket.to(room).emit('userLeft', {
        user,
        timestamp: Date.now()
      });

      connectedUsers.delete(socket.id);
      const roomUsers = rooms.get(room);
      if (roomUsers) {
        roomUsers.delete(socket.id);
        if (roomUsers.size === 0) {
          rooms.delete(room);
        }
      }

      console.log(`User ${user} disconnected from room ${room}`);
    }
  });
});

httpsServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  httpsServer.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  httpsServer.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

export default app;
