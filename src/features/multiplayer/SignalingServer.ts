import { Server } from 'socket.io';
import http from 'http';

const server = http.createServer();
const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

const peers = {};

io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
    delete peers[socket.id];
    io.emit('peer-disconnected', socket.id);
  });

  socket.on('offer', (data) => {
    const { offer, to } = data;
    if (peers[to]) {
      io.to(to).emit('offer', { offer, sender: socket.id });
    }
  });

  socket.on('answer', (data) => {
    const { answer, to } = data;
    if (peers[to]) {
      io.to(to).emit('answer', { answer, sender: socket.id });
    }
  });

  socket.on('ice-candidate', (data) => {
    const { candidate, to } = data;
    if (peers[to]) {
      io.to(to).emit('ice-candidate', { candidate, sender: socket.id });
    }
  });

  peers[socket.id] = socket;
  io.emit('peer-connected', socket.id);
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Signaling server is running on port ${PORT}`);
});
