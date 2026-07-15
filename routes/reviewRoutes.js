const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const { addReview, listReviews } = require('../controllers/reviewController');

router.get('/:id/reviews', listReviews);
router.post('/:id/reviews', auth, addReview);

module.exports = router;