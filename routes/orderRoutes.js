const express = require('express');
const router = express.Router();
const { auth, adminToken } = require('../middleware/auth');
const { checkout, myOrders, adminOrders, updateStatus, adminUsers } = require('../controllers/orderController');

router.post('/checkout', auth, checkout);
router.get('/mine', auth, myOrders);

// admin
router.get('/admin/all', adminToken, adminOrders);
router.put('/admin/:id/status', adminToken, updateStatus);
router.get('/admin/users', adminToken, adminUsers);

module.exports = router;