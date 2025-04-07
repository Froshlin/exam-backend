// models/Course.js
const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Course", CourseSchema);