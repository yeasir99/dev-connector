const request = require('request');
const config = require('config');
const auth = require('../middleware/auth');
const { validationResult } = require('express-validator');
const Profile = require('../models/Profile');
const User = require('../models/User');
const Post = require('../models/Post');

// @route      GET api/profile/me
// @desc       Get current user profile
// @access     Private

exports.getUserProfile = async (req, res, next) => {
  try {
    // 1) find profile
    const profile = await (
      await Profile.findOne({ user: req.user.id })
    ).populate('user', ['name', 'avatar']);

    // 2) send error response if profile not found
    if (!profile) {
      return res.status(404).json({ msg: 'There is no profile for this user' });
    }

    // 3) send response if profile found
    res.status(200).json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
