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

router
  .route('/')
  .post([auth, [check('text', 'Text is required').not().isEmpty()]], createPost)
  .get(auth, getPosts);

router.route('/:id').get(auth, getPost).delete(auth, deletePost);

router.put('/like/:id', auth, postLike);

router.put('/unlike/:id', auth, unlikePost);

router.post(
  '/comment/:id',
  [auth, [check('text', 'Text is required').not().isEmpty()]],
  postComment
);

router.delete('/comment/:id/:comment_id', auth, deleteComment);

module.exports = router;
