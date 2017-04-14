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

	var checkPageButton = document.getElementById('startbot');
	checkPageButton.addEventListener('click', function() { 
		chrome.tabs.getSelected(null, function(tab) {

			chrome.tabs.sendRequest(tab.id, {action: "getHtml"}, function(response) {
				console.log(response);
				
			});
			
		});
	});
});