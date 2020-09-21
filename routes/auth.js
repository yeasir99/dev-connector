const express = require('express')
const router = express.Router();
const auth = require('../middleware/auth');
const {
    check
} = require("express-validator");
const {
    getUser,
    userLogin
} = require('../controller/auth');

router
    .route('/')
    .get(auth, getUser)
    .post([check('email', 'Please include a valid email').isEmail(),
        check('password', 'Password is required').exists()
    ], userLogin)


module.exports = router;