const express = require('express');
const { submitSolution, getSubmissions, getSubmissionById } = require('../controllers/submissionController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/', protect, submitSolution);
router.get('/', protect, getSubmissions);
router.get('/:id', protect, getSubmissionById);

module.exports = router;
