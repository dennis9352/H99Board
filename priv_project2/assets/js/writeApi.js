$(document).ready(function () {
  channelHead();
});

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const channelName = urlParams.get('channel');

let user;
getSelf(function (u) {
  user = u;
});

function channelHead() {
  if (channelName === 'node') {
    name = 'NODE.JS';
  } else {
    name = channelName.toUpperCase();
  }
  $('#channelHeader').empty();
  let headTempHtml = `<h1
                          class = "${channelName}writeHead"
                          onclick="location.href='/${channelName}'"
                        >
                        ${name} 채널
                        </h1>`;
  $('#channelHeader').append(headTempHtml);
}

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

function writePost() {
  let title = $('#title').val();
  let context = $('#context').val();
  let userId = user.id;
  let nickname = user.nickname;
  let socketData = { title: title, channel: channelName };
  $.ajax({
    type: 'POST',
    url: '/posts/write',
    data: {
      title: title,
      context: context,
      channel: channelName,
      userId: userId,
      nickname: nickname,
    },
    success: function (response) {
      postToServer(user, socketData);
      alert('쓰기완료');
      window.location.href = `/${channelName}`;
    },
    error: function (error) {
      alert(error.responseJSON.errorMessage);
    },
  });
}
