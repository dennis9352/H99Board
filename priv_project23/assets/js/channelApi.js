if (localStorage.getItem('token')) {
  getSelf(function (user) {
    const div = document.getElementById('nicknameBox');
    div.style.display = 'block';
    $('#welcomeNickname').empty();
    $('#welcomeNickname').text(user.nickname);
  });
}

$(document).ready(function () {
  listRecentPost();
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

function welcoming() {
  if (localStorage.getItem('token')) {
    $('#channelHeader').empty();
  }
}

function signOut() {
  if (!localStorage.getItem('token')) {
    alert('로그인을 해야 로그아웃을 하죠 이사람아.');
  } else {
    localStorage.clear();
    alert('정상적으로 로그아웃 하셨습니다.');
    window.location.href = '/';
  }
}

function listRecentPost() {
  $('#reactRecentPost').empty();
  $('#nodeRecentPost').empty();
  $('#springRecentPost').empty();
  $.ajax({
    type: 'GET',
    url: `posts/list`,
    data: {},
    success: function (response) {
      const node = response['node'];
      const react = response['react'];
      const spring = response['spring'];
      for (let i = 0; i < node.length; i++) {
        makePost1(node[i]);
      }

      for (let j = 0; j < react.length; j++) {
        makePost2(react[j]);
      }

      for (let k = 0; k < spring.length; k++) {
        makePost3(spring[k]);
      }
    },
  });
}

function makePost1(node) {
  daysDate1 = node['date'].split(' ')[0];

  let noderecentPostHtml = `<div class="recentPostEach" onclick="location.href='/read?channel=node?postId=${node['id']}'">
                        <span class="channelPost" style=" display: inline-block; width: 200px;white-space: nowrap;text-overflow: ellipsis;overflow: hidden;">
                          ${node['title']}
                        </span>
                        <span class="channelPost">
                          ${daysDate1}
                        </span>
                      </div>`;

  $(`#nodeRecentPost`).append(noderecentPostHtml);
}
function makePost2(react) {
  daysDate2 = react['date'].split(' ')[0];
  let reactrecentPostHtml = `<div class="recentPostEach" onclick="location.href='/read?channel=react?postId=${react['id']}'">
                      <span style=" display: inline-block; width: 200px;white-space: nowrap;text-overflow: ellipsis;overflow: hidden;">
                        ${react['title']}
                      </span>
                      <span >
                        ${daysDate2}
                      </span>
                    </div>`;
  $(`#reactRecentPost`).append(reactrecentPostHtml);
}

function makePost3(spring) {
  daysDate3 = spring['date'].split(' ')[0];
  let springrecentPostHtml = `<div class="recentPostEach" onclick="location.href='/read?channel=spring?postId=${spring['id']}'">
                      <span style=" display: inline-block; width: 200px;white-space: nowrap;text-overflow: ellipsis;overflow: hidden;">
                        ${spring['title']}
                      </span>
                      <span >
                        ${daysDate3}
                      </span>
                    </div>`;
  $(`#springRecentPost`).append(springrecentPostHtml);
}

function writeCheck() {
  if (!localStorage.getItem('token')) {
    alert('로그인후 사용가능합니다.');
    window.location.replace(`/login`);
  }
}

const socket1 = io.connect('/');

socket1.on('message', (message) => {
  console.log(message);
});

function msgToServer() {
  let message1 = $('#putMessage').val();
  if (message1 == '') {
    return;
  }
  socket1.emit('chatMessage', { message1, user1 });
}

socket1.on('receiveMsg', function (data) {
  showMessage(data);
});

function showMessage(data) {
  console.log(data);
  let msgHtml = `<span style="color: white;">>..${data['nickname']}님: ${data['sendMsg']}</span><br>`;
  $('#chats').append(msgHtml);
  $('#putMessage').val('');
}
