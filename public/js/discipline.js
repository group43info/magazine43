submit.onclick = function(event) {
  event.preventDefault();
  var toServer = {
    discipline: $('#discipline').val()
  }
  $.ajax({
    url: '/admin/discipline/add',
    type: 'POST',
    data: toServer,
    cache: false,
    success: function(response) {
      alert('test1')
    }
  });
  $('#discipline').val('');
};
