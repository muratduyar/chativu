const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000', // Frontend URL'si
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  console.log('Bir kullanıcı bağlandı:', socket.id);

  // Odaya katılma
  socket.on('joinRoom', (roomId) => {
    socket.join(roomId);
    console.log(`Kullanıcı ${socket.id}, ${roomId} odasına katıldı.`);
  });

  // Mesaj gönderme
  socket.on('sendMessage', (data) => {
    const { roomId, message } = data;
    io.to(roomId).emit('message', { sender: socket.id, message });
  });

  // Video kontrolü
  socket.on('play', (roomId) => {
    io.to(roomId).emit('play');
  });

  socket.on('pause', (roomId) => {
    io.to(roomId).emit('pause');
  });

  socket.on('seek', (data) => {
    const { roomId, time } = data;
    io.to(roomId).emit('seek', time);
  });

  // Bağlantı kesildiğinde
  socket.on('disconnect', () => {
    console.log('Bir kullanıcı ayrıldı:', socket.id);
  });
});

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`Socket.io sunucusu ${PORT} portunda çalışıyor...`);
});