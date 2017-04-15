# pxls.space auto placer by NomoX
![EBIN](/chrome_extension/icon.png?raw=true)

Using 
```javascript
(function(){
	var _script = document.createElement('script');
	_script.type = "text/javascript";
	_script.src = "https://cdn.rawgit.com/NomoX/pxls.space/master/pxlsbot.min.js";
	_script.onload = function() {
		var b = new Notabot({
			title: "Title", /* title */
			src: "http://i.imgur.com/SUyWF5x.png", /* image url or Base64 */
			x: 60, /* x offset */
			y: 1501, /* y offset */
			ignore: [], /* alpha colors ex. [[255, 0, 255, 255], [0, 0, 0, 255]] */
			dir: 0, /* 0 - random (default), 1 - left-right, 2 - right-left, 3 - top-bottom, 4 - bottom-top, 5 -chess */
			pixelize: true /* false (default), find nearest color for a pixel */
		});
		b.start();
	}
	document.getElementsByTagName('head')[0].appendChild(_script);
})();
```
