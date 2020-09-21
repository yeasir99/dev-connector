const {
    validationResult
} = require("express-validator");
const Post = require("../models/Post");
const Profile = require("../models/Profile");
const User = require("../models/User");

// @route      POST api/posts
// @desc       Create a post
// @access     Private

exports.createPost = async (req, res, next) => {
    // 1) validate errors 

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array(),
        });
    }

    try {
        // 2) find user

        const user = await User.findById(req.user.id).select('-password')

        // 3) create post 

        const newPost = new Post({
            text: req.body.text,
            name: user.name,
            avatar: user.avatar,
            user: req.user.id
        })

        // 4) save post database 

        const post = await newPost.save();

        // 5) return post 

        res.status(201).json(post)
    } catch (err) {
        console.error(err);
        res.status(500).send(`Server Error`)
    }
}