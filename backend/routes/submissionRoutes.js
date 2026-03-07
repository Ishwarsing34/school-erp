const express = require('express');
const router = express.Router();
const { submitAssignment, getSubmissions, evaluateSubmission } = require('../controllers/submissionController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/', protect, authorize('student'), submitAssignment);
router.get('/', protect, authorize('admin', 'teacher', 'student'), getSubmissions);
router.put('/:id', protect, authorize('teacher'), evaluateSubmission);

module.exports = router;
