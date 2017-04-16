document.addEventListener('DOMContentLoaded', function () {
	var links = document.getElementsByTagName("a");
	for (var i = 0; i < links.length; i++) {
		(function () {
			var ln = links[i];
			var location = ln.href;
			ln.onclick = function () {
				chrome.tabs.create({active: true, url: location});
			};
		})();
	}

	$("#startbot").click(function(){
		chrome.tabs.getSelected(null, function(tab) {

			var data = {
				title: "GUMI",
				src: "http://i.imgur.com/Ppdzqpt.png", 
				x: 400,
				y: 1280, 
				ignore: [],
				dir: 0,
				pixelize: true
			};

			chrome.tabs.sendMessage(tab.id, {action: "startBot", data: data}, function(response) {
				console.log("response >> "+response.status);
			});
			
		});
	});
});