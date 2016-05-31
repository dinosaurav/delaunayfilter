function rgbToHex(r, g, b) {
	rStr = r.toString(16);
	gStr = g.toString(16);
	bStr = b.toString(16);
	if (rStr.length > 2) rStr = rStr.substr(0, 2);
	if (gStr.length > 2) gStr = gStr.substr(0, 2);
	if (bStr.length > 2) bStr = bStr.substr(0, 2);
	rStr = rStr.replace('.', '');
	gStr = gStr.replace('.', '');
	bStr = bStr.replace('.', '');

	if (rStr.length < 2) rStr = "0" + rStr;
	if (gStr.length < 2) gStr = "0" + gStr;
	if (bStr.length < 2) bStr = "0" + bStr;
	return "#" + rStr + gStr + bStr;
}


function delGradient(numPoints,canvasId, gradient) {
	function drawTriangle(a, b, c, context, color) {
		context.beginPath();
		context.lineWidth = 0;
		context.moveTo(a[0], a[1]);
		context.lineTo(b[0], b[1]);
		context.lineTo(c[0], c[1]);
		context.closePath();
		context.strokeStyle = color;
		context.stroke();
		context.fillStyle = color;
		context.fill();
	}

	function rgbToHex(r, g, b) {
		rStr = r.toString(16);
		gStr = g.toString(16);
		bStr = b.toString(16);
		if (rStr.length > 2) rStr = rStr.substr(0, 2);
		if (gStr.length > 2) gStr = gStr.substr(0, 2);
		if (bStr.length > 2) bStr = bStr.substr(0, 2);
		rStr = rStr.replace('.', '');
		gStr = gStr.replace('.', '');
		bStr = bStr.replace('.', '');

		if (rStr.length < 2) rStr = "0" + rStr;
		if (gStr.length < 2) gStr = "0" + gStr;
		if (bStr.length < 2) bStr = "0" + bStr;
		return "#" + rStr + gStr + bStr;
	}

	function hexToRgb(str) {
		rStr = str.substr(1, 2);
		gStr = str.substr(3, 2);;;
		bStr = str.substr(5, 2);
		return [parseInt(rStr, 16), parseInt(gStr, 16), parseInt(bStr, 16)];
	}

	function generatePoints() {
		var i;
		var points = [[0,0],[w,0],[0,h],[w,h],[w/2,0],[0,h/2],[w/2,h],[w,h/2]];
		var x1 = Math.round(Math.random() * w);
		var y1 = Math.round(Math.random() * h);
		for (i = 0; i < p; i++) {
			x1 = (x1 + Math.round(Math.random() * w * randomScale + w * (1.0 - randomScale) / p)) % w;//* 1.2) - w/10;
			y1 = (y1 + Math.round(Math.random() * h * randomScale + h * (1.0 - randomScale) / p)) % h;//* 1.2) - h/10;
			points.push([x1, y1]);
		}
		var temp, swapIndex;
		for (i = 4; i < points.length; i++) {
			swapIndex = Math.floor(Math.random() * (points.length - i)) + i;
			temp = points[i][1];
			console.log(swapIndex + " , " + i);
			points[i][1] = points[swapIndex][1];
			points[swapIndex][1] = temp;
		}
		return points;
	}

	function generateGradient(hex0,hex1) {
		var rgbo = hexToRgb(hexo);
		var rgbf = hexToRgb(hexf);
		return function(x,y,w,h) {
			ratio = x / w;
			return rgbToHex(rgbo[0] + (rgbf[0] - rgbo[0]) * ratio, rgbo[1] + (rgbf[1] - rgbo[1]) * ratio, rgbo[2] + (rgbf[2] - rgbo[2]) * ratio);
		};
	}

	var canvas = document.querySelector("#"+canvasId);
	var context = canvas.getContext("2d");
	var w = canvas.width;
	var h = canvas.height;
	var p = numPoints;
	var hexo = "#ffc367";
	var hexf = "#00aaaa";
	var randomScale = 1;
	var points = generatePoints(w,h,randomScale);
	var blah = Delaunay.triangulate(points);
	if (gradient == null || gradient == undefined) {
		gradient = generateGradient(hexo,hexf);
	}

	var colors = [];
	var a,b,c,mx,my;
	for (i = 0; i < blah.length/3; i++) {
		a = points[blah[3 * i]];
		b = points[blah[3 * i + 1]];
		c = points[blah[3 * i + 2]];
		mx = (a[0]+b[0]+c[0])/3;
		my = (a[1]+b[1]+c[1])/3;

		colors[i] = gradient(mx,my,w,h);
	}

	for (i = 0; i < blah.length/3; i++) {
		a = points[blah[3 * i]];
		b = points[blah[3 * i + 1]];
		c = points[blah[3 * i + 2]];
		drawTriangle(a, b, c, context, colors[i]); //"#49aaaa");
	}
}

var img = new Image();
var canvas = document.getElementById('starCanvas');
img.crossOrigin = "Anonymous";
img.onload = function() {
	canvas.width = img.width;
	canvas.height = img.height;
	//canvas.style.visibility = "hidden";
	canvas.getContext('2d').drawImage(img,0,0,img.width,img.height);
	delGradient(5000,"myCanvas",function (x,y,w,h) {
		var pixelData = canvas.getContext('2d').getImageData(x,y,1,1).data;
		return rgbToHex(pixelData[0],pixelData[1],pixelData[2]);
		//console.log(pixelData);
		//if (x>y) return "#55aa55";
		//return "#aa5555";
	});
}
img.src = "staraptor.png";


