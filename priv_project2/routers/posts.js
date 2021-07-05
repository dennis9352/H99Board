const express = require('express');
const router = express.Router();
const Post = require('../models/post');

router.post('/write', async (req, res) => {
  const { title, context, channel, userId, nickname } = req.body;
  
  if (title === "") {
    res.status(400).send({
        errorMessage: '제목을 작성해주세요.',
    })
    return
  }

  if(context === "") {
    res.status(400).send({
        errorMessage: '내용을 작성해주세요.',
    })
    return
  }

  const maxOrder = await Post.findOne({ channel }).sort('-order').exec();
  let order = 1;

  if (maxOrder) {
    order = maxOrder.order + 1;
  }
  const like = [];
  const view = 0;


  const post = new Post({
    title,
    context,
    order,
    channel,
    userId,
    nickname,
    like,
    view,
  });
  await post.save();
  res.status(201).send();
});

module.exports = router;

router.get('/list/:channel', async (req, res) => {
    const { channel } = req.params;
    const posts = await Post.find({ channel }).sort('-order');

    res.send({ post : posts });
});

router.get('/read/:postId', async (req, res) => {
    const { postId } = req.params;
    const posts = await Post.find({ _id : postId });

    res.send({ post : posts });
});
