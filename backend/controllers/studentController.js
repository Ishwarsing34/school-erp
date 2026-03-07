const Student = require('../models/Student');

// @desc    Create a student
// @route   POST /api/students
// @access  Admin
const createStudent = async (req, res) => {
  try {
    const { name, email, className, rollNumber, parentName, parentContact } = req.body;

    if (!name || !email || !className || !rollNumber || !parentName || !parentContact) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const exists = await Student.findOne({ $or: [{ email }, { rollNumber }] });
    if (exists) {
      return res.status(400).json({ message: 'Student with this email or roll number already exists' });
    }

    const student = await Student.create({ name, email, className, rollNumber, parentName, parentContact });
    res.status(201).json(student);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all students
// @route   GET /api/students
// @access  Admin, Teacher
const getStudents = async (req, res) => {
  try {
    const students = await Student.find().sort({ createdAt: -1 });
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get student by ID
// @route   GET /api/students/:id
// @access  Admin, Teacher
const getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.json(student);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update student
// @route   PUT /api/students/:id
// @access  Admin
const updateStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.json(student);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createStudent, getStudents, getStudentById, updateStudent };
