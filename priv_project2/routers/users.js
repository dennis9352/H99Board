const express = require('express');
const router = express.Router();
const User = require('../models/user');
const authMiddleware = require('../middlewares/auth-middleware');
const jwt = require('jsonwebtoken');

router.post('/regi', async (req, res) => {
  const { nickname, id, password, password2 } = req.body;
  const idValidation = /^(?=.*[a-zA-z])(?=.*[0-9]).{3,}$/;
  const pwValidation = /^(?=.*[a-zA-z0-9]).{4,}$/;

  if (!idValidation.test(id)) {
    res.status(400).send({
      errorMessage: '아이디가 조건에 맞지않습니다.',
    });
    return;
  }

  if (!pwValidation.test(password)) {
    res.status(400).send({
      errorMessage: '비밀번호가 조건에 맞지않습니다.',
    });
    return;
  }

  if (password.search(id) > -1) {
    res.status(400).send({
      errorMessage: '비밀번호에 아이디가 포함되어있습니다.',
    });
    return;
  }

  if (password !== password2) {
    res.status(400).send({
      errorMessage: '패스워드가 일치하지 않습니다.',
    });
    return;
  }

  if (nickname == '') {
    res.status(400).send({
      errorMessage: '닉네임을 입력해주세요.',
    });
    return;
  }

  const existUsers = await User.find({
    $or: [{ id }, { nickname }],
  });
  if (existUsers.length) {
    res.status(400).send({
      errorMessage: '이미 가입된 ID나 닉네임이 있습니다.',
    });
    return;
  }

  const user = new User({ id, nickname, password });
  await user.save();
  res.status(201).send();
});

router.post('/auth', async (req, res) => {
  const { id, password } = req.body;

  const user = await User.findOne({ id, password }).exec();

  if (!user) {
    res.status(400).send({
      errorMessage: '닉네임 또는 패스워드를 확인해주세요.',
    });
    return;
  }

  const token = jwt.sign({ userId: user.userId }, 'tlzmfltzl');
  res.send({
    token,
  });
});

router.get('/info', authMiddleware, async (req, res) => {
  const { user } = res.locals
  console.log(user)
  res.send({
      user: {
          id: user.id,
          nickname: user.nickname,
      },
  })
})


module.exports = router;
