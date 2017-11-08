
submit.onclick = function(event) {
  event.preventDefault();
  var toServer = {
    name: $('#name').val(),
    surname: $('#surname').val(),
    group: $('#group').val(),
    hallbook: $('#hallbook').val()
  }
  $.ajax({
    url: '/admin/students/add',
    type: 'POST',
    data: toServer,
    cache: false,
    success: function(response) {
      alert('test1')
    }
  });
  $('#discipline, #name, #surname, #group, #hallbook').val('');
};
