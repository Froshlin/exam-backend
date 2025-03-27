const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctOption: { type: String, required: true }
});

const examSchema = new mongoose.Schema({
  courseId: { type: String, required: true },
  questions: [questionSchema]
});

const Exam = mongoose.model('Exam', examSchema);

module.exports = Exam;
