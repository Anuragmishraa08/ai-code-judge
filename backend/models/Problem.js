const mongoose = require('mongoose');

const testCaseSchema = new mongoose.Schema(
  {
    input: { type: String, required: true },
    expectedOutput: { type: String, required: true },
    hidden: { type: Boolean, default: false }
  },
  { _id: false }
);

const problemSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    difficulty: { type: String, required: true, enum: ['Easy', 'Medium', 'Hard'] },
    questionType: {
      type: String,
      required: true,
      enum: ['Coding', 'Multiple Choice', 'Debugging', 'Algorithm'],
      default: 'Coding'
    },
    inputFormat: { type: String, default: '' },
    outputFormat: { type: String, default: '' },
    testCases: [testCaseSchema],
    tags: [{ type: String }]
  },
  { timestamps: true }
);

module.exports = mongoose.model('Problem', problemSchema);
