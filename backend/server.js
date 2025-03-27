require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Import routes
const authRoutes = require('./api/auth');
const examRoutes = require('./api/exam');
const adminRoutes = require('./api/admin');
const courseRoutes = require('./api/courses');
const questionRoutes = require('./api/questions');  

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Enhanced MongoDB Connection
const connectDB = async () => {
  try {
    console.log('Attempting to connect to MongoDB...');
    console.log('MONGO_URI:', process.env.MONGO_URI ? 'Present' : 'NOT SET');
    
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    console.log('Connected to MongoDB successfully');
  } catch (error) {
    console.error('MongoDB connection FAILED:', error);
    // Log the full error details
    console.error('Error details:', {
      message: error.message,
      name: error.name,
      code: error.code
    });
    
    // In a serverless environment, we don't want to call process.exit()
    // Instead, we'll just log the error
  }
};

// Call the connection function
connectDB();

// Sample Route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/exam', examRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/questions', questionRoutes);

// Test Route
app.get("/api/test", (req, res) => {
  res.json({ message: "Backend is working!" });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err);
  res.status(500).json({
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'production' ? {} : err.message
  });
});

// Catch-all route handler
app.use((req, res) => {
  res.status(404).json({ 
    message: 'Route Not Found',
    path: req.path 
  });
});

// Export for Vercel serverless functions
module.exports = app;