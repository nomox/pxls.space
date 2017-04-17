document.addEventListener('DOMContentLoaded', function () {
	// defauld values
	$("#title").val("Skorop");
	$("#imageLink").val("http://i.imgur.com/uJLPWv4.png");
	$("#x_axis").val("0");
	$("#y_axis").val("1600");

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
				title: $("#title").val(),
				src: $("#imageLink").val(), 
				x: parseInt($("#x_axis").val()),
				y: parseInt($("#y_axis").val()),
				ignore: [],
				dir: parseInt($("#direction").val()),
				pixelize: true
			};

			chrome.tabs.sendMessage(tab.id, {action: "startBot", data: data}, function(response) {
				console.log("response >> "+response.status);
			});
			
		});
	});
});