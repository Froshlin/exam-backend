require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./api/auth');
const examRoutes = require('./api/exam');
const adminRoutes = require('./api/admin');
const courseRoutes = require('./api/courses');
const questionRoutes = require('./api/questions');  

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

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

// // Start Server
// const PORT = process.env.PORT || 8000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

app.get("/api/test", (req, res) => {
  res.json({ message: "Backend is working!" });
});

// Export for Vercel serverless functions
module.exports = app;
