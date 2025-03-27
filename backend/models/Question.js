const mongoose = require('mongoose');

// Custom validator to ensure 4 options
function arrayLimit(val) {
  return val.length === 4;
}

// Question Schema
const QuestionSchema = new mongoose.Schema({
  courseId: {
    type: String,
    required: true,
    trim: true
  },
  text: {
    type: String,
    required: true,
    trim: true
  },
  options: {
    type: [String],
    required: true,
    validate: [arrayLimit, 'Must have exactly 4 options']
  },
  correctAnswer: {
    type: String,
    required: true,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Question', QuestionSchema);