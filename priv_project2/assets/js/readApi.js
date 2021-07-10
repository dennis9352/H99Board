$(document).ready(function () {
  channelHead();
  userCheck();
  readComment();
});

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const channelName = urlParams.get('channel').split('?')[0];
const postId = urlParams.get('channel').split('?')[1].split('=')[1];

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

function userCheck() {
  if (localStorage.getItem('token')) {
    readPost();
  } else {
    readPostUnuser();
  }
}

function readPostUnuser() {
  $('#postDetails').empty();
  $.ajax({
    type: 'GET',
    url: `posts/read/${postId}`,
    data: {},
    success: function (response) {
      const post = response['post'][0];
      $('#titlePost').text(post['title']);
      let posthtml = ` <h1 style="color: azure;font-family: Sam3KRFont;">${post['title']}</h1>
                          <div style="color: azure;font-family: Sam3KRFont;">
                              <span>${post['nickname']}</span> 
                              <span style="color: rgb(131, 131, 131);"> | </span>
                              <span>${post['date']}</span>
                              <span style="color: rgb(131, 131, 131);"> | </span>
                              <span> 조회: ${post['view']}</span>
                              
                              <p style="margin-top: 30px;">${post['context']}</p>

                          </div>`;
      $('#postDetails').append(posthtml);
    },
  });
}

function readPost() {
  getSelf(function (user) {
    $('#postDetails').empty();
    const userId = user.id;
    $.ajax({
      type: 'GET',
      url: `posts/read/${postId}/${userId}`,
      data: {},
      success: function (response) {
        const post = response['post'][0];
        $('#titlePost').text(post['title']);
        let posthtml = ` <h1 style="color: azure;font-family: Sam3KRFont;">${post['title']}</h1>
                          <div style="color: azure;font-family: Sam3KRFont;">
                              <span>${post['nickname']}</span> 
                              <span style="color: rgb(131, 131, 131);"> | </span>
                              <span>${post['date']}</span>
                              <span style="color: rgb(131, 131, 131);"> | </span>
                              <span> 조회: ${post['view']}</span>
                              
                              <p style="margin-top: 30px;">${post['context']}</p>

                          </div>`;
        $('#postDetails').append(posthtml);
      },
    });
  });
}

function readComment(comment) {
  $('#pastComment').empty();
  $.ajax({
    type: 'GET',
    url: `comments/read/${postId}`,
    data: {},
    success: function (response) {
      const comment = response['comment'];
      if (!localStorage.getItem('token')) {
        for (let i = 0; i < comment.length; i++) {
          makeComment(comment[i]);
        }
      } else {
        getUserData(comment);
      }
    },
  });
}

function getUserData(comment) {
  $.ajax({
    type: 'GET',
    url: '/users/info',
    headers: {
      authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    success: function (response) {
      user = response['user'];
      for (let i = 0; i < comment.length; i++) {
        makeCommentUser(comment[i], user);
      }
    },
  });
}

function makeComment(comment) {
  let commentHtml = `<div class="pastCommentUser" style="margin-top: 30px;">${comment['nickname']}</div>
                      <div id="pastCommentContext" class="pastCommentContext"placeholder="comment">${comment['comment']} </div>
                    `;
  $('#pastComment').append(commentHtml);
}

function makeCommentUser(comment, user) {
  if (comment['userId'] === user.id) {
    let commentHtml1 = `<div class="pastCommentUser" style="margin-top: 30px;">${comment['nickname']}
                      <span>${comment['date']} </span>
                      <button style="float:right; margin-right: 10px" onclick="openEdit(${comment['order']})">수정</button>
                      <button style="float:right" onclick="deleteComment(${comment['order']})">삭제</button>
                      </div>
                      <div id="pastCommentContext${comment['order']}" class="pastCommentContext"placeholder="comment">${comment['comment']}</div>
                      <input type="text" style="display: none; width: 1048px; height: 57px" class="editnewComment" id='commentOrder${comment['order']}'">
                      <button style="display: none; z-index:999; margin-left: 1020px; margin-bottom:0px" onclick="editComment(${comment['order']})" id ="editOrder${comment['order']}">확인</button>
                    `;
    $('#pastComment').append(commentHtml1);
  } else {
    let commentHtml2 = `<div class="pastCommentUser" style="margin-top: 30px;">${comment['nickname']}</div>
                      <div id="pastCommentContext" class="pastCommentContext"placeholder="comment">${comment['comment']} </div>
                    `;
    $('#pastComment').append(commentHtml2);
  }
}

function writeComment() {
  getSelf(function getCommentData(user) {
    let comment = $('#newComment').val();
    let userId = user.id;
    let nickname = user.nickname;

    $.ajax({
      type: 'POST',
      url: '/comments/write',
      data: {
        comment: comment,
        postId: postId,
        userId: userId,
        nickname: nickname,
      },
      success: function (response) {
        alert('쓰기완료');
        window.location.reload();
      },
      error: function (error) {
        alert(error.responseJSON.errorMessage);
      },
    });
  });
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

function commentCheck() {
  if (!localStorage.getItem('token')) {
    alert('로그인후 사용가능합니다.');
    window.location.replace(`/login.html`);
  }
}

function openEdit(order) {
  $.ajax({
    type: 'POST',
    url: `comments/read/edit/${postId}`,
    data: { order: order },
    success: function (response) {
      const comment = response['comment'];
      const preDiv = document.getElementById(`pastCommentContext${order}`);
      const div = document.getElementById(`commentOrder${order}`);
      const button = document.getElementById(`editOrder${order}`);

      if (div.style.display === 'none') {
        preDiv.style.display = 'none';
        div.style.display = 'block';
        button.style.display = 'block';
        $(`#commentOrder${order}`).val(`${comment['comment']}`);
      } else {
        preDiv.style.display = 'block';
        div.style.display = 'none';
        button.style.display = 'none';
      }
    },
  });
}

function editComment(order) {
  let newComment = $(`#commentOrder${order}`).val();

  $.ajax({
    type: 'PUT',
    url: `comments/edit/${postId}`,
    data: {
      comment: newComment,
      order: order,
    },
    success: function (response) {
      alert('수정되었습니다.');
      window.location.reload();
    },
  });
}

function deleteComment(order) {
  const answer = confirm('정말로 삭제하시겠습니까?');
  if (!answer) {
    return;
  } else {
    $.ajax({
      type: 'DELETE',
      url: `comments/delete/${postId}`,
      data: {
        order: order,
      },
      success: function (response) {
        alert('삭제되었습니다.');
        window.location.reload();
      },
    });
  }
}
