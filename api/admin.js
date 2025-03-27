// Backend - Admin Routes

const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Question = require('../models/Question');
const authMiddleware = require('../middleware/authMiddleware'); // Fixed incorrect casing
const router = express.Router();

// Middleware to check if user is admin
const isAdmin = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user || user.role !== 'admin') {
            return res.status(403).json({ msg: 'Access denied. Admins only.' });
        }
        next();
    } catch (err) {
        console.error("Admin check error:", err);
        res.status(500).json({ msg: 'Server error' });
    }
};

// Admin login
router.post('/login', async (req, res) => {
    const { matricNumber, password } = req.body;
    
    try {
        let user = await User.findOne({ matricNumber });

        if (!user) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        if (user.role !== 'admin') {
            return res.status(403).json({ msg: 'Access denied. Admins only.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user.id, role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });

    } catch (err) {
        res.status(500).send('Server error');
    }
});


// Add Exam Questions (Admin Only)
router.post('/questions', authMiddleware, isAdmin, async (req, res) => {
    const { courseId, text, options, correctAnswer } = req.body;
    try {
        const question = new Question({ courseId, text, options, correctAnswer });
        await question.save();
        res.json({ msg: 'Question added successfully' });
    } catch (err) {
        console.error("Error adding question:", err);
        res.status(500).send('Server error');
    }
});

module.exports = router;
