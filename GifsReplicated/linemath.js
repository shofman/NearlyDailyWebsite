$(document).ready(function() {
	var canvas = $("#canvas")[0];
	var context = canvas.getContext('2d');
	var w = canvas.width;
	var h = canvas.height;
	var circle = {x: w/8, y:h/6, radius: h/8};
	var square = {x: circle.x-circle.radius, y:circle.y - circle.radius + h/3, length: circle.radius*2};
	var hex = {middle: circle.x, top: circle.y - circle.radius + 2*h/3, right: 25 * (Math.sqrt(3) + 3), left: -25 * (Math.sqrt(3) - 3), upper: 125/3 + 2*h/3, lower: 275/3 + 2*h/3, bottom: circle.y + circle.radius + 2*h/3};
	var drawPointSize = 2;
	var movePointSize = 4;
	
	var circleMovePoint = new CircleMovePoint(circle.x + circle.radius - movePointSize/2,circle.y, "black", movePointSize);
	var squareMovePoint = new SquareMovePoint(square.x + square.length/2 - movePointSize/2, square.y, "black", movePointSize);
	var hexMovePoint = new HexMovePoint(circle.x + circle.radius - movePointSize/2,circle.y + 2*h/3, "black", movePointSize);
	var circleArray = new CurveFunction();
	var squareArray = new CurveFunction();
	var hexArray = new CurveFunction();
	
	animate();
	
	function animate() {
        // update
		//Circles
		circleMovePoint.move();
		var newPoint = new Point(w/4 + 1, circleMovePoint.posY, "blue", drawPointSize);
		circleArray.addPoint(newPoint);
		
		//Squares
		squareMovePoint.move();
		var newPoint = new Point(w/4 + 1, squareMovePoint.posY, "red", drawPointSize);
		squareArray.addPoint(newPoint);
		
		//Hex
		hexMovePoint.move();
		var newPoint = new Point(w/4 + 1, hexMovePoint.posY, "green", drawPointSize);
		hexArray.addPoint(newPoint);
		
        // clear
        context.clearRect(0, 0, canvas.width, canvas.height);

        // draw
		//background
		bgFill();
		
		//Circles
		circleMovePoint.draw();
		circleMovePoint.drawLineToCurve();
		circleArray.draw();
		
		//Squares
		squareMovePoint.draw();
		squareMovePoint.drawLineToCurve();
		squareArray.draw();
		
		//Hex
		hexMovePoint.draw();
		hexMovePoint.drawLineToCurve();
		hexArray.draw();

        // request new frame
        requestAnimationFrame(function() {
          animate();
        });
    }
	
	function drawSquare() {
		context.strokeStyle = "red";
		context.strokeRect(square.x, square.y, square.length, square.length);
	}
	

	function drawCircle() {
		context.beginPath();
		context.lineWidth = 2;
		context.strokeStyle = "blue";
		context.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2, false);
		context.stroke();
		context.closePath();
	}
	
	function drawHex() {
		context.strokeStyle = "green";
		context.lineWidth = 2;
		context.beginPath();
		context.moveTo(hex.middle, hex.top);
		context.lineTo(hex.left, hex.upper);
		context.stroke();
		context.lineTo(hex.left, hex.lower);
		context.stroke();
		context.lineTo(hex.middle, hex.bottom);
		context.stroke();
		context.lineTo(hex.right, hex.lower);
		context.stroke();
		context.lineTo(hex.right, hex.upper);
		context.stroke();
		context.lineTo(hex.middle, hex.top);
		context.stroke();
		context.closePath();
	}
	
	function CurveFunction() {
		this.full = false;	//Use pop()
		this.checkFalse = true;
		this.pointArray = [];
		
		this.addPoint = function(point) {
			if(this.checkFalse && this.pointArray.length > (3*w/4)) {
				this.checkFalse = false;
				this.full = true;
			}
			this.pointArray.unshift(point);
			if (this.full) {
				this.pointArray.pop();
			}
		}
		
		this.draw = function() {
			for (var i=0; i<this.pointArray.length; i++) {
				this.pointArray[i].draw(i);
			}
		}
	}
	
	function CircleMovePoint(x,y,color, size) {
		this.size = size;
		this.color = color;
		this.centerX = x;
		this.centerY = y;
		this.angle = 0;
		this.posX = (Math.cos(convertToRadians(this.angle)) * circle.radius) + circle.x;
		this.posY = (Math.sin(convertToRadians(this.angle)) * circle.radius) + circle.y;
		
		this.move = function() {
			this.angle -= 1;
			this.angle %= 360;
			this.posX = (Math.cos(convertToRadians(this.angle)) * circle.radius) + circle.x;
			this.posY = (Math.sin(convertToRadians(this.angle)) * circle.radius) + circle.y;
		}
		
		this.draw = function() {
			context.fillStyle = this.color;
			context.fillRect(this.posX-(this.size/2),this.posY - (this.size/2),this.size, this.size);
		}
		
		this.drawLineToCurve = function() {
			context.beginPath();
			context.lineWidth = 2;
			context.strokeStyle = "lightblue";
			context.moveTo(this.posX,this.posY);
			context.lineTo(w/4, this.posY);
			context.stroke();
			context.closePath();
		}
	}
	
	function HexMovePoint(x,y,color, size) {
		this.size = size;
		this.color = color;
		this.centerX = x;
		this.centerY = y;
		this.angle = 0;
		this.posX = 0;
		this.posY = 0;
		
		this.move = function() {
			this.angle += 1;
			this.angle %= 360;
			if (this.angle < 30 || this.angle > 330) {
				this.posX = hex.right;
				if(this.angle < 30) {
					this.posY = ((hex.lower + hex.upper)/2) * (1-(this.angle)/30) + (hex.upper) * (this.angle/30);
				} else {
					this.posY = (hex.lower) * (1-(this.angle-330)/60) + (hex.upper) * ((this.angle-330)/60);
				}
			} else if (this.angle <= 90) {
				this.posX = ((hex.right) * (1-((this.angle-30)/60)) + ((hex.middle) * ((this.angle-30)/60)));
				this.posY = ((hex.upper) * (1-((this.angle-30)/60)) + ((hex.top) * ((this.angle-30)/60)));
			} else if (this.angle <=150) {			
				this.posX = ((hex.middle) * (1-((this.angle-90)/60))) + ((hex.left) * ((this.angle-90)/60));
				this.posY = (hex.top) * (1-((this.angle-90)/60)) + (hex.upper) * ((this.angle-90)/60);
			} else if (this.angle <= 210) {
				this.posX = hex.left;
				this.posY = ((hex.upper) * (1-((this.angle-150)/60)) + ((hex.lower) * ((this.angle-150)/60)));
			} else if (this.angle <= 270) {
				this.posX = ((hex.left) * (1-((this.angle-210)/60)) + ((hex.middle) * ((this.angle-210)/60)));
				this.posY = ((hex.lower) * (1-((this.angle-210)/60)) + ((hex.bottom) * ((this.angle-210)/60)));
			} else if (this.angle <= 330) {
				this.posX = ((hex.middle) * (1-((this.angle-270)/60)) + ((hex.right) * ((this.angle-270)/60)));
				this.posY = ((hex.bottom) * (1-((this.angle-270)/60)) + ((hex.lower) * ((this.angle-270)/60)));
			} 

		}
		
		this.draw = function() {
			context.fillStyle = this.color;
			context.fillRect(this.posX-(this.size/2),this.posY - (this.size/2),this.size, this.size);
		}
		
		this.drawLineToCurve = function() {
			context.beginPath();
			context.lineWidth = 2;
			context.strokeStyle = "lightgreen";
			context.moveTo(this.posX,this.posY);
			context.lineTo(w/4, this.posY);
			context.stroke();
			context.closePath();
		}
	}
	
		function SquareMovePoint(x,y,color, size) {
		this.size = size;
		this.color = color;
		this.centerX = x;
		this.centerY = y;
		this.angle = 0;
		this.posX = (Math.cos(convertToRadians(this.angle)) * square.length/2) + square.x + square.length/2;
		this.posY = (Math.sin(convertToRadians(this.angle)) * square.length/2) + square.y + square.length/2;
		
		this.move = function() {
			this.angle += 1;
			this.angle %= 360;
			if (this.angle <= 45 || this.angle > 315) {
				if (this.angle <= 45) {
					this.posX = square.length + square.x;
					this.posY = (45-this.angle)/45 * (square.length/2) + square.y;
				} else {
					this.posX = square.length + square.x;
					this.posY = ((45- (this.angle - 315))/45 * (square.length/2) + square.y) + (square.length/2);
				}
			} else if (this.angle <= 135) {
				this.posY = 0 + square.y;
				this.posX = (135 - this.angle)/90 * square.length + square.x;
			} else if (this.angle < 225) {
				this.posX = 0 + square.x;
				this.posY = (this.angle - 135) / 90 * square.length + square.y;
			} else if (this.angle < 315) {
				this.posX = ((this.angle - 225) / 90 * square.length) + square.x;
				this.posY = square.length + square.y;
			}
		}
		
		this.draw = function() {
			context.fillStyle = this.color;
			context.fillRect(this.posX-(this.size/2),this.posY - (this.size/2),this.size, this.size);
		}
		
		this.drawLineToCurve = function() {
			context.beginPath();
			context.lineWidth = 2;
			context.strokeStyle = "lightred";
			context.moveTo(this.posX,this.posY);
			context.lineTo(w/4, this.posY);
			context.stroke();
			context.closePath();
		}
	}
	
	function convertToRadians(degrees) {
		return degrees * (Math.PI/180)
	}
	
	function Point(x, y, color, size) {
		this.size = size;
		this.color = color;
		this.x = x;
		this.y = y;
		
		this.draw = function(index) {
			context.fillStyle = color;
			context.fillRect(index + w/4,this.y,this.size, this.size);
		}
	}
	
	
	function bgFill() {
		context.fillStyle = "white";
		context.strokeStyle = "black";
		context.fillRect(0,0,w,h);
		context.strokeRect(0,0,w,h);
		
		context.strokeStyle = "lightgray";
		context.beginPath();
		context.lineWidth = 1;
		context.moveTo(w/4, 0);
		context.lineTo(w/4, h);
		context.stroke();
		context.closePath();
		
		for (var i=1; i<3; i++) {
			context.beginPath();
			context.lineWidth = 1;
			context.moveTo(0, h/3*i);
			context.lineTo(w, h/3*i);
			context.stroke();
			context.closePath();
		}
		
		drawCircle();
		drawSquare();
		drawHex();
	}

})