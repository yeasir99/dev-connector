const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const config = require('config');
const {
    validationResult
} = require("express-validator");

const User = require("../models/User");

exports.register = async (req, res, next) => {
    // 1) validate error 

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array(),
        });
    }

    // destructure user data 

    const {
        name,
        email,
        password
    } = req.body;

    try {
        // 2) check user already exists
        let user = await User.findOne({
            email
        });

        if (user) {
            return res.status(400).json({
                errors: [{
                    msg: "User already exists"
                }]
            })
        }

        // 3) get user gravatar 

        const avatar = gravatar.url(
            email, {
                s: "200",
                r: "pg",
                d: "mm",
            },
            true
        );

        // 4) create user 

        user = new User({
            name,
            email,
            avatar,
            password,
        });

        // 5) Encrypt password

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        // 6) save user database 

        await user.save();

        // 7) send token 

        jwt.sign({
                id: user.id
            }, config.get('jwtSecret'), {
                expiresIn: 36000
            },
            (err, token) => {
                if (err) throw err;
                res.status(200).json({
                    token
                })
            })
    } catch (err) {
        console.error(err);
        res.status(500).send(`Server Error`)
    }
}