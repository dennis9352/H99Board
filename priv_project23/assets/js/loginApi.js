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

function signIn() {
  let id = $('#id').val();
  let password = $('#password').val();
  $.ajax({
    type: 'POST',
    url: '/users/auth',
    data: {
      id: id,
      password: password,
    },
    success: function (response) {
      localStorage.setItem('token', response.token);
      window.location.replace('/');
    },
    error: function (error) {
      alert(error.responseJSON.errorMessage);
    },
  });
}
