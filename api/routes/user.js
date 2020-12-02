const express = require('express');
const router = express.Router({mergeParams: true});

const {auth} = require('../middlewares/user');
const {send__signup__mail} = require('../middlewares/mail');

const {
  compare__pwds,
  login_with__google,
  user_signup,
  get_current_user,
  get_user_by_id,
  change_pwd,
  delete_user,
  get_all_users,
  return_new__user,
  update_avatar,
  update_info,
  return_info,
} = require('../controllers/user');

const {check_mail_exist, check_default__pwd} = require('../middlewares/user');
const {send_change_pwd_mail} = require('../middlewares/mail');

router.post(
  '/signup',
  check_mail_exist,
  user_signup,
  send__signup__mail,
  return_new__user
);
router.post('/login/pwd', check_default__pwd, compare__pwds); // xong
router.post('/login/google', login_with__google); // xong
router.get('/me', auth, get_current_user); // xong
router.get('/:userId', get_user_by_id); // xong

router.patch('/me/avatar', auth, update_avatar); // chua xong
router.patch('/me/info', auth, update_info); // xong
router.patch('/me/pwd', auth, change_pwd, send_change_pwd_mail, return_info); // xong
router.delete('/:userId', auth, delete_user);
router.get('/', get_all_users); // xong

module.exports = router;
