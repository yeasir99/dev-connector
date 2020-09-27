const asyncHandler = require('../middleware/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');
const Post = require('../models/Post');
const User = require('../models/User');

// @route      POST api/posts
// @desc       Create a post
// @access     Private

exports.createPost = asyncHandler(async (req, res, next) => {
  // 1) find user
  const user = await User.findById(req.user.id).select('-password');

  // 2) create post obj
  const newPost = {
    text: req.body.text,
    name: user.name,
    avatar: user.avatar,
    user: req.user.id,
  };

  // 3) save post database
  const post = await Post.create(newPost);

  res.status(201).json(post);
});

// @route      GET api/posts
// @desc       Get all posts
// @access     Private

exports.getPosts = asyncHandler(async (req, res, next) => {
  const posts = await Post.find().sort({ date: -1 });
  res.status(200).json(posts);
});

// @route      GET api/posts/:id
// @desc       Get Post by id
// @access     Private

exports.getPost = asyncHandler(async (req, res, next) => {
  const post = await Post.findById(req.params.id);

  // send error response if post not found
  if (!post) {
    return next(new ErrorResponse('Post not found', 404));
  }

  res.status(200).json(post);
});

// @route      DELETE api/posts/:id
// @desc       Delete a post
// @access     Private

exports.deletePost = asyncHandler(async (req, res, next) => {
  const post = await Post.findById(req.params.id);

  // send error response if post not found
  if (!post) {
    return next(new ErrorResponse('Post not found', 404));
  }

  // check user owner the post
  if (post.user.toString() !== req.user.id) {
    return next(new ErrorResponse('User not authorized', 401));
  }

  // remove post
  await post.remove();

  res.status(204).json({ msg: 'Post removed' });
});

// @route      PUT api/posts/like/:id
// @desc       Like a post
// @access     Private

exports.postLike = asyncHandler(async (req, res, next) => {
  const post = await Post.findById(req.params.id);

  // check post already liked
  if (
    post.likes.filter((like) => like.user.toString() === req.user.id).length > 0
  ) {
    return next(new ErrorResponse('Post already liked', 400));
  }
  // 3) put like
  post.likes.unshift({ user: req.user.id });

  // 4) save likes
  await post.save();

  res.status(200).json(post.likes);
});

// @route      PUT api/posts/unlike/:id
// @desc       Unlike a post
// @access     Private

exports.unlikePost = asyncHandler(async (req, res, next) => {
  const post = await Post.findById(req.params.id);
  // 2) check post not liked

  if (
    post.likes.filter((like) => like.user.toString() === req.user.id).length ===
    0
  ) {
    return next(new ErrorResponse('Post has not yet been liked', 400));
  }
  // 3) get remove index
  const removeIndex = post.likes
    .map((like) => like.user.toString())
    .indexOf(req.params.id);

  post.likes.splice(removeIndex, 1);
  // 4) update post

  await post.save();

  res.status(200).json(post.likes);
});

// @route      POST api/posts/comment/:id
// @desc       Comment on a post
// @access     Private

exports.postComment = asyncHandler(async (req, res, next) => {
  // 1) find user and post
  const user = await User.findById(req.user.id).select('-password');
  const post = await Post.findById(req.params.id);

  // 3) create new comment

  const newComment = {
    text: req.body.text,
    name: user.name,
    avatar: user.avatar,
    user: req.user.id,
  };

  // 4) unshift comment
  post.comments.unshift(newComment);
  // 5) update Post
  await post.save();

  res.status(201).json(post.comments);
});

// @route      DELETE api/posts/comment/:id/:comment_id
// @desc       Delete comment
// @access     Private

exports.deleteComment = asyncHandler(async (req, res, next) => {
  // 1) find post
  const post = await Post.findById(req.params.id);

  // 2) pull out the comment
  const comment = post.comments.find(
    (commentItem) => commentItem.id === req.params.comment_id
  );

  // 3) if comment not found
  if (!comment) {
    return next(new ErrorResponse('Comment dose not exists', 404));
  }
  // 4) check user owner the comment
  if (comment.user.toString() !== req.user.id) {
    return next(new ErrorResponse('User not authorized', 401));
  }

  // 5) delete comment
  post.comments = post.comments.filter(
    ({ id }) => id !== req.params.comment_id
  );

  // 6) update post
  await post.save();
  res.status(204).json(post.comments);
});
