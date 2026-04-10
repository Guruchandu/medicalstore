const express = require('express');
const { getProducts, getProductById, createProduct } = require('../controllers/productController');
const { protect } = require('../middleware/auth');
const router = express.Router();

router.route('/').get(getProducts).post(protect, createProduct);
router.route('/:id').get(getProductById);

module.exports = router;
