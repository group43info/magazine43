
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
	
	th1.innerHTML = '<span>'+ date_insert.getDate() + '</span>'+ '/' + '<span>' + date_insert.getMonth() + '</span>' + btn;
	th2.innerHTML = '<span>'+ theme_insert + '</span>'+ btn;
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
count = 0;
}
}
// $(document).ready(function () {
// 	$('.togl').toggle(function () {
// 		even.style.border = '2px solid green';
// 		$(even).parent().children('span').prop('contenteditable','true');
// 	},
// 	function () {
// 		even.style.border = 'none';
// 		$(even).parent().children('span').prop('contenteditable','false');
// 	});
// });
