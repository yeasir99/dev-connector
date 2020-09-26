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
router.post('/', auth, createOrUpdateProfile);
router.get('/:user_id', getOtherUserProfile);
router.delete('/', auth, deleteUser);
router.put('/experience', auth, userExperience);
router.delete('/experience/:exp_id', auth, deleteExperience);
router.put('/education', auth, userEducation);
router.delete('/education/:edu_id', auth, deleteEducation);
router.get('/github/:username', userGithubRepos);

module.exports = router;
