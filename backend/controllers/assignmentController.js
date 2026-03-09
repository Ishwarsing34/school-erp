const Assignment = require('../models/Assignment');


//my assignment related controllers

const createAssignment = async (req, res) => {
  try {
    const { title, description, className, dueDate } = req.body;

    if (!title || !description || !className || !dueDate) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const assignment = await Assignment.create({
      title,
      description,
      className,
      dueDate,
      teacherId: req.user._id,
    });

    await assignment.populate('teacherId', 'name email');
    res.status(201).json(assignment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const getAssignments = async (req, res) => {
  try {
    const filter = {};
    // Students can filter by their class
    if (req.query.className) filter.className = req.query.className;
    // Teachers see only their assignments
    if (req.user.role === 'teacher') filter.teacherId = req.user._id;

    const assignments = await Assignment.find(filter)
      .populate('teacherId', 'name email')
      .sort({ createdAt: -1 });

    res.json(assignments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const getAssignmentById = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id).populate('teacherId', 'name email');
    if (!assignment) return res.status(404).json({ message: 'Assignment not found' });
    res.json(assignment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createAssignment, getAssignments, getAssignmentById };
