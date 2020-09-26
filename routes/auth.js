const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getUser, userLogin } = require('../controller/auth');

router.route('/').get(auth, getUser).post(userLogin);

module.exports = router;
