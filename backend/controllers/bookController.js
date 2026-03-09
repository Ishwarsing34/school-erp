const Book = require('../models/Book');
const BookIssue = require('../models/BookIssue');


// all controllers of library systems

const addBook = async (req, res) => {
  try {
    const { title, author, isbn, quantity } = req.body;

    if (!title || !author || !isbn || !quantity) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const exists = await Book.findOne({ isbn });
    if (exists) return res.status(400).json({ message: 'Book with this ISBN already exists' });

    const book = await Book.create({ title, author, isbn, quantity, available: quantity });
    res.status(201).json(book);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const getBooks = async (req, res) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 });
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const issueBook = async (req, res) => {
  try {
    const { bookId, studentId, dueDate } = req.body;

    if (!bookId || !studentId || !dueDate) {
      return res.status(400).json({ message: 'bookId, studentId, and dueDate are required' });
    }

    const book = await Book.findById(bookId);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    if (book.available <= 0) return res.status(400).json({ message: 'No copies available' });

    // Checking here if student k pass already book hai ya nhi
    const activeIssue = await BookIssue.findOne({ bookId, studentId, returned: false });
    if (activeIssue) {
      return res.status(400).json({ message: 'Student already has this book issued' });
    }

    const issue = await BookIssue.create({ bookId, studentId, dueDate });

    book.available -= 1;
    await book.save();

    await issue.populate([
      { path: 'bookId', select: 'title author isbn' },
      { path: 'studentId', select: 'name rollNumber' },
    ]);

    res.status(201).json(issue);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const returnBook = async (req, res) => {
  try {
    const issue = await BookIssue.findById(req.params.id);
    if (!issue) return res.status(404).json({ message: 'Issue record not found' });
    if (issue.returned) return res.status(400).json({ message: 'Book already returned' });

    issue.returned = true;
    issue.returnDate = new Date();
    await issue.save();

    // book cnt is incremented here
    await Book.findByIdAndUpdate(issue.bookId, { $inc: { available: 1 } });

    await issue.populate([
      { path: 'bookId', select: 'title author isbn' },
      { path: 'studentId', select: 'name rollNumber' },
    ]);

    res.json(issue);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const getIssues = async (req, res) => {
  try {
    let filter = {};
    if (req.query.studentId) filter.studentId = req.query.studentId;
    //this will show books jo abhi tak returned nhi huye hai
    if (req.query.returned !== undefined) filter.returned = req.query.returned === 'true';

    const issues = await BookIssue.find(filter)
      .populate('bookId', 'title author isbn')
      .populate('studentId', 'name rollNumber className')
      .sort({ createdAt: -1 });

    res.json(issues);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { addBook, getBooks, issueBook, returnBook, getIssues };
