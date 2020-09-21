const { validationResult } = require('express-validator');
const Post = require('../models/Post');
const Profile = require('../models/Profile');
const User = require('../models/User');

// @route      POST api/posts
// @desc       Create a post
// @access     Private

exports.createPost = async (req, res, next) => {
  // 1) validate errors

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
    });
  }

  try {
    // 2) find user

    const user = await User.findById(req.user.id).select('-password');

    // 3) create post

    const newPost = new Post({
      text: req.body.text,
      name: user.name,
      avatar: user.avatar,
      user: req.user.id,
    });

    // 4) save post database

    const post = await newPost.save();

    // 5) return post

    res.status(201).json(post);
  } catch (err) {
    console.error(err);
    res.status(500).send(`Server Error`);
  }
};

// @route      GET api/posts
// @desc       Get all posts
// @access     Private

exports.getPosts = async (req, res, next) => {
  try {
    // 1) find all posts

    const posts = await Post.find().sort({ date: -1 });

    // 2) send response

    res.status(200).json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @route      GET api/posts/:id
// @desc       Get Post by id
// @access     Private

exports.getPost = async (req, res, next) => {
  try {
    // 1) get post by id

    const post = await Post.findById(req.params.id);

    // 2) send error response if post not found

    if (!post) {
      return res.status(404).json({ errors: [{ msg: `Post not found` }] });
    }

    // 3) send response

    res.status(200).json(post);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @route      DELETE api/posts/:id
// @desc       Delete a post
// @access     Private

exports.deletePost = async (req, res, next) => {
  try {
    // 1) get post by id

    const post = await Post.findById(req.params.id);

    // 2) send error response if post not found

    if (!post) {
      return res.status(404).json({ errors: [{ msg: `Post not found` }] });
    }

    // 3) check user owner the post
    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    // 4) remove post
    await post.remove();

    res.status(204).json({ msg: 'Post removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({
        msg: 'Post not found',
      });
    }
    res.status(500).send('Server Error');
  }
};

// @route      PUT api/posts/like/:id
// @desc       Like a post
// @access     Private

exports.postLike = async (req, res, next) => {
  try {
    // 1) find post by id
    const post = await Post.findById(req.params.id);

    // 2) check post already liked

    if (
      post.likes.filter(like => like.user.toString() === req.user.id).length > 0
    ) {
      return res.status(400).json({ msg: `Post already liked` });
    }
    // 3) put like
    post.likes.unshift({ user: req.user.id });

    // 4) save likes
    await post.save();

    res.status(200).json(post.likes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @route      PUT api/posts/unlike/:id
// @desc       Unlike a post
// @access     Private

exports.unlikePost = async (req, res, next) => {
  try {
    // 1) find post

    const post = await Post.findById(req.params.id);
    // 2) check post not liked

    if (
      post.likes.filter(like => like.user.toString() === req.user.id).length ===
      0
    ) {
      return res.status(400).json({
        msg: 'Post has not yet been liked',
      });
    }
    // 3) get remove index
    const removeIndex = post.likes
      .map(like => like.user.toString())
      .indexOf(req.params.id);

    post.likes.splice(removeIndex, 1);
    // 4) update post

    await post.save();

    res.status(200).json(post.likes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @route      POST api/posts/comment/:id
// @desc       Comment on a post
// @access     Private

exports.postComment = async (req, res, next) => {
  // 1) handle validation error
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
    });
  }
  try {
    // 2) find user and post
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
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @route      DELETE api/posts/comment/:id/:comment_id
// @desc       Delete comment
// @access     Private

exports.deleteComment = async (req, res, next) => {
  try {
    // 1) find post
    const post = await Post.findById(req.params.id);

    // 2) pull out the comment
    const comment = post.comments.find(
      comment => comment.id === req.params.comment_id
    );

    // 3) if comment not found
    if (!comment) {
      return res.status(404).json({ msg: `comment dose not exists` });
    }
    // 4) check user owner the comment
    if (comment.user.toString() !== req.user.id) {
      return res.status(401).json({
        msg: 'User not authorized',
      });
    }

    // 5) delete comment
    post.comments = post.comments.filter(
      ({ id }) => id !== req.params.comment_id
    );

    // 6) update post

    await post.save();

    res.status(204).json(post.comments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
