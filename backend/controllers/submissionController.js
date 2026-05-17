const asyncHandler = require('express-async-handler');
const Problem = require('../models/Problem');
const Submission = require('../models/Submission');
const User = require('../models/User');
const { executeCode } = require('../services/codeExecutionService');
const { analyzeCode } = require('../services/aiService');

const submitSolution = asyncHandler(async (req, res) => {
  const { problemId, code, language } = req.body;
  if (!problemId || !code || !language) {
    res.status(400);
    throw new Error('Problem ID, code, and language are required');
  }

  const problem = await Problem.findById(problemId);
  if (!problem) {
    res.status(404);
    throw new Error('Problem not found');
  }

  const submission = await Submission.create({
    user: req.user._id,
    problem: problem._id,
    language,
    code,
    status: 'pending',
    totalCount: problem.testCases.length
  });

  let passedCount = 0;
  const results = [];

  for (const testCase of problem.testCases) {
    const execution = await executeCode({
      code,
      language,
      input: testCase.input,
      timeoutMs: 5000
    });

    const passed = !execution.timedOut && execution.stderr.length === 0 && execution.stdout === testCase.expectedOutput.trim();
    const visible = !testCase.hidden;

    if (passed) passedCount += 1;

    results.push({
      hidden: Boolean(testCase.hidden),
      passed,
      input: visible ? testCase.input : null,
      expectedOutput: visible ? testCase.expectedOutput : null,
      actualOutput: visible ? execution.stdout || '' : '',
      error: visible ? (execution.timedOut ? 'Execution timed out' : execution.stderr || '') : ''
    });
  }

  const status = passedCount === problem.testCases.length ? 'completed' : 'failed';
  const aiAnalysis = await analyzeCode({
    code,
    language,
    problemTitle: problem.title,
    problemDescription: problem.description
  });

  submission.passedCount = passedCount;
  submission.totalCount = problem.testCases.length;
  submission.testResults = results;
  submission.status = status;
  submission.executionOutput = results.map((r) => `${r.passed ? 'PASS' : 'FAIL'}: ${r.actualOutput}`).join('\n');
  submission.aiFeedback = `${aiAnalysis.summary}\nComplexity: ${aiAnalysis.complexityEstimate}\nSuggestion: ${aiAnalysis.suggestion}\nHint: ${aiAnalysis.hint}`;
  await submission.save();

  if (status === 'completed') {
    const user = await User.findById(req.user._id);
    const solvedCount = user.solvedProblems.map((id) => id.toString()).includes(problem._id.toString());
    if (!solvedCount) {
      user.solvedProblems.push(problem._id);
      const scoreMap = { Easy: 10, Medium: 20, Hard: 40 };
      user.score += scoreMap[problem.difficulty] || 10;
      await user.save();
    }
  }

  res.status(201).json({ submission, aiAnalysis });
});

const getSubmissions = asyncHandler(async (req, res) => {
  const filter = req.user.role === 'admin' ? {} : { user: req.user._id };
  const submissions = await Submission.find(filter)
    .populate('problem', 'title difficulty')
    .sort({ createdAt: -1 });
  res.json(submissions);
});

const getSubmissionById = asyncHandler(async (req, res) => {
  const submission = await Submission.findById(req.params.id)
    .populate('problem', 'title difficulty')
    .populate('user', 'name email');

  if (!submission) {
    res.status(404);
    throw new Error('Submission not found');
  }

  if (req.user.role !== 'admin' && submission.user._id.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Access denied');
  }

  res.json(submission);
});

module.exports = { submitSolution, getSubmissions, getSubmissionById };
