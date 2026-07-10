const express = require('express');
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');
const { protect, admin } = require('../middlewares/auth');
const upload = require('../middlewares/upload');

const router = express.Router();

// Optional: sanity check
console.log('upload is a', typeof upload); // should log 'function'

router.get('/', getProducts);
router.get('/:id', getProductById);

// Admin routes (upload handles multiple images)
router.post('/', protect, admin, upload.array('images', 5), createProduct);
router.put('/:id', protect, admin, upload.array('images', 5), updateProduct);
router.delete('/:id', protect, admin, deleteProduct);

module.exports = router;