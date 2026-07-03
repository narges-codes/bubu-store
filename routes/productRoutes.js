const express = require('express');
const router = express.Router();
const adminAuth = require('../middleware/adminAuth');
const { getAllProducts, createProduct, updateProduct, deleteProduct } = require('../controllers/productController');

router.get('/', getAllProducts);
router.post('/', adminAuth, createProduct);
router.put('/:id', adminAuth, updateProduct);
router.delete('/:id', adminAuth, deleteProduct);

module.exports = router;