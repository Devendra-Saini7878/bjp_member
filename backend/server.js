const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "http://localhost:5174", "https://bjp-member-7shc.vercel.app"],
    methods: ["GET", "POST", "PATCH"],
    credentials: true
  }
});

const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:5174", "https://bjp-member-7shc.vercel.app"],
  credentials: true
}));
app.use(express.json());

// Ensure uploads directory exists
const fs = require('fs');
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

app.use('/uploads', express.static(uploadsDir));

// DB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/bjp_grievance')
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log('MongoDB Connection Error:', err));

// Socket.io Connection
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// Pass io to routes
app.set('socketio', io);

// Routes
const grievanceRoutes = require('./routes/grievanceRoutes');
app.use('/api/grievances', grievanceRoutes);

app.get('/api/download-qr', (req, res) => {
  const filePath = path.join(__dirname, '../frontend/public/grievance_qr.png');
  res.download(filePath, 'Grievance_QR_Poster.png');
});

app.get('/', (req, res) => {
  res.send('Apka Sandesh Scindia Tak API is running with Real-time Support...');
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
