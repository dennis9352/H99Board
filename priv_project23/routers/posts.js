const express = require('express');
const router = express.Router();
const Post = require('../models/post');
const moment = require('moment');
require('moment-timezone');
moment.tz.setDefault('Asia/Seoul');

router.post('/write', async (req, res) => {
  const { title, context, channel, userId, nickname } = req.body;

  if (title === '') {
    res.status(400).send({
      errorMessage: '제목을 작성해주세요.',
    });
    return;
  }

  if (context === '') {
    res.status(400).send({
      errorMessage: '내용을 작성해주세요.',
    });
    return;
  }

  const maxOrder = await Post.findOne({ channel }).sort('-order').exec();
  let order = 1;

  if (maxOrder) {
    order = maxOrder.order + 1;
  }
  const like = [];
  const view = 0;
  const date = moment().format('YYYY-MM-DD HH:mm:ss');

  const post = new Post({
    title,
    context,
    order,
    channel,
    userId,
    nickname,
    like,
    view,
    date,
  });
  await post.save();
  res.status(201).send();
});

router.get('/list/:channel', async (req, res) => {
  const { channel } = req.params;
  const posts = await Post.find({ channel }).sort('-order');

  res.send({ post: posts });
});

router.get('/list/', async (req, res) => {
  const nodePosts = await Post.find({ channel: 'node' })
    .limit(10)
    .sort('-order');
  const reactPosts = await Post.find({ channel: 'react' })
    .limit(10)
    .sort('-order');
  const springPosts = await Post.find({ channel: 'spring' })
    .limit(10)
    .sort('-order');
  res.send({ node: nodePosts, react: reactPosts, spring: springPosts });
});

const viewObj = new Object();

router.get('/read/:postId', async (req, res) => {
  const { postId } = req.params;
  const posts = await Post.find({ _id: postId });
  res.send({ post: posts });
});

router.get('/read/:postId/:userId', async (req, res) => {
  const { postId, userId } = req.params;
  const posts = await Post.find({ _id: postId });

  if (!viewObj[postId]) {
    viewObj[postId] = [];
  }

  if (viewObj[postId].indexOf(userId) == -1) {
    viewObj[postId].push(userId);
    posts[0].view++;

    setTimeout(() => {
      viewObj[postId].splice(viewObj[postId].indexOf(userId), 1);
    }, 600000);

    await Post.updateOne({ _id: postId }, { $set: { view: posts[0].view } });
  }

  res.send({ post: posts });
});

module.exports = router;
