const express = require('express');
const router = express.Router();
const {
  get__all__products,
  create__product,
  get__product,
  update__product,
  delete__product,
} = require('../controllers/product');

const {auth} = require('../middlewares/user');

router.get('/', get__all__products);
router.post('/', auth, create__product);
router.get('/:productId', get__product);
router.patch('/:productId', auth, update__product);
router.delete('/:productId', auth, delete__product);

module.exports = router;
