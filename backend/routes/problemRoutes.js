const express = require('express');
const {
  createProblem,
  updateProblem,
  deleteProblem,
  getProblems,
  getProblemById
} = require('../controllers/problemController');
const { protect, admin } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', getProblems);
router.get('/:id', getProblemById);
router.post('/', protect, admin, createProblem);
router.put('/:id', protect, admin, updateProblem);
router.delete('/:id', protect, admin, deleteProblem);

module.exports = router;
