const express = require('express');
const { analyzeSubmission } = require('../controllers/aiController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/analyze', protect, analyzeSubmission);

module.exports = router;
