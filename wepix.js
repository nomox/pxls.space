$(document).on('keyup keydown', function(e){
document.shidted = e.shiftKey;
});
$( "#board" ).mousemove(function( event ) {
	var h = App.screenToBoardSpace(event.clientX, event.clientY);
	var oc = App.color;
	if (document.shidted)
  		App.put(0 | h.x, 0 | h.y);
	App.color = oc;
});
