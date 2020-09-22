const request = require('request');
const config = require('config');
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

// @route      GET api/profile
// @desc       Get all Profile
// @access     Public

exports.getUserProfiles = async (req, res, next) => {
  try {
    // 1) find users profiles
    const profiles = await Profile.find().populate('user', ['name', 'avatar']);

    // 2) send respons
    res.status(200).json(profiles);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @route      POST api/profile
// @desc       Create or Update user profile
// @access     Private

exports.createOrUpdateProfile = async (req, res, next) => {
  // 1) setup validation error response
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
    });
  }

  // 2) destructing data from request
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

  // 3) create profile fields object
  const profileFields = {};

  profileFields.user = req.user.id;

  if (company) profileFields.company = company;
  if (website) profileFields.website = website;
  if (location) profileFields.location = location;
  if (bio) profileFields.bio = bio;
  if (status) profileFields.status = status;
  if (githubusername) profileFields.githubusername = githubusername;
  if (skills) {
    profileFields.skills = skills.split(',').map(skill => skill.trim());
  }
  profileFields.social = {};
  if (youtube) profileFields.social.youtube = youtube;
  if (twitter) profileFields.social.twitter = twitter;
  if (linkedin) profileFields.social.linkedin = linkedin;
  if (facebook) profileFields.social.facebook = facebook;
  if (instagram) profileFields.social.instagram = instagram;

  try {
    // 5) find profile
    let profile = await Profile.findOne({ user: req.user.id });

    // 6) update profile if profile available
    if (profile) {
      profile = await Profile.findOneAndUpdate(
        { user: req.user.id },
        { $set: profileFields },
        { new: true }
      );

      // send respons
      res.status(200).json(profile);
    }

    // 7) create new profile
    profile = new Profile(profileFields);
    await profile.save();

    // send respons
    res.status(201).json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send(`Server Error`);
  }
};

// @route      GET api/profile/user/:user_id
// @desc       Get Profile by user ID
// @access     Public

exports.getOtherUserProfile = async (req, res, next) => {
  try {
    // 1) find profile
    const profile = await Profile.findOne({
      user: req.params.user_id,
    }).populate('user', ['name', 'avatar']);

    // 2) send error response if user not found
    if (!profile)
      return res.status(400).json({
        msg: 'There is no profile for this user',
      });

    // 3) send response
    res.status(200).json(profile);
  } catch (err) {
    console.error(err.message);

    // 4) check object id error and send response
    if (err.kind == 'ObjectId') {
      return res.status(400).json({
        msg: 'Profile not found',
      });
    }

    res.status(500).send('Server Error');
  }
};

// @route      DELETE api/profile
// @desc       Delete profile, user & posts
// @access     Private

exports.deleteUser = async (req, res, next) => {
  try {
    // 1) remove user posts
    await Post.deleteMany({ user: req.user.id });

    // 2) delete profile
    await Profile.findOneAndRemove({ user: req.user.id });

    // 3) remove user
    await User.findByIdAndRemove({ _id: req.user.id });

    // send response
    res.status(204).json({ msg: 'User removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @route      PUT api/profile/experience
// @desc       Add profile experience
// @access     Private

exports.userExperience = async (req, res, next) => {
  // 1) setup validation error response
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
    });
  }

  // 2) destructing data from request
  const { title, company, location, from, to, current, description } = req.body;

  // 3) create experience fields object
  const newExp = {
    title,
    company,
    location,
    from,
    to,
    current,
    description,
  };

  try {
    // 4) find user profile
    const profile = await Profile.findOne({ user: req.user.id });

    // 5) put data on profile experience field
    profile.experience.unshift(newExp);

    // 6) update profile
    await profile.save();

    // 7) send response
    res.status(200).json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @route      DELETE api/profile/experience/:exp_id
// @desc       Delete experience from profile
// @access     Private

exports.deleteExperience = async (req, res, next) => {
  try {
    // 1) find user profile
    const profile = await Profile.findOne({ user: req.user.id });

    // 2) find index
    const removeIndex = profile.experience
      .map(item => item.id)
      .indexOf(req.params.exp_id);

    // 3) remove experience
    profile.experience.splice(removeIndex, 1);

    // 4) update profile
    await profile.save();

    // 5) send respons
    res.status(200).json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.userEducation = async (req, res, next) => {
  // 1) setup validation error response
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
    });
  }

  // 2) destructing data from request
  const {
    school,
    degree,
    fieldofstudy,
    from,
    to,
    current,
    description,
  } = req.body;

  // 3) create education fields object
  const newEdu = {
    school,
    degree,
    fieldofstudy,
    from,
    to,
    current,
    description,
  };

  try {
    // 4) find user profile
    const profile = await Profile.findOne({ user: req.user.id });

    // 5) put data on profile experience field
    profile.education.unshift(newEdu);

    // 6) update profile
    await profile.save();

    // 7) send response
    res.status(200).json(profile);
  } catch (err) {}
};

// @route      DELETE api/profile/education/:edu_id
// @desc       Delete education from profile
// @access     Private

exports.deleteEducation = async (req, res, next) => {
  try {
    // 1) fins user profile
    const profile = await Profile.findOne({ user: req.user.id });

    // 2) find index
    const removeIndex = profile.education
      .map(item => item._id)
      .indexOf(req.params.edu_id);

    // 3) remove education item
    profile.education.splice(removeIndex, 1);

    // 4) update profile
    await profile.save();

    // 5) send response
    res.status(200).json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

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
      if (error) console.error(error);

      if (response.statusCode !== 200) {
        return res.status(404).json({
          msg: 'No Github profile found',
        });
      }
      // send respons data
      res.json(JSON.parse(body));
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
