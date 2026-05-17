const mongoose = require('mongoose');

const testResultSchema = new mongoose.Schema(
  {
    input: { type: String, required: true },
    expectedOutput: { type: String, required: true },
    actualOutput: { type: String },
    passed: { type: Boolean, required: true },
    error: { type: String, default: '' }
  },
  { _id: false }
);

const submissionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    problem: { type: mongoose.Schema.Types.ObjectId, ref: 'Problem', required: true },
    language: { type: String, required: true, enum: ['javascript', 'python'] },
    code: { type: String, required: true },
    status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
    passedCount: { type: Number, default: 0 },
    totalCount: { type: Number, default: 0 },
    testResults: [testResultSchema],
    executionOutput: { type: String, default: '' },
    aiFeedback: { type: String, default: '' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Submission', submissionSchema);
