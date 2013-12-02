$(document).ready(function() {
	var canvas = $('#canvas')[0];
	var context = canvas.getContext('2d');
	var w = canvas.width;
	var h = canvas.height;
	var speed = 10;
	var ballPosW = w/2;
	var ballPosH = h/2;
	var up = true;
	var balls = [];
	for (var i=0; i<8; i++) {
		var ball = new Ball(ballPosW, ballPosH, 10, "white", convertToRadians(45*i));
		balls.push(ball);
	}
	
	
	window.requestAnimationFrame = (function(callback) {
        return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
        function(callback) {
          window.setTimeout(callback, 1000 / 60);
        };
      })();

	animate();
    
	function animate() {
        // update
		if (!up) {
			if (ballPosH + speed < h) {
				ballPosH += speed;
			} else {
				up = true;
			}
		} else {
			if (ballPosH - speed >= 0) {
				ballPosH -= speed;
			} else {
				up = false;
			}
		}
		balls[0].move(ballPosW, ballPosH);
		
        // clear
        context.clearRect(0, 0, canvas.width, canvas.height);

        // draw background
		drawCircle(w/2, h/2, "black", w/2);
	
		//draw balls
		for (var i=0; i<8; i++) {
			balls[i].draw();
		}
		
        // request new frame
        requestAnimationFrame(function() {
          animate();
        });
    }
    
	function Ball(x, y, size, color, angle) {
		this.xpos = x;
		this.ypos = y;
		this.color = color;
		this.size = size;
		this.xAngle = Math.cos(angle);
		this.yAngle = Math.sin(angle);
		//alert(convertToDegrees(this.xAngle) + " " + convertToDegrees(this.y Angle));
		this.draw = function() {
			drawCircle(this.xpos, this.ypos, this.color, this.size);
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

 