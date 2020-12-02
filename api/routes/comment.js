const express = require('express');
const router = express.Router({mergeParams: true});
const {
  get__all__comments,
  get__comment__of__product,
  get__comment,
  create__main__comment,
  update__main__comment,
  delete__main__comment,
  create__sub__comment,
  comment_update_subComment,
  comment_delete_subComment,
} = require('../controllers/comment');
const {auth} = require('../middlewares/user');

router.get('/', get__all__comments);
router.get('/ofProduct/:productId', get__comment__of__product);
router.get('/:commentId', get__comment);

router.post('/main/comment', auth, create__main__comment);
router.patch('/mainComment/:commentId', auth, update__main__comment);
router.delete('/mainComment/:commentId', auth, delete__main__comment);

router.post('/subComment/:commentId', auth, create__sub__comment);
router.patch('/subComment/:commentId', auth, comment_update_subComment);
router.delete('/subComment/:commentId', auth, comment_delete_subComment);

module.exports = router;
