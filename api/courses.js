const express = require('express');
const router = express.Router();

const courses = [
  { _id: 'CSC401', name: 'Computer Programming' },
  { _id: 'CSC419', name: 'Software Engineering' },
  { _id: 'CSC310', name: 'Data Structures' },
  { _id: 'GNS352', name: 'Communication Skills' },
  { _id: 'MTH201', name: 'Linear Algebra' },
  { _id: 'MTH203', name: 'Calculus' }
];

// GET all courses
router.get('/', (req, res) => {
  try {
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET a single course by ID
router.get('/:id', (req, res) => {
  const course = courses.find(c => c._id === req.params.id);
  
  if (course) {
    res.json(course);
  } else {
    res.status(404).json({ message: 'Course not found' });
  }
});

module.exports = router;