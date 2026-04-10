const express = require('express');
const { addOrderItems, getMyOrders, getOrders } = require('../controllers/orderController');
const { protect } = require('../middleware/auth');
const router = express.Router();

router.route('/').post(protect, addOrderItems).get(protect, getOrders);
router.route('/myorders').get(protect, getMyOrders);

module.exports = router;
