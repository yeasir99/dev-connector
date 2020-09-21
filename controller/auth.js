const User = require('../models/User');
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const config = require('config');
const {
    validationResult
} = require("express-validator");



// @route      GET api/auth
// @desc       Test route
// @access     Public

exports.getUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user)
    } catch (err) {
        console.error(err.message);
        res.status(500).send(`Server error`);
    }
}

exports.userLogin = async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.select(400).json({
            errors: errors.array()
        })
    }

    const {
        email,
        password
    } = req.body;

    try {
        // find user by email 
        const user = await User.findOne({
            email
        });

        // send error if user not found 
        if (!user) {
            return res.status(400).json({
                errors: [{
                    msg: `Invalid Credential`
                }]
            })
        }
        // compare password 
        const isMatch = await bcrypt.compare(password, user.password);
        // send error if password not match
        if (!isMatch) {
            return res.status(400).json({
                errors: [{
                    msg: `Invalid Credential`
                }]
            })
        }
        // send token to the user 
        jwt.sign({
            id: user.id
        }, config.get('jwtSecret'), {
            expiresIn: 36000
        }, (err, token) => {
            if (err) throw err;
            res.status(200).json({
                token
            })
        })
    } catch (err) {
        console.error(err);
        res.status(500).send(`server error`)
    }

}