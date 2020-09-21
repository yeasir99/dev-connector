const express = require("express");
const router = express.Router();
const {
    check
} = require("express-validator");
const {
    register
} = require('../controller/users');

// @route      POST api/users
// @desc       Register User
// @access     Public
router.post(
    "/",
    [
        check("name", "name is require").not().isEmpty(),
        check("email", "please include a valid email").isEmail(),
        check(
            "password",
            "please enter a password with 6 or more characters"
        ).isLength({
            min: 6,
        }),
    ],
    register
);

module.exports = router;