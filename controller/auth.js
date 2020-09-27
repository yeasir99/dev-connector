const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const asyncHandler = require('../middleware/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');
const User = require('../models/User');

// @route      GET api/auth
// @desc       Get user by token
// @access     Private

exports.getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('-password');
  res.json(user);
});

// @route    POST api/auth
// @desc     Authenticate user & get token
// @access   Public

exports.userLogin = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorResponse(`Please include email and password`));
  }

  // find user by email
  const user = await User.findOne({
    email,
  });

  // send error if user not found
  if (!user) {
    return next(new ErrorResponse('Invalid Credential', 400));
  }
  // compare password
  const isMatch = await bcrypt.compare(password, user.password);
  // send error if password not match
  if (!isMatch) {
    return next(new ErrorResponse('Invalid Credential', 400));
  }
  // send token to the user
  jwt.sign(
    {
      id: user.id,
    },
    config.get('jwtSecret'),
    {
      expiresIn: 36000,
    },
    (err, token) => {
      if (err) throw err;
      res.status(200).json({
        token,
      });
    }
  );
});
