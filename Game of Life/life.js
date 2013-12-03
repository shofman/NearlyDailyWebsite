var gameStart = false;

function startOrPauseGame() {
	var button = document.getElementById("startGame");
	if(button.value == "pause") {
		button.value = "start";
		button.innerHTML = "Pause";
		gameStart = true;
	} else if (button.value == "start") {
		button.value = "pause";
		button.innerHTML = "Resume";
		gameStart = false;
	}
}


$(document).ready(function() {
	var canvas = $("#canvas")[0];
	var gridWidth = 20;
	var gridHeight = 20;
	var w = canvas.width;
	var h = canvas.height;
	var ctx = canvas.getContext("2d");

	/*TODO
	Make ajax for autorefresh
	Add pause button
	Allow for wrap around	
	*/
	
	//Game of life info
	var numStillAlive = 0;
	var nextGridValues = [];
		
	//Create zero filled, two dimensional array
	var grid = {};
	for (var i = 0; i<gridHeight; i++) {
		grid[i] = Array.apply(null, Array(gridWidth)).map(Number.prototype.valueOf,0);
	}

	grid[10][1] = 1;
	grid[11][1] = 1;
	grid[12][1] = 1;
	
	grid[2][1] = 1;
	grid[2][2] = 1;
	grid[2][3] = 1;
	grid[1][3] = 1;
	grid[0][2] = 1;

	
	if (typeof game_loop != "undefined")
			clearInterval(game_loop);
	game_loop = setInterval(paintGrid, 180);

	//alert(countNearbyLife(2,2));
	//paintGrid();
	
	function countNearbyLife(x, y) {
		var count = 0;
		for (var i=-1; i<=1; i++) {
			for (var j=-1; j<=1; j++) {
				if(x+i>=0 && x+i<gridWidth && y+j>=0 && y+j < gridHeight && !(i == 0 && j == 0)) {
					count += grid[x+i][y+j]
				}
			}
		}
		return count;
	}
	
	function paintGrid() {
		bgFill();
		numStillAlive = 0;
		if (gameStart) {
			for (var j=0; j<gridHeight; j++) {
				for (var i=0; i<gridWidth; i++) {
					if (grid[j][i] == 1) {
						numStillAlive += 1;
						ctx.fillStyle = "black";
						ctx.fillRect(i*w/gridWidth, j*h/gridHeight, w/gridWidth, h/gridHeight);
					}
					conwayRules(j,i);
				}
			}
		
			while(nextGridValues.length != 0) {
				var update = nextGridValues.pop();
				grid[update.h][update.w] = update.value;
			}
		} else {
			for (var j=0; j<gridHeight; j++) {
				for (var i=0; i<gridWidth; i++) {
					if (grid[j][i] == 1) {
						numStillAlive += 1;
						ctx.fillStyle = "black";
						ctx.fillRect(i*w/gridWidth, j*h/gridHeight, w/gridWidth, h/gridHeight);
					}
				}
			}
		}
		
		if (numStillAlive == 0) {
			//return;
		}
	}
	
	function conwayRules(x,y) {
		var lifeStatus = grid[x][y];
		var nearbyLife = countNearbyLife(x,y);
		if (lifeStatus == 1) {
			if (nearbyLife < 2 || nearbyLife > 3) {
				nextGridValues.push({h: x, w: y, value: 0});	//Dead by lack of support or overcrowding
			} //Else will live if 2 or 3
		} else {
			//Already dead
			if (nearbyLife == 3) {
				nextGridValues.push({h: x, w: y, value: 1});	//Brought to life by fornication
			}
		}
	}
	
	function bgFill() {
		ctx.fillStyle = "white";
		ctx.fillRect(0,0,w,h);
		ctx.strokStyle = "black";
		ctx.fillRect(0,0,w,h);
		
		//Vertical lines
		for (var i=0; i<=gridWidth; i++) {
			ctx.beginPath();
			ctx.lineWidth = .5;
			ctx.moveTo(i*w/gridWidth, 0);
			ctx.lineTo(i*w/gridWidth, h);
			ctx.stroke();
			ctx.closePath();
		}
		
		//Horizontal lines
		for (var i=0; i<=gridHeight; i++) {
			ctx.beginPath();
			ctx.lineWidth = .5;
			ctx.moveTo(0, i*h/gridHeight);
			ctx.lineTo(w, i*h/gridHeight);
			ctx.stroke();
			ctx.closePath();
		
		}
	}
	
	canvas.addEventListener("mousedown", getPosition, false);
	
	function getPosition(event) {
		var x = event.x;
		var y = event.y;
		
		x -= canvas.offsetLeft;
		y -= canvas.offsetTop;
		var gridPixelWidthChosen = Math.floor(x/w * gridWidth)
		var gridPixelHeightChosen = Math.floor(y/h * gridHeight);
		grid[gridPixelHeightChosen][gridPixelWidthChosen] = !(grid[gridPixelHeightChosen][gridPixelWidthChosen]);
	}
	
})