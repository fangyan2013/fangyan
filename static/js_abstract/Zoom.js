var canvas, context;
var img, imgX = 0, imgY = 0, imgScale = 3;
var MINIMUM_SCALE = 1.0 ,pos={},posl={},dragging = false;


(function int() {
	canvas = document.getElementById('diagramContainer'); //画布对象
	context = canvas.getContext('2d');//画布显示二维图片
	loadImg();
	canvasEventsInit();

})();

function loadImg() {
	img = new Image();
	img.onload = function () {
		drawImage();
	}

	img.src = 'https://static.zhihu.com/liukanshan/images/comics/bg-89c9bdc3.jpg';//刘看山
}

function drawImage() {
	context.clearRect(0, 0, canvas.width, canvas.height);
	// 保证  imgX  在  [img.width*(1-imgScale),0]   区间内
	if(imgX<img.width*(1-imgScale)) {
		imgX = img.width*(1-imgScale);
	}else if(imgX>0) {
		imgX=0
	}
	// 保证  imgY   在  [img.height*(1-imgScale),0]   区间内
	if(imgY<img.height*(1-imgScale)) {
		imgY = img.height*(1-imgScale);
	}else if(imgY>0) {
		imgY=0
	}


	context.drawImage(
		img, //规定要使用的图像、画布或视频。
		0, 0, //开始剪切的 x 坐标位置。
		img.width, img.height,  //被剪切图像的高度。
		imgX, imgY,//在画布上放置图像的 x 、y坐标位置。
		img.width * imgScale, img.height * imgScale  //要使用的图像的宽度、高度
	);
}

/*事件注册*/
function canvasEventsInit() {
	canvas.onmousedown = function (event) {
		dragging = true;
		 pos = windowToCanvas(event.clientX, event.clientY);  //坐标转换，将窗口坐标转换成canvas的坐标

	};
	canvas.onmousemove = function (evt) {  //移动
		if(dragging){
		posl = windowToCanvas(evt.clientX, evt.clientY);
		var x = posl.x - pos.x, y = posl.y - pos.y;
		imgX  += x;
		imgY  += y;
			pos = JSON.parse(JSON.stringify(posl));
		drawImage();  //重新绘制图片
	}

	};
	canvas.onmouseup = function () {
		dragging = false;
	};
	canvas.onmousewheel = canvas.onwheel = function (event) {    //滚轮放大缩小
		var pos = windowToCanvas (event.clientX, event.clientY);
		event.wheelDelta = event.wheelDelta ? event.wheelDelta : (event.deltalY * (-40));  //获取当前鼠标的滚动情况
		var newPos = {x:((pos.x-imgX)/imgScale).toFixed(2) , y:((pos.y-imgY)/imgScale).toFixed(2)};
		if (event.wheelDelta > 0) {// 放大
				imgScale +=0.1;
				imgX = (1-imgScale)*newPos.x+(pos.x-newPos.x);
				imgY = (1-imgScale)*newPos.y+(pos.y-newPos.y);
		} else {//  缩小
			imgScale -=0.1;
			if(imgScale<MINIMUM_SCALE) {//最小缩放1
				imgScale = MINIMUM_SCALE;
			}
			imgX = (1-imgScale)*newPos.x+(pos.x-newPos.x);
			imgY = (1-imgScale)*newPos.y+(pos.y-newPos.y);
			console.log(imgX,imgY);
			}
		drawImage();   //重新绘制图片

	};
}
/* source-atop */

/*坐标转换*/
function windowToCanvas(x,y) {
	var box = canvas.getBoundingClientRect();  //这个方法返回一个矩形对象，包含四个属性：left、top、right和bottom。分别表示元素各边与页面上边和左边的距离
	return {
		x: x - box.left - (box.width - canvas.width) / 2,
		y: y - box.top - (box.height - canvas.height) / 2
	};
}
