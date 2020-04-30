const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth');

const User = require('../../models/User');
const Post = require('../../models/Post');
const Profile = require('../../models/Profile');

// @router POST api/postss
// @desc   Create Post
// @access private

router.post(
  '/',
  [auth, [check('text', 'Text is reqiured').not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    try {
      const user = await User.findById(req.user.id);

      const newPost = {
        text: req.body.text,
        user: user.id,
        name: user.name,
        avatar: user.avatar,
      };
      const post = new Post(newPost);
      await post.save();
      res.json(post);
    } catch (err) {
      console.error(err);
      res.status(500).send('server error');
    }
  }
);

// @router GET api/posts
// @desc   get all posts
// @access private

router.get('/', auth, async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 });
    res.json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).send('server error');
  }
});

// @router GET api/posts/:id
// @desc   get post by id
// @access private

router.get('/:id', auth, async (req, res) => {
  try {
    const id = req.params.id;
    //console.log(id.length);
    if (id.length !== 24) {
      return res.status(404).json({ msg: 'Lenght Post not found' });
    }

    const post = await Post.findById(id);

    if (!post) return res.status(404).json({ msg: 'c Post not found' });

    if (post.user.toString() !== req.user.id)
      return res.status(401).json({ msg: 'not authorized' });

    res.json(post);
  } catch (err) {
    console.error(err);
    if (err.kind === 'ObjectId')
      return res.status(404).json({ msg: 'Post not found' });

    res.status(500).send('server error');
  }
});

// @router Delete api/posts/:id
// @desc   delete post by id
// @access private

router.delete('/:id', auth, async (req, res) => {
  try {
    const id = req.params.id;
    //console.log(id.length);
    if (id.length !== 24)
      return res.status(404).json({ msg: 'Post not found' });

    const post = await Post.findById(id);

    if (!post) return res.status(404).json({ msg: 'Post not found' });

    if (post.user.toString() !== req.user.id)
      return res.status(401).json({ msg: 'not authorized' });

    await post.remove();

    res.json({ msg: 'Post removed' });
  } catch (err) {
    console.error(err);
    if (err.kind === 'ObjectId')
      return res.status(404).json({ msg: 'Post not found' });

    res.status(500).send('server error');
  }
});

// @router PUT api/posts/like/:id
// @desc   like post by id
// @access private

router.put('/like/:id', auth, async (req, res) => {
  const id = req.params.id;
  if (id.length !== 24) return res.status(404).json({ msg: 'Post not found' });

  try {
    //find post
    const post = await Post.findById(id);

    //check if alreay liked4

    if (
      post.likes.filter((like) => like.user.toString() === req.user.id).length >
      0
    ) {
      return res.status(400).json({ msg: 'User alredy liked the post' });
    }

    ///if not then like
    post.likes.unshift({ user: req.user.id });
    await post.save();

    res.json(post.likes);
  } catch (err) {
    console.error(err);
    if (err.kind === 'ObjectId')
      return res.status(404).json({ msg: 'Post not found' });

    res.status(500).send('server error');
  }
});

// @router PUT api/posts/unlike/:id
// @desc   unlike post by id
// @access private

router.put('/unlike/:id', auth, async (req, res) => {
  const id = req.params.id;
  if (id.length !== 24) return res.status(404).json({ msg: 'Post not found' });

  try {
    //find post
    const post = await Post.findById(id);

    //check if not liked

    if (
      post.likes.filter((like) => like.user.toString() === req.user.id)
        .length === 0
    ) {
      return res.status(400).json({ msg: 'User liked not yet liked the post' });
    }

    ///if liked then
    const index = post.likes
      .map((like) => like.user.toString())
      .indexOf(req.user.id);
    if (index !== -1) {
      post.likes.splice(index, 1);
      await post.save();
    }
    res.json(post.likes);
  } catch (err) {
    console.error(err);
    if (err.kind === 'ObjectId')
      return res.status(404).json({ msg: 'Post not found' });

    res.status(500).send('server error');
  }
});

// @router POST api/postss/comment/:id
// @desc   comment on post
// @access private

router.post(
  '/comment/:id',
  [auth, [check('text', 'Text is reqiured').not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    try {
      const user = await User.findById(req.user.id);

      const comment = {
        text: req.body.text,
        user: user.id,
        name: user.name,
        avatar: user.avatar,
      };

      const post = await Post.findById(req.params.id);
      post.comments.unshift(comment);

      await post.save();

      res.json(post.comments);
    } catch (err) {
      console.error(err);
      res.status(500).send('server error');
    }
  }
);

// @router DELETE api/postss/comment/:id/:comment_id
// @desc   delete comment on post
// @access private

router.delete('/comment/:id/:comment_id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    const cmntIndex = post.comments
      .map((comment) => comment._id.toString())
      .indexOf(req.params.comment_id);

    if (cmntIndex === -1)
      return res.status(400).send({ msg: 'Comment not found' });

    if (!post.comments[cmntIndex].user.toString() === req.user.id) {
      return res.status(401).json({ msg: 'Not authorize' });
    }
    post.comments.splice(cmntIndex, 1);

    await post.save();
    //console.log(post.comments);

    res.json(post.comments);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;
