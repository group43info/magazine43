
var count = 0;
function new_theme(){
	let date = document.getElementById('date');
	let theme = document.getElementById('theme');
	let th1 = document.createElement('th');
	let th2 = document.createElement('th');
	let date_insert = new Date();
	let theme_insert = 'Тема';
	theme_insert.title = 'Test';
	let btn = '<button onclick = addDate(this)></button>';
	// let dateresult = date_insert.getDate() + '/' + date_insert.getMonth();
	
	th1.innerHTML = '<a href="#addTheme"><span>'+ date_insert.getDate() + '</span>'+ '/' + '<span>' + date_insert.getMonth() + '</span></a>';
	th2.innerHTML = '<a href="#addTheme"><span class="theme">Введiть тему</span></a>';
	date.appendChild(th1);
	theme.appendChild(th2);
}
function addDate(even) {
	if(count === 0){
even.style.border = '2px solid green';
$(even).parent().children('span').prop('contenteditable','true');
count = 1;
} else {
even.style.border = 'none';
$(even).parent().children('span').prop('contenteditable','false');
$(even).parent().children('span').prop('maxlength','2');
count = 0;
}
}

	submit.onclick = function(event) {
    	event.preventDefault();
    	let theme = document.getElementById('themetoServer').value;
    	let date = document.getElementById('datetoSever').value;
    	var toServer = {
       		theme: theme,
       		date: date
      	}

      $.ajax({
        url: '/index/:id/addTheme',
        type: 'POST',
        data: toServer,
        cache: false,
        success: function(response) {
          var theme = document.getElementsByClassName('theme');
          
        }
      });
      
	  $('#themetoServer, #datetoSever').val('');
        }