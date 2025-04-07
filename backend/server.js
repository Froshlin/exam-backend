require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
const jwt = require('jsonwebtoken');
const authRoutes = require('./api/auth');
const examRoutes = require('./api/exam');
const adminRoutes = require('./api/admin');
const courseRoutes = require('./api/courses');
const questionRoutes = require('./api/questions');
const User = require('./models/User');

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: 'https://exam-frontend-liart.vercel.app', // Allow requests from your Next.js frontend
  credentials: true,
}));
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }, // Set to true if using HTTPS
}));

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Middleware to Verify JWT and Protect Routes
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ message: 'Authentication token required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-jwt-secret');
    req.user = decoded;

    // Check for inactivity (2 hours = 7200 seconds)
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const now = new Date();
    const lastActivity = new Date(user.lastActivity);
    const inactiveTime = (now - lastActivity) / 1000; // Time in seconds

    if (inactiveTime > 7200) { // 2 hours
      return res.status(401).json({ message: 'Session expired due to inactivity' });
    }

    // Update last activity timestamp
    user.lastActivity = now;
    await user.save();

    next();
  } catch (err) {
    res.status(403).json({ message: 'Invalid token' });
  }
};

// Sample Route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Routes
app.use('/api/auth', authRoutes); // Public route (no authentication required)
app.use('/api/exam', authenticateToken, examRoutes);
app.use('/api/admin', authenticateToken, adminRoutes);
app.use('/api/courses', authenticateToken, courseRoutes);
app.use('/api/questions', authenticateToken, questionRoutes);

// Start Server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));