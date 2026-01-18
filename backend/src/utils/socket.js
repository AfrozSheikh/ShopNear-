const { Server } = require('socket.io');

let io = null;

exports.initializeSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:5173',
      credentials: true,
    },
  });

  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    // Join user room
    socket.on('join', (userId) => {
      socket.join(`user:${userId}`);
      console.log(`User ${userId} joined`);
    });

    // Join shop room (for shop owners)
    socket.on('join-shop', (shopId) => {
      socket.join(`shop:${shopId}`);
      console.log(`Shop ${shopId} room joined`);
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });

  return io;
};

exports.getIO = () => {
  if (!io) {
    throw new Error('Socket.io not initialized');
  }
  return io;
};

// Emit notifications to specific users
exports.emitToUser = (userId, event, data) => {
  const io = exports.getIO();
  io.to(`user:${userId}`).emit(event, data);
};

// Emit to shop owners
exports.emitToShop = (shopId, event, data) => {
  const io = exports.getIO();
  io.to(`shop:${shopId}`).emit(event, data);
};

// Broadcast to all connected clients
exports.broadcastToAll = (event, data) => {
  const io = exports.getIO();
  io.emit(event, data);
};
