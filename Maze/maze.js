$(document).ready(function() {
	var canvas = $("#canvas")[0];
	var ctx = canvas.getContext("2d");
	var w = $("#canvas").width();
	var h = $("#canvas").height();

	var mazeWidth = 5;
	var mazeHeight = 5;
	var grid = new Array(mazeHeight);

	
	var DIRECTION = {
		NORTH : {value: 1, name: "North", code: "N", opposite: 2},
		SOUTH : {value: 2, name: "South", code: "S", opposite: 1},
		EAST  : {value: 4, name: "East", code: "E", opposite: 8},
		WEST  : {value: 8, name: "West", code: "W", opposite: 4}
	};


	for (var i=0; i<mazeHeight; i++) {
		grid[i] = new Array(mazeWidth);
		for (var j=0; j<mazeWidth; j++) {
			grid[i][j] = 0;
		}
	}
	
	var name = DIRECTION.NORTH;
	alert(name.value);
	//carvePassages(1,2);
	printGrid();
	
	
	function carvePassages(xPos, yPos) {
		
	}
	
	function printGrid() {
		for (var i=0;i<grid.length;i++) {
			for (var j=0; j<grid[i].length; j++) {
				document.write(grid[i][j]);
			}
		document.write("<br>");
		}
	}



})