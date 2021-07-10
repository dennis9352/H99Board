const express = require('express');
const router = express.Router();
const Comment = require('../models/comment');
const moment = require('moment');
require('moment-timezone');
moment.tz.setDefault('Asia/Seoul');
const currentDate = moment().format('YYYY-MM-DD HH:mm:ss');

router.post('/write', async (req, res) => {
  const { comment, userId, postId, nickname } = req.body;

  if (comment === '') {
    res.status(400).send({
      errorMessage: '댓글을 작성해주세요.',
    });
    return;
  }
  const maxOrder = await Comment.findOne({ postId }).sort('-order').exec();
  let order = 1;

  if (maxOrder) {
    order = maxOrder.order + 1;
  }
  const date = moment().format('YYYY-MM-DD HH:mm:ss');
  const commentContext = new Comment({
    comment,
    userId,
    postId,
    nickname,
    order,
    date,
  });
  await commentContext.save();
  res.status(201).send();
});

router.get('/read/:postId', async (req, res) => {
  const { postId } = req.params;
  const comments = await Comment.find({ postId: postId });

  res.send({ comment: comments });
});

router.post('/read/edit/:postId', async (req, res) => {
  const { postId } = req.params;
  const { order } = req.body;
  const comments = await Comment.findOne({ $and: [{ postId }, { order }] });

  res.send({ comment: comments });
});

router.put('/edit/:postId', async (req, res) => {
  const { postId } = req.params;
  const { order, comment } = req.body;

  if (comment === '') {
    res.status(400).send({
      errorMessage: '댓글을 작성해주세요.',
    });
    return;
  }

  await Comment.updateOne(
    {
      $and: [{ postId }, { order }],
    },
    { $set: { comment } }
  );

  res.send();
});

router.delete('/delete/:postId', async (req, res) => {
  const { postId } = req.params;
  const { order } = req.body;

  await Comment.deleteOne({
    $and: [{ postId }, { order }],
  });

  res.send();
});

module.exports = router;
