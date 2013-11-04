$(document).ready(function() {
	var canvas = $("#canvas")[0];
	var ctx = canvas.getContext("2d");
	var w = $("#canvas").width();
	var h = $("#canvas").height();
	
	var snake_array;
	
	var snakeSize = 10;
	var direction;
	var food;
	var score;
	
	
	function init() {
		direction = "right";
		createSnake();
		createFood();
		score = 0;
		if (typeof game_loop != "undefined")
			clearInterval(game_loop);
		game_loop = setInterval(paint, 60);
	}
	
	init();
	function createSnake() {
		var length = 5;
		snake_array = [];
		for(var i = length-1; i>=0; i--) {
			//Create horiztonal snake from the top left
			snake_array.push({x: i, y:0});
		}
	}
	
	function paint() {
		//Repaint background each time
		bgFill();
		//Move the snake
		moveSnake();
		
		//Paint the snake
		for (var i = 0; i<snake_array.length; i++) {
			bluePixelPaint(snake_array[i].x, snake_array[i].y);
		}
		
		//Paint the food
		bluePixelPaint(food.x, food.y);
		
		//Paint score
		var score_text = "Score: " + score;
		ctx.fillText(score_text, 5, h-5);
	}
	
	$(document).keydown(function(e) {
		var key = e.which;
		if (key == "37" && direction != "right") direction = "left";
		else if (key == "38" && direction != "down") direction = "up";
		else if (key == "39" && direction != "left") direction = "right";
		else if (key == "40" && direction != "up") direction = "down";
	})
	
	function moveSnake() {
		var snakeX = snake_array[0].x;
		var snakeY = snake_array[0].y;
		
		if (direction == "right") snakeX++;
		else if (direction == "left") snakeX--;
		else if (direction == "up") snakeY--;
		else if (direction == "down") snakeY++;
		
		if (snakeX == -1 || snakeX == w/snakeSize || snakeY == -1 || snakeY == h/snakeSize || checkCollision(snakeX, snakeY, snake_array)) {
				init();
				return;
		}
		
		if (snakeX == food.x && snakeY == food.y) {
			var tail = {x: snakeX, y: snakeY};
			score++;
			createFood();
		} else {
			var tail = snake_array.pop();
			tail.x = snakeX;
			tail.y = snakeY;
		}
		
		snake_array.unshift(tail);
	}
	
	function checkCollision(x, y, array) {
		for (var i=0; i<array.length; i++) {
			if (array[i].x == x && array[i].y == y) 
				return true;
		}
		return false;
	}
	
	function createFood() {
		food = {
			x: Math.round(Math.random() * (w-snakeSize) / snakeSize),
			y: Math.round(Math.random() * (h-snakeSize) / snakeSize),
		};
	
	}
		
	function bluePixelPaint(x, y) {
		ctx.fillStyle = "blue";
		ctx.fillRect(x*snakeSize, y * snakeSize, snakeSize, snakeSize);
		ctx.strokeStyle = "white";
		ctx.strokeRect(x*snakeSize, y * snakeSize, snakeSize, snakeSize);
	}
	
	function bgFill() {
		//Paint canvas white
		ctx.fillStyle = "white";
		ctx.fillRect(0,0,w,h);
		ctx.strokeStyle = "black";
		ctx.strokeRect(0,0,w,h);
	}

})