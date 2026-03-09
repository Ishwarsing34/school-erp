const Submission = require('../models/Submission');
const Student = require('../models/Student');
const Assignment = require('../models/Assignment');


//all submission cntrollers here

const submitAssignment = async (req, res) => {
  try {
    const { assignmentId, fileUrl, submittedText } = req.body;

    if (!assignmentId) {
      return res.status(400).json({ message: 'Assignment ID is required' });
    }

    // take the student details middleware used here so it will verify
    const student = await Student.findOne({ email: req.user.email });
    if (!student) {
      return res.status(404).json({ message: 'Student profile not found. Contact admin.' });
    }

    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) return res.status(404).json({ message: 'Assignment not found' });

    // Chek for duplicate submission
    const existing = await Submission.findOne({ assignmentId, studentId: student._id });
    if (existing) {
      return res.status(400).json({ message: 'You have already submitted this assignment' });
    }

    const now = new Date();
    const status = now > assignment.dueDate ? 'late' : 'submitted';

    const submission = await Submission.create({
      assignmentId,
      studentId: student._id,
      fileUrl: fileUrl || '',
      submittedText: submittedText || '',
      status,
    });

    await submission.populate([
      { path: 'assignmentId', select: 'title className dueDate' },
      { path: 'studentId', select: 'name rollNumber' },
    ]);

    res.status(201).json(submission);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const getSubmissions = async (req, res) => {
  try {
    let filter = {};

    if (req.user.role === 'student') {
      const student = await Student.findOne({ email: req.user.email });
      if (!student) return res.json([]);
      filter.studentId = student._id;
    }

    if (req.query.assignmentId) filter.assignmentId = req.query.assignmentId;

    const submissions = await Submission.find(filter)
      .populate('assignmentId', 'title className dueDate')
      .populate('studentId', 'name rollNumber className')
      .sort({ createdAt: -1 });

    res.json(submissions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//evaluating the submission

const evaluateSubmission = async (req, res) => {
  try {
    const { marks } = req.body;

    if (marks === undefined || marks === null) {
      return res.status(400).json({ message: 'Marks are required' });
    }

    const submission = await Submission.findByIdAndUpdate(
      req.params.id,
      { marks, status: 'evaluated' },
      { new: true }
    )
      .populate('assignmentId', 'title className')
      .populate('studentId', 'name rollNumber');

    if (!submission) return res.status(404).json({ message: 'Submission not found' });

    res.json(submission);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { submitAssignment, getSubmissions, evaluateSubmission };
