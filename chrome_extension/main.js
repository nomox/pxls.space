document.addEventListener('DOMContentLoaded', function () {
	window.elements = getElements();
	window.elements.title.on("input", updateResource);
	window.elements.imageLink.on("input", updateResource);
	window.elements.x_axis.on("input", updateResource);
	window.elements.y_axis.on("input", updateResource);
	window.elements.direction.change(updateResource);

	window.elements.resource.change(updateData);
	// defauld values
	elements.title.val("Skorop");
	elements.imageLink.val("http://i.imgur.com/uJLPWv4.png");
	elements.x_axis.val("0");
	elements.y_axis.val("1600");

	updateResource();

	chrome.storage.local.get("profiles", function(result) {
		console.log(result);
	});

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
		var data getResource()
		var data_prep = {
			title: data.title,
			src: data.src, 
			x: data.x,
			y: data.y,
			ignore: [],
			dir: data.dir,
			pixelize: true
		};
		chrome.storage.local.get("profiles", function(result) {
			
		});
		chrome.storage.local.set({'profiles': data});

		chrome.tabs.getSelected(null, function(tab) {
			chrome.tabs.sendMessage(tab.id, {action: "startBot", data: data}, function(response) {
				console.log("response >> "+response.status);
			});
			
		});
	});
});
function getElements() {
	var elements = {
		profile: $("#profile"),
		resource: $("#resource"),
		title: $("#title"),
		imageLink: $("#imageLink"),
		x_axis: $("#x_axis"),
		y_axis: $("#y_axis"),
		direction: $("#direction")
	};
	return elements;
}
function updateData() {
	var json_data = atob(elements.resource.val());
	try {
		var data = JSON.parse(json_data);
		elements.resource.removeClass("error");
		putData(data);
	}
	catch(e) {
		elements.resource.addClass("error");
		//alert("Invalid token");
	}
	
}
function putData(data) {
	elements.title.val(data.title);
	elements.imageLink.val(data.src); 
	elements.x_axis.val(data.x);
	elements.y_axis.val(data.y);
	elements.direction.val(data.dir);
}
function updateResource() {
	elements.resource.val(btoa(JSON.stringify(getResource())));
}
function getResource() {
	var data = {
		title: elements.title.val(),
		src: elements.imageLink.val(), 
		x: elements.x_axis.val(),
		y: elements.y_axis.val(),
		dir: parseInt(elements.direction.val()),
	};
	return data;
}
