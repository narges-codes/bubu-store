const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const { getCart, addToCart, updateItem, removeItem, clearCart } = require('../controllers/cartController');

router.get('/', auth, getCart);
router.post('/', auth, addToCart);
router.put('/:id', auth, updateItem);
router.delete('/:id', auth, removeItem);
router.delete('/', auth, clearCart);

module.exports = router;