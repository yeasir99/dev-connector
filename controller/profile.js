const request = require('request');
const config = require('config');
const asyncHandler = require('../middleware/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');
const Profile = require('../models/Profile');
const User = require('../models/User');
const Post = require('../models/Post');

// @route      GET api/profile/me
// @desc       Get current user profile
// @access     Private

exports.getUserProfile = asyncHandler(async (req, res, next) => {
  // 1) find profile and populate data from user
  const profile = await Profile.findOne({ user: req.user.id }).populate(
    'user',
    ['name', 'avatar']
  );

  // 2) send error response if profile not found
  if (!profile) {
    return next(new ErrorResponse('There is no profile for this user', 404));
  }
  // 3) send response if profile found
  res.status(200).json(profile);
});

// @route      GET api/profile
// @desc       Get all Profile
// @access     Public

exports.getUserProfiles = asyncHandler(async (req, res, next) => {
  // find users profiles & send response
  const profiles = await Profile.find().populate('user', ['name', 'avatar']);

  res.status(200).json(profiles);
});

// @route      POST api/profile
// @desc       Create or Update user profile
// @access     Private

exports.createOrUpdateProfile = asyncHandler(async (req, res, next) => {
  // 1) destructing data from request
  const {
    company,
    website,
    location,
    bio,
    status,
    githubusername,
    skills,
    youtube,
    facebook,
    twitter,
    instagram,
    linkedin,
  } = req.body;

  // 2) create profile fields object
  const profileFields = {};

  profileFields.user = req.user.id;

  if (company) profileFields.company = company;
  if (website) profileFields.website = website;
  if (location) profileFields.location = location;
  if (bio) profileFields.bio = bio;
  if (status) profileFields.status = status;
  if (githubusername) profileFields.githubusername = githubusername;
  if (skills) {
    profileFields.skills = skills.split(',').map((skill) => skill.trim());
  }
  profileFields.social = {};
  if (youtube) profileFields.social.youtube = youtube;
  if (twitter) profileFields.social.twitter = twitter;
  if (linkedin) profileFields.social.linkedin = linkedin;
  if (facebook) profileFields.social.facebook = facebook;
  if (instagram) profileFields.social.instagram = instagram;
  // 3) find profile
  let profile = await Profile.findOne({ user: req.user.id });

  // 4) update profile if profile available & send response
  if (profile) {
    profile = await Profile.findOneAndUpdate(
      { user: req.user.id },
      { $set: profileFields },
      { new: true, runValidators: true }
    );

    res.status(200).json(profile);
  }

  // 5) create new profile & send response
  profile = new Profile(profileFields);
  await profile.save();

  res.status(201).json(profile);
});

// @route      GET api/profile/:user_id
// @desc       Get Profile by user ID
// @access     Public

exports.getOtherUserProfile = asyncHandler(async (req, res, next) => {
  // 1) find profile
  const profile = await Profile.findOne({
    user: req.params.user_id,
  }).populate('user', ['name', 'avatar']);

  // 2) send error response if user not found
  if (!profile)
    return next(new ErrorResponse('There is no profile for this user', 400));

  // 3) send response
  res.status(200).json(profile);
});

// @route      PUT api/profile/experience
// @desc       Add profile experience
// @access     Private

exports.userExperience = asyncHandler(async (req, res, next) => {
  // 1) destructure data from request
  const { title, company, location, from, to, current, description } = req.body;

  // 2) create experience fields object
  const newExp = {
    title,
    company,
    location,
    from,
    to,
    current,
    description,
  };
  // 3) find user profile
  const profile = await Profile.findOne({ user: req.user.id });

  // 4) put data on profile experience field
  profile.experience.unshift(newExp);

  // 5) update profile & send response
  await profile.save({ runValidators: true });

  res.status(200).json(profile);
});

// @route      PUT api/profile/education
// @desc       Add profile education
// @access     Private

exports.userEducation = asyncHandler(async (req, res, next) => {
  // 1) destructing data from request
  const {
    school,
    degree,
    fieldofstudy,
    from,
    to,
    current,
    description,
  } = req.body;

  // 2) create education fields object
  const newEdu = {
    school,
    degree,
    fieldofstudy,
    from,
    to,
    current,
    description,
  };
  // 3) find user profile
  const profile = await Profile.findOne({ user: req.user.id });

  // 4) put data on profile experience field
  profile.education.unshift(newEdu);

  // 5) update profile & send response
  await profile.save({ runValidators: true });
  res.status(200).json(profile);
});

// @route      DELETE api/profile/experience/:exp_id
// @desc       Delete experience from profile
// @access     Private

exports.deleteExperience = asyncHandler(async (req, res, next) => {
  // 1) find user profile
  const profile = await Profile.findOne({ user: req.user.id });

  // 2) remove experience & update profile
  profile.experience = profile.experience.filter(
    (expItem) => expItem._id.toString() !== req.params.exp_id
  );

  await profile.save();
  res.status(200).json(profile);
});

// @route      DELETE api/profile/education/:edu_id
// @desc       Delete education from profile
// @access     Private

exports.deleteEducation = asyncHandler(async (req, res, next) => {
  // 1) fins user profile
  const profile = await Profile.findOne({ user: req.user.id });

  // 2) remove education item & update profile & send response
  profile.education = profile.education.filter(
    (eduItem) => eduItem._id.toString() !== req.params.edu_id
  );

  await profile.save();
  res.status(200).json(profile);
});

// @route      DELETE api/profile
// @desc       Delete profile, user & posts
// @access     Private

exports.deleteUser = asyncHandler(async (req, res, next) => {
  // 1) delete user posts & remove profile & remove user
  await Post.deleteMany({ user: req.user.id });
  await Profile.findOneAndRemove({ user: req.user.id });
  await User.findByIdAndRemove({ _id: req.user.id });

  res.status(204).json({ msg: 'User removed' });
});

// @route      GET api/profile/github/:username
// @desc       Get user repos from github
// @access     Public

exports.userGithubRepos = (req, res, next) => {
  try {
    // 1) create a object with github credential
    const options = {
      uri: `http://api.github.com/users/${
        req.params.username
      }/repos?per_page=5&sort=created:asc&
                client_id=${config.get(
                  'githubClientId'
                )}&client_secret=${config.get('githubSecret')}`,
      method: 'GET',
      headers: {
        'user-agent': 'node.js',
      },
    };

    // 2) send request
    request(options, (error, response, body) => {
      // handle error
      if (error) throw error;

      if (response.statusCode !== 200) {
        return res.status(404).json({
          msg: 'No Github profile found',
        });
      }
      res.json(JSON.parse(body));
    });
  } catch (err) {
    res.status(500).send('Server Error');
  }
};
