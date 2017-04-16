(function(){
	var _script = document.createElement('script');
	_script.type = "text/javascript";
	_script.src = "https://cdn.rawgit.com/NomoX/pxls.space/master/pxlsbot.min.js";
	_script.onload = function() {
		var b = new NomoXBot({
			title: "Прапор і Скороп", /* title */
			src: "http://vkontate.zzz.com.ua/nomox/botimg.png", /* image url or Base64 */
			x: 0, /* x offset */
			y: 1600, /* y offset */
			ignore: [], /* alpha colors ex. [[255, 0, 255, 255], [0, 0, 0, 255]] */
			priority: [], /* priority colors ex. [[255, 0, 255, 255], [0, 0, 0, 255]] */
			dir: 0, /* 0 - random (default), 1 - left-right, 2 - right-left, 3 - top-bottom, 4 - bottom-top */
			pixelize: true /* false (default) */
		});
		b.start();
	}
	document.getElementsByTagName('head')[0].appendChild(_script);
})();