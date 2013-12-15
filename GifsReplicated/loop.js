$(document).ready(function() {
	var canvas = $("#canvas")[0];
	var context = canvas.getContext('2d');
	var h = canvas.height;
	var w = canvas.width;
	var angle = 0;
	var stationaryPoint = {x: w/3.5, y: h/2};
	var circle = {x: w/2, y: h/2, radius: 80, posX: 0, posY: 0};
	var anchoredLine = {length: circle.x - stationaryPoint.x, x: circle.x, y: circle.y};
	var movingLine = {length: circle.radius * 2, x1: circle.x * 2, y1: circle.y, x2: anchoredLine.x, y2: anchoredLine.y};
	var lemniscate = new LemniscateList();
	
	var showMovingLineCircle = false;
	var showAnchoredLineCircle = false;
	var showMidpointLineCircle = false;
	var showAlert = false;
	fillBG();
	
	animate();
	
	$(document).keydown(function(e) {
		var key = e.which;
		
		if (showAlert) {
			alert(key);
		}
		if (key == "49") showMovingLineCircle = !showMovingLineCircle;
		else if (key == "50") showAnchoredLineCircle = !showAnchoredLineCircle;
		else if (key == "51") showMidpointLineCircle = !showMidpointLineCircle;
		else if (key == "65") { showAlert = !showAlert;}
		
	})
    
	function animate() {
        // update
		angle -= 1;
		angle %= 360;
		circle.posX = (Math.cos(convertToRadians(angle)) * circle.radius) + circle.x;
		circle.posY = (Math.sin(convertToRadians(angle)) * circle.radius) + circle.y;
		findDistanceBetweenCircles();
		findMovingLine();
        // clear
        context.clearRect(0, 0, canvas.width, canvas.height);

        // draw
		fillBG();
		drawCircleEndpoint();
		drawStationaryPoint();
		drawAnchoredLine();
		drawMidpointLine();
		drawMovingCircleRadius();
		displayHelpText();
		if(showMovingLineCircle) {
			drawMovingLineCircle();
		}
		if(showMidpointLineCircle) {
			drawMidpointLineCircle();
		}
		if(showAnchoredLineCircle) {
			drawAnchoredLineCircle();
		}

		drawLemniscate();
		
		// request new frame
        requestAnimationFrame(function() {
          animate();
        });
    }
	
	function convertToRadians(degrees) {
		return degrees * (Math.PI/180)
	}
	
	function findMovingLine() {
		var roundedX = Math.round(rotatedIntersectX);
		var roundedY = Math.round(rotatedIntersectY);
		if (roundedX == 300 && roundedY == 200) {
			anchoredLine.x = rotatedIntersectX2;
			anchoredLine.y = rotatedIntersectY2;
		} else {
			anchoredLine.x = rotatedIntersectX;
			anchoredLine.y = rotatedIntersectY;
		}
		movingLine.x1 = anchoredLine.x;
		movingLine.y1 = anchoredLine.y;
		
		var deltaX = movingLine.x1 - circle.posX;
		var deltaY = movingLine.y1 - circle.posY;
		movingLine.x2 = circle.posX - deltaX;
		movingLine.y2 = circle.posY - deltaY;
	}
	
	var rotatedIntersectX;
	var rotatedIntersectX2;
	var rotatedIntersectY;
	var rotatedIntersectY2;
	
	function findDistanceBetweenCircles() {
	//http://paulbourke.net/geometry/circlesphere/
		var circleCenterTwo = {x: circle.posX, y: circle.posY};
		var circleCenterOne = {x: stationaryPoint.x, y: stationaryPoint.y};
		
		var radiusTwo = movingLine.length/2;
		var radiusOne = anchoredLine.length;
		
		
		var dx = circleCenterOne.x - circleCenterTwo.x;
		var dy = circleCenterOne.y - circleCenterTwo.y;
		var distance = Math.sqrt((dy*dy) + (dx*dx));
		
		//Check values
		if (distance > radiusOne + radiusTwo) {
			return;	//No solutions - circles are separate
		} else if (distance < Math.abs(radiusOne - radiusTwo)) {
			return; //No solutions - one circle is inside another
		} else if (distance == 0 && radiusOne == radiusTwo) {
			return; //Circles are same, infinite solutions
		}
		
		var distanceFromCircleOneToIntersectionLine = (square(radiusOne) - square(radiusTwo) + square(distance));
		var distanceFromCircleOneToIntersectionLine = distanceFromCircleOneToIntersectionLine / (2*distance);
		var intersectionLineHeight = Math.sqrt(square(radiusOne) - square(distanceFromCircleOneToIntersectionLine));
		
		var intersectionLineX = circleCenterOne.x + (dx * distanceFromCircleOneToIntersectionLine / distance);
		var intersectionLineY = circleCenterOne.y + (dy * distanceFromCircleOneToIntersectionLine / distance);
		
		var offsetX = -dy * (intersectionLineHeight/distance);
		var offsetY = dx * (intersectionLineHeight/distance);

		var intersectX = intersectionLineX + offsetX;
		var intersectY = intersectionLineY + offsetY;
		
		var intersectX2 = intersectionLineX - offsetX;
		var intersectY2 = intersectionLineY - offsetY;
		
		rotatedIntersectX = ((intersectX - circleCenterOne.x) * -1) + circleCenterOne.x;
		rotatedIntersectY = (-1 * (intersectY - circleCenterOne.y)) + circleCenterOne.y;
		
		rotatedIntersectX2 = ((intersectX2 - circleCenterOne.x) * -1) + circleCenterOne.x;
		rotatedIntersectY2 = ((intersectY2 - circleCenterOne.y) * -1) + circleCenterOne.y;
		
		context.fillStyle = "black";
		context.fillRect(rotatedIntersectX, rotatedIntersectY, 4,4);
		context.fillRect(rotatedIntersectX2, rotatedIntersectY2, 4,4);
	}
	
	function square(value) {
		return value*value;
	}

	function LemniscateList() {
		this.full = false;	//Use pop()
		this.pointArray = [];
		
		this.addPoint = function(point) {
			if(!this.full && this.pointArray.length > (3*w/4)) {
				this.full = true;
			}
			this.pointArray.unshift(point);
			if (this.full) {
				this.pointArray.pop();
			}
		}
		
		this.draw = function() {
			context.strokeStyle = "green";
			for (var i=1; i<this.pointArray.length; i++) {
				context.beginPath();
				context.lineWidth = 2;
				context.moveTo(this.pointArray[i-1].x, this.pointArray[i-1].y);
				context.lineTo(this.pointArray[i].x, this.pointArray[i].y);
				context.stroke();
				context.closePath();
			}
		}
	}
	
	function drawMidpointLine() {
		context.beginPath();
		context.lineWidth = 2;
		context.strokeStyle = "blue";
		context.moveTo(movingLine.x2, movingLine.y2);
		context.lineTo(movingLine.x1, movingLine.y1);
		context.stroke();
		context.closePath();
	}
	
	function drawLemniscate() {
		var pointToAdd = {x: movingLine.x2, y:movingLine.y2};
		lemniscate.addPoint(pointToAdd);
		lemniscate.draw();
	}
	
	function drawMovingLineCircle() {
		context.strokeStyle = "red";
		context.beginPath();
		context.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2, false);
		context.stroke();
		context.closePath();
	}
	
	function drawMovingCircleRadius() {
		context.strokeStyle = "red";	
		context.beginPath();
		context.moveTo(circle.posX, circle.posY);
		context.lineTo(circle.x, circle.y);
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
	
	function drawAnchoredLineCircle() {
		context.strokeStyle = "blue";
		context.beginPath();
		context.arc(stationaryPoint.x, stationaryPoint.y, anchoredLine.length, 0, 2*Math.PI, true);
		context.stroke();
		context.closePath();
	}
	
	function drawMidpointLineCircle() {
		context.strokeStyle = "red";
		context.beginPath();
		context.arc(circle.posX, circle.posY, movingLine.length/2, 0, 2*Math.PI, true);
		context.stroke();
		context.closePath();
	}
	
	function drawCircleEndpoint() {
		context.fillStyle = "black";
		context.fillRect(circle.posX-2,circle.posY - 2,4, 4);
	}
	
	function displayHelpText() {
		context.font="15px Arial";
		context.fillText("Press 1 to see moving line radius",10,20);
		context.fillText("Press 2 to see stationary line radius", 10, 40);
		context.fillText("Press 3 to see midpoint line radius", 10, 60);
	}
	

	
	function fillBG() {
		context.fillStyle = "white";
		context.fillRect(0,0,w,h);
		context.strokeStyle = "black";
		context.strokeRect(0,0,w,h);
	}

})