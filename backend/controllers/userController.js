const asyncHandler = require('express-async-handler');
const User = require('../models/User');

const getLeaderboard = asyncHandler(async (req, res) => {
  const users = await User.find()
    .select('name score solvedProblems')
    .sort({ score: -1, solvedProblems: -1, name: 1 })
    .limit(20);

  res.json(users.map((user, index) => ({
    rank: index + 1,
    id: user._id,
    name: user.name,
    score: user.score,
    solvedCount: user.solvedProblems.length
  })));
});

module.exports = { getLeaderboard };