$(document).ready(function() {
	var canvas = $('#canvas')[0];
	var context = canvas.getContext('2d');
	var w = canvas.width;
	var h = canvas.height;
	var speed = 1;
	var ballPosW = w/2;
	var ballPosH = h/2;
	var up = true;
	var balls = [];
	for (var i=0; i<8; i++) {
		var ball = new Ball(ballPosW, ballPosH, 10, "red", convertToRadians(i*22.5), false);
		balls.push(ball);
	}
		
		
		/*
		var circleCenterX = (ballPosW*2 + ballPosW) /2;
		var circleCenterY = ballPosH;
		
		var rotationPointX = ballPosW - circleCenterX;
		var rotationPointY = ballPosH - circleCenterY;
		
		var ballPos = rotate(convertToRadians(45));
		var fortyFiveY = ballPos.y;
		var fortyFiveX = ballPos.x;
		ball = new Ball(ballPos.x, ballPos.y, 10, "red", convertToRadians(90-22.5), false);
		balls.push(ball);
		ballPos = rotate(convertToRadians(90));
		var nintyX = ballPos.x;
		var nintyY = ballPos.y;
		ball = new Ball(ballPos.x, ballPos.y, 10, "red", convertToRadians(0), false);
		//balls.push(ball);
		ball = new Ball(nintyX + (nintyX - fortyFiveX), fortyFiveY, 10, "red", convertToRadians(0), false);
		//balls.push(ball);
		ball = new Ball(fortyFiveX, ballPosH - (fortyFiveY - ballPosH), 10, "red", convertToRadians(0), false);
		//balls.push(ball);
		ball = new Ball(nintyX, ballPosH - (nintyY - ballPosH), 10, "red", convertToRadians(0), false);
		//balls.push(ball);
		ball = new Ball(nintyX + (nintyX - fortyFiveX), ballPosH - (fortyFiveY - ballPosH), 10, "red", convertToRadians(0), false);
		//balls.push(ball);
	
		function rotate(angle) {
			var rotationMatrixX = rotationPointX * Math.cos(angle) + rotationPointY * Math.sin(angle);
			var rotationMatrixY = rotationPointX * -Math.sin(angle) + rotationPointY * Math.cos(angle);
			return {x: rotationMatrixX + circleCenterX, y:rotationMatrixY + circleCenterY};
		}
	*/
	
	window.requestAnimationFrame = (function(callback) {
        return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
        function(callback) {
          window.setTimeout(callback, 1000 / 60);
        };
      })();

	animate();
    
	function animate() {
        // update
		for (var i=0; i<balls.length; i++) {
			balls[i].moveByAngle();
		}
		
        // clear
        context.clearRect(0, 0, canvas.width, canvas.height);

        // draw background
		drawCircle(w/2, h/2, "black", w/2);
	
		//draw balls
		for (var i=0; i<balls.length; i++) {
			balls[i].draw();
		}
		if (stopMotion) {
			alert("this");
		}
        // request new frame
        requestAnimationFrame(function() {
          animate();
        });
    }
	
	var alerter = false;
	var stopMotion = false;
	
	$(document).keydown(function(e) {
		var key = e.which;
		if (key=="65") alerter = !alerter;
		else if (key == "80") stopMotion = !stopMotion;
		if (alerter) alert(key);
		
	})
    
	function Ball(x, y, size, color, angle, up) {
		this.xpos = x;
		this.ypos = y;
		this.color = color;
		this.size = size;
		this.xAngle = Math.cos(angle);
		this.yAngle = Math.sin(angle);
		this.up = up;
		this.yOrigin = h/2;
		this.xOrigin = w/2;
		this.draw = function() {
			drawCircle(this.xpos, this.ypos, this.color, this.size);
		}
		
		this.calcDistanceFromCenter = function() {
			var a = this.xpos + this.xAngle*speed - this.xOrigin; 
			var b = this.ypos + this.yAngle*speed - this.yOrigin;
			return Math.sqrt(a*a+b*b) + this.size;
		}
		
		this.moveByAngle = function() {
			if (this.calcDistanceFromCenter() <= h/2) {
				if (!this.up) {
					this.xpos = this.xpos + this.xAngle*speed;
					this.ypos = this.ypos + this.yAngle*speed;
				} else {
					this.xpos = this.xpos - this.xAngle*speed;
					this.ypos = this.ypos - this.yAngle*speed;
				}
			} else {
				this.up = !this.up;
				if (!this.up) {
					this.xpos = this.xpos + this.xAngle*speed;
					this.ypos = this.ypos + this.yAngle*speed;
				} else {
					this.xpos = this.xpos - this.xAngle*speed;
					this.ypos = this.ypos - this.yAngle*speed;
				}
			}
		}
		this.move = function(x,y) {
			this.xpos = x;
			this.ypos = y;
		}
	}
	
	function convertToDegrees(radians) {
		return radians * (180/Math.PI);
	}
	
	function convertToRadians(degrees) {
		return degrees * (Math.PI/180)
	}

	function drawCircle(xCenter, yCenter, color, radius) {
		context.beginPath();
		context.fillStyle = color;
		context.arc(xCenter, yCenter, radius, 0, Math.PI * 2, false);
		context.fill();
		context.closePath();
	}
	
	
	function bgFill() {
		context.fillStyle = "white"; 
		context.fillRect(0,0,w,h);
		//context.strokeStyle = "black";
		//context.strokeRect(0,0,w,h);
	}
})

 