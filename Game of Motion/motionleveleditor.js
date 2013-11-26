$(document).ready(function() {
	var canvas = $("#canvas")[0];
	var ctx = canvas.getContext('2d');
	var w = canvas.width;
	var h = canvas.height;
	var personSize = 10;
	var levelWidth = w/personSize;
	var levelHeight = h/personSize;
	var smallObstacle = 1;
	var midObstacle = 2;
	var midObstacleSize = personSize * midObstacle;
	var smallObstacleSize = personSize * smallObstacle;
	var largeObstacle = 4;
	var largeObstacleSize = personSize * largeObstacle;
	var player;
	var world;
	
	canvas.addEventListener('mouseup', getUpPosition, false);
	canvas.addEventListener('mousedown', getDownPosition, false);
	canvas.addEventListener('mousemove', drawRectangle, false);
	setup();	
	
	function drawRectangle(event) {
		if (mouseDownPressed) {
			var x = event.x;
			var y = event.y;
			x -= canvas.offsetLeft;
			y -= canvas.offsetTop;
			var rectSelectedX = x - unadjustedDownXPos;
			var rectSelectedY = y - unadjustedDownYPos;
			paintWorld();
			ctx.fillStyle = "lightgrey";
			ctx.fillRect(unadjustedDownXPos, unadjustedDownYPos, rectSelectedX, rectSelectedY);
		}

	}
	
	
	
	function setup() {
		//World info
		world = [levelHeight];
		for (var i=0; i<levelHeight; i++) {
			world[i] = [levelWidth];
			for (var j=0; j<levelWidth; j++) {
				world[i][j] = new GridPoint(j,i);
			}
		}
		
		//Player info
		player = new Player(2,1);	
		paintWorld();
	}
	
	var keyPressed = {};
	var showAlert = false;
	$(document).keydown(function(e) {
		var key = e.which;
		
		if (showAlert) {
			alert(key);
		}
		if (key == "37" && player.direction != "right") player.move("left");
		else if (key == "38" && player.direction != "down") player.move("up");
		else if (key == "39" && player.direction != "left") player.move("right");
		else if (key == "40" && player.direction != "up") player.move("down");
		else if (key == "82") setup();
		else if (keyPressed["17"] && key == "90") alert("undo");
		else if (key == "72") alert(player.x + " " + player.y);
		else if (keyPressed["16"] && key == "65") { showAlert = !showAlert; alert(showAlert);}
		else if (key == "86") paintConnection();
		else if (key == "66") paintVoid();
		keyPressed[key] = true;
		
	})
	
	$(document).keyup(function(e) {
		var key = e.which;
		keyPressed[key] = false;
	})
	
	
	//Input functions
	function move(direction) {
		if(this.exists) {
		if (this.direction == direction) {
			this.moveMultiply += 1;
		} else {
			this.moveMultiply = 1;
		}
		if (direction == "left" || direction == "none") {
			if (checkMovement(this.y, -this.moveMultiply, -1)
					&& checkCollision(this.x, this.y - this.moveMultiply)) {
				this.direction = "left";
				world[this.y][this.x].hasPlayer = false;
				this.y -= this.moveMultiply;
			} else {
				this.moveMultiply -= 1;
			}
		} else if (direction == "right" || direction == "none") {
			if (checkMovement(this.y, this.moveMultiply, levelWidth)
					&& checkCollision(this.x, this.y + this.moveMultiply)) {
				this.direction = "right";
				world[this.y][this.x].hasPlayer = false;
				this.y += this.moveMultiply;
			} else {
				this.moveMultiply -= 1;
			}
		} else if (direction == "up" || direction == "none") {
			if (checkMovement(this.x, -this.moveMultiply, -1)
					&& checkCollision(this.x - this.moveMultiply, this.y)) {
				this.direction = "up";
				world[this.y][this.x].hasPlayer = false;
				this.x -= this.moveMultiply;
			} else {
				this.moveMultiply -= 1;
			}
		} else if (direction == "down" || direction == "none") {
			if (checkMovement(this.x, this.moveMultiply, levelHeight)
					&& checkCollision(this.x+ this.moveMultiply, this.y )) {
				this.direction = "down";
				world[this.y][this.x].hasPlayer = false;
				this.x += this.moveMultiply;
			} else {
				this.moveMultiply -= 1;
			}
		}
		world[this.y][this.x].hasPlayer = true;
		paintWorld();
		}
	}
	
	function getUpPosition(event) {
		var x = event.x;
		var y = event.y;
		
		x -= canvas.offsetLeft;
		y -= canvas.offsetTop;
		
		var upXPos = Math.floor(x/w * levelWidth);
		var upYPos = Math.floor(y/h * levelHeight);
		
		if (upXPos != downXPos || upYPos != downYPos) {
			var el = document.getElementById('main');

			var largerX = (downXPos > upXPos) ? downXPos : upXPos;
			var smallerX = (downXPos > upXPos) ? upXPos : downXPos;
			var largerY = (downYPos > upYPos) ? downYPos : upYPos;
			var smallerY = (downYPos > upYPos) ? upYPos : downYPos;
			var rectHeight = Math.abs(largerY - smallerY) + 1;
			var rectWidth = Math.abs(largerX - smallerX) + 1;
			
			el.innerHTML = downXPos + " " + downYPos + " " + upXPos + " " + upYPos + " " + rectWidth + " " + rectHeight;
			coverOtherRectangle(rectWidth, rectHeight, smallerX, smallerY);

		} else {
			if (keyPressed["17"] && world[upXPos][upYPos].hasPlayer && player.exists) {
				world[upXPos][upYPos].remove();
				player.exists = false;
			} else if (keyPressed["17"] && !player.exists) {
				world[upXPos][upYPos].setPlayer();
				player.x = upYPos;
				player.y = upXPos;
				player.direction = "none";
				player.exists = true;
			}
			else if(world[upXPos][upYPos].hasObstacle) {
				if (world[upXPos][upYPos].obstacleType == "belongsMid" || world[upXPos][upYPos].obstacleType == "mid") {
					var mid = collapse(upXPos, upYPos, midObstacle, "mid");
					for (var i=0; i<midObstacle; i++) {
						for (var j=0; j<midObstacle; j++) {
							world[mid.x+i][mid.y+j].obstacleType = "small";
						}
					}
					world[upXPos][upYPos].remove();
				} else if (world[upXPos][upYPos].obstacleType == "belongsLarge" || world[upXPos][upYPos].obstacleType == "large") {
					var large = collapse(upXPos, upYPos, largeObstacle, "large");

					for (var i=0; i<largeObstacle; i++) {
						for (var j=0; j<largeObstacle; j++) {
							if(i%2==0 && j%2==0) {
								world[large.x+i][large.y+j].obstacleType = "mid";
							} else {
								world[large.x+i][large.y+j].obstacleType = "belongsMid";
							}
						}
					}
					
					var mid2 = collapse(upXPos, upYPos, midObstacle, "mid");
					for (var i=0; i<midObstacle; i++) {
						for (var j=0; j<midObstacle; j++) {
							world[mid2.x+i][mid2.y+j].obstacleType = "small";
						}
					}
					world[upXPos][upYPos].remove();
				} else {
					world[upXPos][upYPos].remove();
				}
			} else if (!world[upXPos][upYPos].hasPlayer){
				world[upXPos][upYPos].setObstacle("small");
				checkMidGroup(upXPos, upYPos);
			}
		}
		paintWorld();
		mouseDownPressed = false;
	}
	
	function checkMidGroup(upXPos, upYPos) {
		var madeObstacle = false;
		if (upXPos - 1 >= 0) {
			if (upYPos - 1 >= 0) {
				if (!madeObstacle && removeAndMakeObstacle(upXPos-1, upYPos-1, upXPos, upYPos, "mid") ) {
					makeObstacle(upYPos-1, upXPos-1, "mid");
					madeObstacle = true;
				}
			} 
			if (upYPos + 1 < levelHeight) {
				if (!madeObstacle && removeAndMakeObstacle(upXPos - 1, upYPos+1, upXPos, upYPos, "mid")) {
					makeObstacle(upYPos, upXPos-1, "mid");
					madeObstacle = true;							
				} 
			}
		} 
		if (upXPos + 1 < levelWidth) {
			if (upYPos - 1 >= 0) {
				if (!madeObstacle && removeAndMakeObstacle(upXPos+1, upYPos-1, upXPos, upYPos, "mid")) {
					makeObstacle(upYPos-1, upXPos, "mid");
					madeObstacle = true;
				} 
			}
			if (upYPos + 1< levelHeight) {
				if (!madeObstacle && removeAndMakeObstacle(upXPos + 1, upYPos+1, upXPos, upYPos, "mid")) {
					makeObstacle(upYPos, upXPos, "mid");
					madeObstacle = true;
				} 
			} 
		}
	}
	
	function removeAndMakeObstacle(adjustedX, adjustedY, normalX, normalY, type) {
		if (world[adjustedX][adjustedY].obstacleType == "small" && world[normalX][adjustedY].obstacleType == "small" && world[adjustedX][normalY].obstacleType == "small") {
			world[adjustedX][adjustedY].remove();
			world[adjustedX][normalY].remove();
			world[normalX][adjustedY].remove();
			world[normalX][normalY].remove();
			return true;
		} else {
			return false;
		}
	}
	
	function collapse(upXPos, upYPos, objectSize, lookfor) {
			var midValueX;
			var midValueY;
			var size = objectSize - 1;
			for (var i=0; i<objectSize; i++) {
				for (var j=0; j<objectSize; j++) {
					if (upXPos-size+i >= 0 && upYPos-size+j>=0 && upXPos-size+i < levelWidth && upYPos-size+j < levelHeight) {
						if (world[upXPos-size+i][upYPos-size+j].obstacleType == lookfor) {
							midValueX = upXPos-size+i;
							midValueY = upYPos-size+j;
						}
					}
				}
			}
			return {x:midValueX, y:midValueY};
	}
	
	var downXPos;
	var downYPos;
	var unadjustedDownXPos;
	var unadjustedDownYPos;
	var mouseDownPressed = false;
	
	function getDownPosition(event) {
		var x = event.x;
		var y = event.y;
		
		x -= canvas.offsetLeft;
		y -= canvas.offsetTop;
		unadjustedDownXPos = x;
		unadjustedDownYPos = y;
		downXPos = Math.floor(x/w * levelWidth);
		downYPos = Math.floor(y/h * levelHeight);
		
		mouseDownPressed = true;

	}
	
	function checkCollision(x, y) {
		return(!world[y][x].hasObstacle);
	}
	
	function checkMovement(pos, movement, maxmin) {
		if (maxmin == levelWidth || maxmin == levelHeight) {
			return (pos + (movement) < maxmin);
		} else {
			return (pos + (movement) > maxmin);
		}
	}
	
	//Create obstacles
	function makeObstacle(x,y, type) {
		if (type == "small") {
			if (world[y][x].hasObstacle || world[y][x].hasPlayer || world[y][x].hasPortal) {
				return false;
			} else {
				world[y][x].hasObstacle = true;
				world[y][x].obstacleType = type;
				return true;
			}
		} else if (type == "mid") {
			for (var i=0; i<midObstacle; i++) {
				for (var j=0; j<midObstacle; j++) {
					if (world[y+i][x+j].hasObstacle || world[y+i][x+j].hasPlayer || world[y+i][x+j].hasPortal) {
						return false;
					}
				}
			}
			for (var i=0; i<midObstacle; i++) {
				for (var j=0; j<midObstacle; j++) {
					world[y+i][x+j].hasObstacle = true;
					if (i==0 && j==0) world[y+i][x+j].obstacleType = type;
					else world[y+i][x+j].obstacleType = "belongsMid";


				}
			}
		} else if (type == "large") {
			//Check elements 
			for (var i=0; i<largeObstacle; i++) {
				for (var j=0; j<largeObstacle; j++) {
					if (world[y+i][x+j].hasObstacle || world[y+i][x+j].hasPlayer || world[y+i][x+j].hasPortal) {
						return false;
					}
				}
			}
			
			
			for (var i=0; i<largeObstacle; i++) {
				for (var j=0; j<largeObstacle; j++) {
					world[y+i][x+j].hasObstacle = true;
					if (i==0 && j==0) world[y+i][x+j].obstacleType = type;
					else world[y+i][x+j].obstacleType = "belongsLarge";
				}
			}
		}
	}
	
	
	
	//Constructors
	function Player(x,y) {
		this.direction = "none";
		this.x = x;
		this.y = y;
		this.moveMultiply = 1;
		this.move = move;
		world[y][x].hasPlayer = true;
		this.exists = true;
	}
	
	function GridPoint(x, y) {
	  this.x = x;
	  this.y = y;
	  this.hasObstacle = false;
	  this.obstacleType = "none";
	  this.hasPlayer = false;
	  this.hasPortal = false;
	  this.setPlayer = setPlayer;
	  this.setObstacle = setObstacle;
	  this.remove = remove;
	}
	
	function setPlayer() {
		this.hasObstacle = false;
		this.obstacleType = "none";
		this.hasPlayer = true;
		this.hasPortal = false;
	}
	
	function setObstacle(type) {
		this.hasObstacle = true;
		this.obstacleType = type;
		this.hasPlayer = false;
		this.hasPortal = false;
	}
	
	function remove() {
		this.hasObstacle = false;
		this.obstacleType = "none";
		this.hasPlayer = false;
		this.hasPortal = false;
	}
	
	//Paint functions
	function paintWorld() {
		fillBG();
		for (var i=0; i<levelHeight; i++) {
			for (var j=0; j<levelWidth; j++) {
				if(world[i][j].hasPlayer) {
					personPaint(i,j);
				} else if (world[i][j].obstacleType == "small") {
					smallObstaclePaint(i,j);
				} else if (world[i][j].obstacleType == "mid") {
					midObstaclePaint(i,j);
				} else if (world[i][j].obstacleType == "large") {
					largeObstaclePaint(i,j);
				}
			}
		}
	}
	

	
	function coverOtherRectangle(rectWidth, rectHeight, smallerX, smallerY) {
		for (var j=0; j<rectHeight; j++) {
			for (var i=0; i<rectWidth; i++) {
				if (!(world[ smallerX + i][smallerY + j].hasObstacle) && i + largeObstacle - 1 < rectWidth && j + largeObstacle - 1 < rectHeight) {
					if (!makeObstacle(smallerY + j, smallerX + i, "large")) {
						if (!makeObstacle(smallerY+j, smallerX + i, "mid")) {
							makeObstacle(smallerY+j, smallerX + i, "small");
							checkMidGroup(smallerY+j, smallerX + i);
						}
					}
				} else if (!(world[ smallerX + i][smallerY + j].hasObstacle) && i + midObstacle - 1< rectWidth && j + midObstacle - 1 < rectHeight) {
					if (!makeObstacle(smallerY+j, smallerX + i, "mid")) {
						makeObstacle(smallerY+j, smallerX + i, "small");
						checkMidGroup(smallerY+j, smallerX + i);
					}
				} else if (!(world[i + smallerX][smallerY + j].hasObstacle) && i + smallObstacle - 1< rectWidth &&  j + smallObstacle - 1< rectHeight) {
					makeObstacle(smallerY + j, smallerX + i,"small");
					paintWorld();
					checkMidGroup(smallerX + i, smallerY+j);
				}
			}
		}
	}
	
	function paintConnection() {
		fillBG();
		for (var i=0; i<levelHeight; i++) {
			for (var j=0; j<levelWidth; j++) {
				if (world[i][j].hasPlayer) {
					personPaint(i,j);
				} else if (world[i][j].hasObstacle) {
					smallObstaclePaint(i,j);
				}
			}
		}
	}
	
	function paintVoid() {
		fillBG();
		for (var i=0; i<levelHeight; i++) {
			for (var j=0; j<levelWidth; j++) {
				if (world[i][j].hasPlayer) {
					personPaint(i,j);
				} else if (world[i][j].hasObstacle) {
					if (world[i][j].obstacleType == "belongsLarge")
						paintX(i,j);
					else if (world[i][j].obstacleType == "belongsMid")
						smallObstaclePaint(i,j);
				}
			}
		}
	}

	
	function paintX(x,y) {
		ctx.fillStyle = "black";
		ctx.fillRect(personSize * x, personSize * y, personSize, personSize);
	}
	
	function fillBG() {
		ctx.fillStyle = "white";
		ctx.fillRect(0,0,w,h);
		ctx.strokeStyle = "black";
		ctx.strokeRect(0,0,w,h);
		
		//Vertical lines
		for (var i=0; i<=levelWidth; i++) {
			ctx.beginPath();
			ctx.lineWidth = .5;
			ctx.moveTo(i*w/levelWidth, 0);
			ctx.lineTo(i*w/levelWidth, h);
			ctx.stroke();
			ctx.closePath();
		}
		
		//Horizontal lines
		for (var i=0; i<=levelHeight; i++) {
			ctx.beginPath();
			ctx.lineWidth = .5;
			ctx.moveTo(0, i*h/levelHeight);
			ctx.lineTo(w, i*h/levelHeight);
			ctx.stroke();
			ctx.closePath();
		
		}
	}
	
	function paintSquarePixel(x,y, firstStyle, outline, size, adjustedSize) {
		ctx.fillStyle = firstStyle;
		ctx.fillRect(size * x / adjustedSize, size * y / adjustedSize, size, size);
		ctx.strokeStyle = outline;
		ctx.strokeRect(size * x / adjustedSize, size * y / adjustedSize, size, size);
	}
	
	function personPaint(x, y) {
		paintSquarePixel(x,y,"black", "yellow", personSize,1);
	}
	
	function portalPaint(x,y) {
		paintSquarePixel(x,y,"silver", "black", personSize, 1);
	}
	
	function smallObstaclePaint(x,y) {
		paintSquarePixel(x,y,"green", "black", smallObstacleSize,1);
	}
	
	function midObstaclePaint(x,y) {
		paintSquarePixel(x,y,"blue", "black", midObstacleSize,2);
	}
	
	function largeObstaclePaint(x,y) {
		paintSquarePixel(x,y,"red", "black", largeObstacleSize,4);
	}
	

})