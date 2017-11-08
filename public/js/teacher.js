
submit.onclick = function(event) {
  event.preventDefault();
  var toServer = {
    name: $('#name').val(),
    surname: $('#surname').val(),
    email: $('#email').val(),
    password: $('#password').val()
  }
  $.ajax({
    url: '/admin/teachers/add',
    type: 'POST',
    data: toServer,
    cache: false,
    success: function(response) {
      if (response.status === 'bad') {
        alert('Ця пошта використовується!')
      }
    }
  });
  $('#discipline, #name, #surname, #email, #password').val('');
};
