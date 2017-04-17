chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	if (request.action == "startBot") {
		StartNotabot(request.data);
		sendResponse({status: "ok"});
	} else {
		sendResponse({});
	}
});

function StartNotabot(data) {
	var json_data = JSON.stringify(data);

	var _script = document.createElement('script');
	_script.type = "text/javascript";
	_script.src = "https://cdn.rawgit.com/NomoX/pxls.space/17ceebd5/pxlsbot.min.js"; 
	_script.onload = function() {
		var _injector = document.createElement('script');
		_injector.type = "text/javascript";
		_injector.innerHTML = ""+
			"var b = new NomoXBot(JSON.parse('"+json_data+"'));"+
			"b.start();";
		document.getElementsByTagName('head')[0].appendChild(_injector);
	};
	document.getElementsByTagName('head')[0].appendChild(_script);
	
	
}

(function(){
	
})();