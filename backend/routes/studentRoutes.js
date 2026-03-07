const express = require('express');
const router = express.Router();
const { createStudent, getStudents, getStudentById, updateStudent } = require('../controllers/studentController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/', protect, authorize('admin'), createStudent);
router.get('/', protect, authorize('admin', 'teacher'), getStudents);
router.get('/:id', protect, authorize('admin', 'teacher'), getStudentById);
router.put('/:id', protect, authorize('admin'), updateStudent);

module.exports = router;
