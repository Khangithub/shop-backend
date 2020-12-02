const express = require('express');
const router = express.Router();

const {auth} = require('../middlewares/user');
const {
  get__all__order,
  create__order,
  get__order__of__user,
  get__order__of__saleman,
  get__order__by__id,
  update__order,
  delete__order,
} = require('../controllers/order');

// Handling incoming get request to /orders
router.get('/', get__all__order);
router.post('/', auth, create__order);
router.get('/ofUser', auth, get__order__of__user);
router.get('/ofSaler', auth, get__order__of__saleman);
router.get('/:orderId', auth, get__order__by__id);
router.patch('/:orderId', auth, update__order);
router.delete('/:orderId', auth, delete__order);

module.exports = router;
