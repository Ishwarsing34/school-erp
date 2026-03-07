const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema(
  {
    assignmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Assignment', required: true },
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    fileUrl: { type: String, default: '' },
    submittedText: { type: String, default: '' },
    marks: { type: Number, default: null },
    status: {
      type: String,
      enum: ['submitted', 'evaluated', 'late'],
      default: 'submitted',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Submission', submissionSchema);
