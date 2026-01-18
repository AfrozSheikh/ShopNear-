// Socket.io client setup for real-time notifications
import { io } from 'socket.io-client';

let socket = null;

export const connectSocket = (userId) => {
  if (socket && socket.connected) {
    return socket;
  }

  // Connect to backend socket server
  socket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000', {
    auth: {
      userId,
    },
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionAttempts: 5,
  });

  socket.on('connect', () => {
    console.log('Socket connected:', socket.id);
  });

  socket.on('disconnect', () => {
    console.log('Socket disconnected');
  });

  socket.on('connect_error', (error) => {
    console.error('Socket connection error:', error);
  });

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const getSocket = () => {
  if (!socket) {
    throw new Error('Socket not initialized. Call connectSocket first.');
  }
  return socket;
};

// Event listeners
export const onNotification = (callback) => {
  const socket = getSocket();
  socket.on('notification', callback);
};

export const onOrderUpdate = (callback) => {
  const socket = getSocket();
  socket.on('order:update', callback);
};

export const onShopVerified = (callback) => {
  const socket = getSocket();
  socket.on('shop:verified', callback);
};

export const onNewOrder = (callback) => {
  const socket = getSocket();
  socket.on('order:new', callback);
};

// Emit events
export const emitTyping = (shopId) => {
  const socket = getSocket();
  socket.emit('typing', { shopId });
};

export const emitStopTyping = (shopId) => {
  const socket = getSocket();
  socket.emit('stop-typing', { shopId });
};
