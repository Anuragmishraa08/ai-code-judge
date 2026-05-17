const asyncHandler = require('express-async-handler');
const { analyzeCode } = require('../services/aiService');

const analyzeSubmission = asyncHandler(async (req, res) => {
  const { code, language, problemTitle, problemDescription } = req.body;
  if (!code || !language || !problemTitle) {
    res.status(400);
    throw new Error('Code, language, and problem title are required');
  }

  const aiAnalysis = await analyzeCode({ code, language, problemTitle, problemDescription });
  res.json(aiAnalysis);
});

module.exports = { analyzeSubmission };
