const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
require('dotenv').config();

const { syncDatabase } = require('./models');
const authRoutes = require('./routes/auth');
const tripRoutes = require('./routes/trips');
const checkInRoutes = require('./routes/checkIns');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.CORS_ORIGIN?.split(',') || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  }
});

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(',') || '*'
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Make io accessible to routes
app.io = io;

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  socket.on('joinTrip', (tripId) => {
    socket.join(`trip-${tripId}`);
    console.log(`Socket ${socket.id} joined trip ${tripId}`);
  });

  socket.on('leaveTrip', (tripId) => {
    socket.leave(`trip-${tripId}`);
    console.log(`Socket ${socket.id} left trip ${tripId}`);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Routes
app.get('/', (req, res) => {
  res.json({
    message: 'Frete Inteligente API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      trips: '/api/trips',
      checkIns: '/api/checkins'
    }
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/checkins', checkInRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

const PORT = process.env.PORT || 3000;

// Initialize database and start server
const startServer = async () => {
  try {
    await syncDatabase();
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Socket.IO server ready for real-time connections`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

module.exports = { app, io };
