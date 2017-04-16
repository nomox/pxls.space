chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	if (request.action == "startBot") {
		StartNotabot(request.data);
		sendResponse({status: "ok"});
	} else {
		sendResponse({});
	}
});

function StartNotabot(data) {
	var _script = document.createElement('script');
	_script.type = "text/javascript";
	_script.src = "https://cdn.rawgit.com/NomoX/pxls.space/master/pxlsbot.min.js"; 
	_script.onload = function() {
		var b = new document.Notabot(data);
		b.start();
	};
	document.getElementsByTagName('head')[0].appendChild(_script);
}

(function(){
	
})();