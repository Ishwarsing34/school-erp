const express = require('express');
const router = express.Router();
const { createAssignment, getAssignments, getAssignmentById } = require('../controllers/assignmentController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/', protect, authorize('teacher'), createAssignment);
router.get('/', protect, authorize('admin', 'teacher', 'student'), getAssignments);
router.get('/:id', protect, authorize('admin', 'teacher', 'student'), getAssignmentById);

module.exports = router;
