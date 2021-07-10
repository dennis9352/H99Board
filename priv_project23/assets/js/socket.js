let user1;
getSelf(function (u) {
  user1 = u;
});

function getSelf(callback) {
  $.ajax({
    type: 'GET',
    url: '/users/info',
    headers: {
      authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    success: function (response) {
      callback(response.user);
    },
  });
}

const socket = io.connect('/');

function postToServer(user, data) {
  socket.emit('posting', {
    nickname: user.nickname,
    channel: data.channel,
    title: data.title,
  });
}
socket.on('postingAlarm', function (data) {
  const { nickname, channel, title, date } = data;
  makePostNotification(nickname, channel, title, date);
});

function makePostNotification(targetNickname, channel, title, date) {
  const messageHtml = `<span class="alertMessage"> > <a style="color:yellow">${targetNickname}<a/>님이 방금 
  <a href="/${channel}" style="color: rgb(229, 33, 255); text-transform: uppercase;">${channel}</a>채널에 
  "${title}" 라는 새게시물을 작성했습니다.<br /><small>(${date})</small></span><br>`;
  const alt = $('#alertBox');
  if (alt.length) {
    alt.append(messageHtml);
  } else {
    return;
  }
}
