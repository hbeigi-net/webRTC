import express from 'express';
import { readFileSync } from 'fs';
import { Server as SocketIOServer } from 'socket.io';
import cors from 'cors';
import { createServer } from 'http'

const app = express();
const PORT = 2025;

app.use(cors({
  origin: ["https://localhost:5173", "http://localhost:5173", "https://192.168.1.67:5173", "http://192.168.1.67:5173"],
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
      origin: ["https://localhost:5173", "http://localhost:5173", "https://192.168.1.67:5173", "http://192.168.1.67:5173"],
      methods: ["GET", "POST"],
      credentials: true
    }
  }
);


const connectedUsers = new Map<string, string>();
let offers: Room[] = [];
io.on('connection', (socket) => {
  const userId = socket.handshake.auth.user;

  console.log(`socket client connected: ${socket.id}`);
  connectedUsers.set(userId, socket.id);

  socket.on('cts-message', (data) => {
    const { message, user } = data;

    socket.emit('stc-message', {
      message,
      user,
      timestamp: Date.now()
    });
  });

  socket.on('cts-new-offer', (data) => {
    const { offer, user } = data;
    offers = offers.filter(item => item.offererUserId !== user);
    const room: Room = {
      offererUserId: user,
      offer,
      offererIceCandidates: [],
      answererUserId: null,
      answer: null,
      answererIceCandidates: []
    };

    offers.push(room);

    io.emit('stc-new-offer', { offer: room });
  });

  socket.on('cts-answer-offer', (data, callback) => {
    const {

    } = data;
  })

  socket.on('cts-ice-candidate', (data) => {
    const {
      ICECandidate,
      username,
      isOfferer
    } = data;

    if (isOfferer) {
      const currentOffer = offers.find(off => off.offererUserId === username);
      if (currentOffer) {
        currentOffer.offererIceCandidates.push(ICECandidate);

        if (currentOffer.answererUserId) {
          const answererSocketId = connectedUsers.get(currentOffer.answererUserId);

          if (answererSocketId) {
            io.to(answererSocketId).emit('stc-ice-candidate', { ICECandidate })
          }
        }
      }
    } else {
      const targetedOffer = offers.find(off => off.answererUserId === username);
      if (targetedOffer) {

      }
    }
    io.emit('stc-ice-candidate', { ICECandidate, username, isOfferer });
  });


  socket.on('cts-answer-offer', (data, callback) => {
    const { room }: { room: Room } = data;
    const { offererUserId } = room;

    const offererSocketId = connectedUsers.get(offererUserId);

    if (!offererSocketId) {
      console.log("No matching socket")
      return;
    }

    const offerWhichIsAnswered = offers.find(off => off.offererUserId === offererUserId);
    if (!offerWhichIsAnswered) {
      console.log("No offer found")
      return;
    }

    callback({
      offererICECandidates: offerWhichIsAnswered.offererIceCandidates,
    })

    offerWhichIsAnswered.answererUserId = userId;
    offerWhichIsAnswered.answer = room.answer;

    socket.to(offererSocketId).emit('stc-answer-to-offerer', {
      updatedOffer: offerWhichIsAnswered,
    });
  });

  socket.on('disconnect', () => {
    connectedUsers.delete(socket.handshake.auth.user);
    offers = offers.filter(item => item.offererUserId !== socket.handshake.auth.user);
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
