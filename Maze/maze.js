var grid;

var mazeWidth = 10;
var mazeHeight = 10;
var output = true;

fillGrid();
function fillGrid() {
	grid = new Array(mazeHeight);
	for (var i=0; i<mazeHeight; i++) {
		grid[i] = new Array(mazeWidth);
		for (var j=0; j<mazeWidth; j++) {
			grid[i][j] = 0;
		}
	}
}

function printGrid() {
	if (output) {
		addSpaceNode();
		for (var i=0;i<grid.length;i++) {
			for (var j=0; j<grid[i].length; j++) {
				addTextNode(grid[i][j] + " ");
			}
			addSpaceNode();
		}
		output = false;
		var button = document.getElementById("showgrid");
		button.innerHTML = "Hide Grid";
	}
	else {
		var p1 = document.getElementById("grid"), button = document.getElementById("showgrid");
		p1.innerHTML = "Output";
		button.innerHTML = "Show Grid";
		output = true;
	}
}

function addSpaceNode() {
	var p1 = document.getElementById("grid"), br = document.createElement("br");
	p1.appendChild(br);
}
	
function addTextNode(text)  {
	var newtext = document.createTextNode(text), p1 = document.getElementById("grid");
	p1.appendChild(newtext);
}
	

$(document).ready(function() {
	var canvas = $("#canvas")[0];
	canvas.width = mazeWidth * 100;	
	canvas.height = mazeHeight * 100;
	var ctx = canvas.getContext("2d");
	var w = $("#canvas").width();
	var h = $("#canvas").height();
	
	var DIRECTION = {
		NORTH : {value: 1, name: "North", code: "N", opposite: 2, moveVert: -1, moveHoriz: 0},
		SOUTH : {value: 2, name: "South", code: "S", opposite: 1, moveVert: 1, moveHoriz: 0},
		EAST  : {value: 4, name: "East", code: "E", opposite: 8, moveVert: 0, moveHoriz: 1},
		WEST  : {value: 8, name: "West", code: "W", opposite: 4, moveVert: 0, moveHoriz: -1}
	};
	
	carvePassages(0,0);

	bgFill();
	paintGrid();
	
	function carvePassages(xPos, yPos) {
		var direction_array = [DIRECTION.NORTH, DIRECTION.SOUTH, DIRECTION.WEST, DIRECTION.EAST];	
		direction_array = shuffleArray(direction_array);
		for (var i=0; i<direction_array.length; i++) {
			var new_xPos = xPos + direction_array[i].moveHoriz;
			var new_yPos = yPos + direction_array[i].moveVert;
			
			if (new_xPos >= 0 && new_yPos >= 0 && new_xPos < mazeWidth && new_yPos < mazeHeight && grid[new_yPos][new_xPos] == 0) {
				grid[yPos][xPos] |= direction_array[i].value;
				grid[new_yPos][new_xPos] |= direction_array[i].opposite;
				carvePassages(new_xPos, new_yPos);
			}
		}
	}
	
	function shuffleArray(array) {
		for (var i = array.length - 1; i > 0; i--) {
			var j = Math.floor(Math.random() * (i + 1));
			var temp = array[i];
			array[i] = array[j];
			array[j] = temp;
		}
    return array;
	}

	function paintGrid() {
		//Draw box with four lines (to remove as necessary)
		var hRatio = h/mazeHeight;
		for (var i=0; i<mazeWidth; i++) {
			for (var j=0; j<mazeHeight; j++) {
				if (((grid[i][j]) & DIRECTION.WEST.value) == 0)
					drawWallPassage(i,j);
				if (((grid[i][j]) & DIRECTION.NORTH.value) == 0)
					drawFloorPassage(i,j);				
			}
		}

	}
	
	
	function drawWallPassage(widthPos, heightPos) {
		var wRatio = w/mazeWidth;
		var hRatio = h/mazeHeight;
		drawWall(hRatio * heightPos, wRatio*widthPos, wRatio * (widthPos+1));
	}
	
	function drawFloorPassage(widthPos, heightPos) {
		var wRatio = w/mazeWidth;
		var hRatio = h/mazeHeight;
		drawFloor(hRatio * heightPos, wRatio*widthPos, hRatio * (heightPos+1));
	}
	
	function drawWall(one, two, three) {
		ctx.beginPath();
		ctx.moveTo(one, two);
		ctx.lineWidth = 1;
		ctx.lineTo(one, three);
		ctx.stroke();
		ctx.closePath();
	}
	
	function drawFloor(one, two, three) {
		ctx.beginPath();
		ctx.moveTo(one, two);
		ctx.lineWidth = 1;
		ctx.lineTo(three, two);
		ctx.stroke();
		ctx.closePath();
	}
	
	function bgFill() {
		ctx.fillStyle = "grey";
		ctx.fillRect(0,0,w,h);
		ctx.strokeStyle = "black";
		ctx.strokeRect(0,0,w,h);
	}



})