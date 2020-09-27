const express = require('express');

const router = express.Router();
const { register } = require('../controller/users');

// @route      POST api/users
// @desc       Register User
// @access     Public
router.post('/', register);

module.exports = router;
