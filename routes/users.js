const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const config = require('config');
const {
    check,
    validationResult
} = require("express-validator");

const User = require("../models/User");

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
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
            });
        }

        const {
            name,
            email,
            password
        } = req.body;

        try {
            // check if user exists
            let user = await User.findOne({
                email,
            });

            if (user) {
                return res.status(400).json({
                    errors: [{
                        msg: "User already exists",
                    }, ],
                });
            }

            // Get user gravatar
            const avatar = gravatar.url(
                email, {
                    s: "200",
                    r: "pg",
                    d: "mm",
                },
                true
            );

            user = new User({
                name,
                email,
                avatar,
                password,
            });


            // Encrypt password

            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);

            await user.save();

            // Return json webtoken

            const payload = {
                user: {
                    id: user.id
                }
            }

            jwt.sign(payload, config.get('jwtSecret'), {
                expiresIn: 36000
            }, (err, token) => {
                if (err) throw err;
                res.json({
                    token
                })
            })
        } catch (err) {
            console.log(err.message);
            res.status(500).send("Server Error");
        }
    }
);

module.exports = router;