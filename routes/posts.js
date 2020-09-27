const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const auth = require('../middleware/auth');
const {
  createPost,
  getPosts,
  getPost,
  deletePost,
  postLike,
  unlikePost,
  postComment,
  deleteComment,
} = require('../controller/posts');

router.route('/').post(auth, createPost).get(auth, getPosts);
router.route('/:id').get(auth, getPost).delete(auth, deletePost);
router.route('/like/:id').put(auth, postLike);
router.route('/unlike/:id').put(auth, unlikePost);
router.route('/comment/:id').post(auth, postComment);
router.route('/comment/:id/:comment_id').delete(auth, deleteComment);

module.exports = router;
