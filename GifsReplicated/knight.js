$(document).ready(function() {
	var canvas = $('#canvas')[0];
	var context = canvas.getContext('2d');
	var w = canvas.width;
	var h = canvas.height;
	canvas.addEventListener("mousedown", getPosition, false);
	var currKnightPos = {x:0,y:0};
	var chessBoard = [];
	for (var i = 0; i<8; i++) {
		chessBoard[i] = [];
		for (var j=0; j<8; j++) {
			chessBoard[i][j] = {hasKnight:false, canMoveKnight:true, hasBeen:false};
		}
	}
	
	var moves = [];
	
	bgFill();
	chessBoard[currKnightPos.x][currKnightPos.y].hasKnight = true;
	chessBoard[currKnightPos.x][currKnightPos.y].hasBeen = true;
	updateMoveChoices(currKnightPos.x,currKnightPos.y);
	invalidateSquares();
	drawLines();
	
	
	function invalidateSquares() {
		for (var i=0; i<8; i++) {
			for (var j=0; j<8; j++) {
				if(chessBoard[i][j].hasBeen) {
					colorSquare(i,j);
				}
				if(chessBoard[i][j].hasKnight) {
					drawKnight(i,j);
				} else if (chessBoard[i][j].canMoveKnight && !chessBoard[i][j].hasBeen) {
					drawPotentialMove(i,j);
				}
				
			}
		}
	}
	
	function drawMoves() {
		context.lineWidth = 2;
		context.strokeStyle = "black";
		for (var i=0; i<moves.length; i++) {
			context.beginPath();
			context.moveTo(moves[i].oldX * (w/8) + (w/16), moves[i].oldY * (h/8) + (h/16));
			context.lineTo(moves[i].newX * (w/8) + (w/16), moves[i].newY * (h/8) + (h/16));
			context.stroke();
			context.closePath();
		}
	}
	
	function colorSquare(x,y) {
		context.fillStyle = "lightgray";
		context.fillRect(x * (w/8), y * (h/8), w/8, h/8);
	}
	
	function drawKnight(x,y) {
		context.fillStyle = "black";
		context.fillRect(x * (w/8) + 5, y * (h/8) + 5, w/8 - 10, h/8 - 10);
	}
	
	function drawPotentialMove(x,y) {
		context.fillStyle = "green";
		context.fillRect(x * (w/8) + 5, y * (h/8) + 5, w/8 - 10, h/8 - 10);
	}
	
	function bgFill() {
		context.fillStyle = "white";
		context.fillRect(0,0,w,h);
		context.strokeStyle = "black";
		context.strokeRect(0,0,w,h);
	}
	
	function drawLines() {
		context.lineWidth = 2;
		context.strokeStyle = "black";
		for (var i=1; i<8; i++) {
			context.beginPath();			
			//Horizontal lines
			context.moveTo(0, h/8 * i);
			context.lineTo(w, h/8 * i); 
			context.stroke();
			
			//Vertical lines
			context.moveTo(w/8*i, 0);
			context.lineTo(w/8*i, h);
			context.stroke();
			context.closePath();
		}
	}
	
	function updateBoard(x,y) {
		if (!chessBoard[x][y].hasBeen && chessBoard[x][y].canMoveKnight) {
			updateMoveChoices(x,y);
			chessBoard[currKnightPos.x][currKnightPos.y].hasKnight = false;
			moves.push({oldX: currKnightPos.x, oldY: currKnightPos.y, newX:x, newY:y});
			currKnightPos = {x: x, y: y};
			chessBoard[x][y].hasKnight = true;
			chessBoard[x][y].hasBeen = true;
		}
	}
	
	function clearMoveChoices() {
		for(var i=0; i<8; i++) {
			for (var j=0; j<8; j++) {
				chessBoard[i][j].canMoveKnight = false;
			}
		}
	}
	
	function updateMoveChoices(x,y) {
		clearMoveChoices();
		if (x - 2 >= 0) {
			if (y - 1 >= 0) chessBoard[x-2][y-1].canMoveKnight = true;
			if (y + 1 < 8) 	chessBoard[x-2][y+1].canMoveKnight = true;
		} 
		if (x - 1 >= 0) {
			if (y-2 >= 0) 	chessBoard[x-1][y-2].canMoveKnight = true;
			if (y+2 < 8) 	chessBoard[x-1][y+2].canMoveKnight = true;
		} 
		if (x + 1 < 8) {
			if (y-2 >= 0) 	chessBoard[x+1][y-2].canMoveKnight = true;
			if (y+2 < 8) 	chessBoard[x+1][y+2].canMoveKnight = true;
		}
		if (x + 2 < 8) {
			if (y - 1 >= 0) chessBoard[x+2][y-1].canMoveKnight = true;
			if (y + 1 < 8) 	chessBoard[x+2][y+1].canMoveKnight = true;
		} 
	}
	
	function getPosition(event) {
		var x = event.x;
		var y = event.y;
		
		x -= canvas.offsetLeft;
		y -= canvas.offsetTop;
		var gridPixelW = Math.floor(x/w * 8)
		var gridPixelH = Math.floor(y/h * 8);

		bgFill();
		updateBoard(gridPixelW,gridPixelH);
		invalidateSquares();
		drawLines();
		drawMoves();
	}

})