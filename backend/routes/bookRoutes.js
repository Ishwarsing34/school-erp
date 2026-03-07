const express = require('express');
const router = express.Router();
const { addBook, getBooks, issueBook, returnBook, getIssues } = require('../controllers/bookController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/', protect, authorize('admin'), addBook);
router.get('/', protect, getBooks);
router.post('/issue', protect, authorize('admin'), issueBook);
router.put('/return/:id', protect, authorize('admin'), returnBook);
router.get('/issues', protect, authorize('admin', 'student'), getIssues);

module.exports = router;
