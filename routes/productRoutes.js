const express = require('express');
const router = express.Router();
const { getAll, getOne, create, update, remove } = require('../controllers/productController');
const { adminToken } = require('../middleware/auth');

router.get('/', getAll);
router.get('/:id', getOne);
router.post('/', adminToken, create);
router.put('/:id', adminToken, update);
router.delete('/:id', adminToken, remove);

module.exports = router;