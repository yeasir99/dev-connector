const asyncHandler = require('../middleware/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');
const gravatar = require('gravatar');
const jwt = require('jsonwebtoken');
const config = require('config');

const User = require('../models/User');

exports.register = asyncHandler(async (req, res, next) => {
  // 1) destructure data from request body

  const { name, email, password } = req.body;

  // 2) check user already exists
  let user = await User.findOne({
    email,
  });

  if (user) {
    next(new ErrorResponse('User already exists', 400));
  }

  // 3) get user gravatar

  const avatar = gravatar.url(
    email,
    {
      s: '200',
      r: 'pg',
      d: 'mm',
    },
    true
  );

  // 4) create user

  user = await User.create({ name, email, password, avatar });

  // 5) send token

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
