$(document).ready(function() {
	var canvas = $("#canvas")[0];
	var context = canvas.getContext('2d');
	var h = canvas.height;
	var w = canvas.width;
	var angle = 0;
	var stationaryPoint = {x: w/6, y: h/2};
	var circle = {x: w/2, y: h/2, radius: 80, posX: 0, posY: 0};
	var anchoredLine = {length: circle.x - stationaryPoint.x, x: circle.x, y: circle.y};
	var movingLine = {length: circle.radius * 2, x1: circle.x * 2, y1: circle.y, x2: anchoredLine.x, y2: anchoredLine.y};
	fillBG();
	
	animate();
    
	function animate() {
        // update
		angle -= 1;
		angle %= 360;
		circle.posX = (Math.cos(convertToRadians(angle)) * circle.radius) + circle.x;
		circle.posY = (Math.sin(convertToRadians(angle)) * circle.radius) + circle.y;
		findMovingLine();
        // clear
        context.clearRect(0, 0, canvas.width, canvas.height);

        // draw
		fillBG();
		drawCircle();
		drawStationaryPoint();
		drawAnchoredLine();
		drawMovingLine();
		
        // request new frame
        requestAnimationFrame(function() {
          animate();
        });
    }
	
	function findMovingLine() {
		movingLine.x1 = circle.posX - movingLine.length/2;
		movingLine.y1 = circle.posY;
		movingLine.x2 = circle.posX + movingLine.length/2;
		movingLine.y2 = circle.posY;
		anchoredLine.x = movingLine.x1;
		anchoredLine.y = movingLine.y1;
		var deltaX = movingLine.x2 - anchoredLine.x;
		var deltaY = movingLine.y2 - anchoredLine.y;
		//movingLine.y1 = deltaY * anchoredLine.length;
		//movingLine.x1 = deltaX * anchoredLine.length;
	}
	
	function drawMovingLine() {
		context.beginPath();
		context.lineWidth = 2;
		context.strokeStyle = "blue";
		context.moveTo(movingLine.x2, movingLine.y2);
		context.lineTo(movingLine.x1, movingLine.y1);
		context.stroke();
		context.closePath();
	}
	
	function drawStationaryPoint() {
		context.fillStyle = "black";
		context.fillRect(stationaryPoint.x, stationaryPoint.y, 4,4);
	}
	
	function drawAnchoredLine() {
		context.beginPath();
		context.lineWidth = 2;
		context.strokeStyle = "blue";
		context.moveTo(stationaryPoint.x, stationaryPoint.y);
		context.lineTo(anchoredLine.x, anchoredLine.y);
		context.stroke();
		context.closePath();
	}
	
	function drawCircle() {
		context.fillStyle = "black";
		context.fillRect(circle.posX-2,circle.posY - 2,4, 4);
	}
	
	function convertToRadians(degrees) {
		return degrees * (Math.PI/180)
	}
	
	function fillBG() {
		context.fillStyle = "white";
		context.fillRect(0,0,w,h);
		context.strokeStyle = "black";
		context.strokeRect(0,0,w,h);
	}

})