const asyncHandler = require('express-async-handler');
const Problem = require('../models/Problem');

const createProblem = asyncHandler(async (req, res) => {
  const { title, description, difficulty, questionType, inputFormat, outputFormat, testCases, tags } = req.body;
  if (!title || !description || !difficulty || !questionType) {
    res.status(400);
    throw new Error('Title, description, difficulty, and question type are required');
  }

  const problem = await Problem.create({
    title,
    description,
    difficulty,
    questionType,
    inputFormat: inputFormat || '',
    outputFormat: outputFormat || '',
    testCases: testCases || [],
    tags: tags || []
  });

  res.status(201).json(problem);
});

const updateProblem = asyncHandler(async (req, res) => {
  const problem = await Problem.findById(req.params.id);
  if (!problem) {
    res.status(404);
    throw new Error('Problem not found');
  }

  const updates = ['title', 'description', 'difficulty', 'questionType', 'inputFormat', 'outputFormat', 'testCases', 'tags'];
  updates.forEach((field) => {
    if (req.body[field] !== undefined) {
      problem[field] = req.body[field];
    }
  });

  const updatedProblem = await problem.save();
  res.json(updatedProblem);
});

const deleteProblem = asyncHandler(async (req, res) => {
  const problem = await Problem.findById(req.params.id);
  if (!problem) {
    res.status(404);
    throw new Error('Problem not found');
  }

  await problem.remove();
  res.json({ message: 'Problem removed' });
});

const getProblems = asyncHandler(async (req, res) => {
  const problems = await Problem.find().select('-testCases').sort({ difficulty: 1, createdAt: -1 });
  res.json(problems);
});

const getProblemById = asyncHandler(async (req, res) => {
  const problem = await Problem.findById(req.params.id).select('-testCases');
  if (problem) {
    res.json(problem);
  } else {
    res.status(404);
    throw new Error('Problem not found');
  }
});

module.exports = { createProblem, updateProblem, deleteProblem, getProblems, getProblemById };
