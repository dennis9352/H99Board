if (localStorage.getItem('token')) {
  getSelf(function () {
    alert('이미 로그인이 되어있습니다. 채널페이지로 이동합니다.');
    window.location.replace('/');
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
      console.log(response);
      callback(response.user);
    },
  });
}

function signUp() {
  const nickname = $('#nickname').val();
  const id = $('#id').val();
  const password1 = $('#password1').val();
  const password2 = $('#password2').val();

  $.ajax({
    type: 'POST',
    url: '/users/regi',
    data: {
      nickname: nickname,
      id: id,
      password: password1,
      password2: password2,
    },
    success: function (response) {
      alert('회원가입을 축하드립니다!');
      window.location.replace('/login');
    },
    error: function (error) {
      alert(error.responseJSON.errorMessage);
    },
  });
}
