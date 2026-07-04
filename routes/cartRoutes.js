const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getCart, addToCart, updateQuantity, removeFromCart, clearCart } = require('../controllers/cartController');

// همه روت‌ها نیاز به ورود دارند
router.get('/', auth, getCart);
router.post('/', auth, addToCart);
router.put('/:id', auth, updateQuantity);
router.delete('/:id', auth, removeFromCart);
router.delete('/', auth, clearCart);

module.exports = router;