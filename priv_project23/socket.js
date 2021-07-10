const socketIo = require('socket.io');
const http = require('./app');
const io = socketIo(http);
const moment = require('moment');
require('moment-timezone');
moment.tz.setDefault('Asia/Seoul');

io.on('connection', (socket) => {
  const currentDate = moment().format('YYYY-MM-DD HH:mm:ss');

  socket.on('posting', (data) => {
    console.log(
      `${data.nickname}님이 ${data.channel}채널에 " ${data.title} "의 새게시물을 썼습니다.`
    );
    const payload = {
      nickname: data.nickname,
      channel: data.channel,
      title: data.title,
      date: currentDate,
    };
    io.emit('postingAlarm', payload);
  });

  socket.on('message', (data) => {
    console.log(
      '-------------------------------------------------------------'
    );
    console.log('연결하였습니다.', currentDate);
    console.log(data);
    console.log(
      '-------------------------------------------------------------'
    );
  });
  socket.on('chatMessage', (data) => {
    const msg = {
      sendMsg: data.message1,
      nickname: data.user1.nickname,
      data: currentDate,
    };
    io.emit('receiveMsg', msg);
  });
  socket.emit('message', '어서오세요');
  socket.broadcast.emit('message', 'someone got entered');

  socket.on('disconnct', () => {
    io.emit('message', 'a user has left');
  });
});
