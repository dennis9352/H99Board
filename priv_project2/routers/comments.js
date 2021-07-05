const express = require('express');
const router = express.Router();
const Comment = require('../models/comment');

router.post('/write', async (req, res) => {
  const { comment, userId, postId, nickname } = req.body;
  
  if (comment === "") {
    res.status(400).send({
        errorMessage: '댓글을 작성해주세요.',
    })
    return
}
  const maxOrder = await Comment.findOne({ postId }).sort('-order').exec();
  let order = 1;

  if (maxOrder) {
    order = maxOrder.order + 1;
  }
  const commentContext = new Comment({
    comment,
    userId,
    postId,
    nickname,
    order,
  });
  await commentContext.save();
  res.status(201).send();
});

router.get('/read/:postId', async (req, res) => {
    const { postId } = req.params;
    const comments = await Comment.find({ postId : postId });

    res.send({ comment : comments });
});


module.exports = router;
