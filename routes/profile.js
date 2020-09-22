const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { check } = require('express-validator');

const {
  getUserProfile,
  getUserProfiles,
  createOrUpdateProfile,
  getOtherUserProfile,
  deleteUser,
  userExperience,
  deleteExperience,
  userEducation,
  deleteEducation,
  userGithubRepos,
} = require('../controller/profile');

router.get('/me', auth, getUserProfile);
router.get('/', getUserProfiles);
router.post(
  '/',
  [
    auth,
    [
      check('status', 'Status is required').not().isEmpty(),
      check('skills', 'Skills is required').not().isEmpty(),
    ],
  ],
  createOrUpdateProfile
);
router.get('/:user_id', getOtherUserProfile);
router.delete('/', auth, deleteUser);
router.put(
  '/experience',
  [
    auth,
    [
      check('title', 'Title is required').not().isEmpty(),
      check('company', 'Company is required').not().isEmpty(),
      check('from', 'From date is required').not().isEmpty(),
    ],
  ],
  userExperience
);
router.delete('/experience/:exp_id', auth, deleteExperience);
router.put(
  '/education',
  [
    auth,
    [
      check('school', 'School is required').not().isEmpty(),
      check('degree', 'Degree is required').not().isEmpty(),
      check('fieldofstudy', 'Field of study is required').not().isEmpty(),
      check('from', 'From date is required').not().isEmpty(),
    ],
  ],
  userEducation
);
router.delete('/education/:edu_id', auth, deleteEducation);
router.get('/github/:username', userGithubRepos);

module.exports = router;
