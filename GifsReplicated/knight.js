$(document).ready(function() {
	var canvas = $('#canvas')[0];
	var context = canvas.getContext('2d');
	var w = canvas.width;
	var h = canvas.height;
	canvas.addEventListener("mousedown", getPosition, false);
	var currKnightPos = {x:0,y:0};
	var chessBoard = [];
	var chessBoardSize = 5;
	for (var i = 0; i<chessBoardSize; i++) {
		chessBoard[i] = [];
		for (var j=0; j<chessBoardSize; j++) {
			chessBoard[i][j] = {hasKnight:false, canMoveKnight:true, hasBeen:false};
		}
	}
	
	var moves = [];

	
	chessBoard[currKnightPos.x][currKnightPos.y].hasKnight = true;
	chessBoard[currKnightPos.x][currKnightPos.y].hasBeen = true;
	updateMoveChoices(currKnightPos.x,currKnightPos.y);
	draw();
	document.getElementById("undo").onclick = undo;
	document.getElementById("bruteforce").onclick = checkBruteForce;
	document.getElementById("prevbrute").onclick = checkBruteForce2;
	
	function checkBruteForce2() {
		//alert("This");
		var found = bruteForceSolution();
		if (!found) alert("no solution");
	}

	function checkBruteForce() {
		foundBruteForce = false;
		index = 0;
		listOfStacks = [];
		solved = animateBruteForce();
		//if (!solved) alert("No solution");
	}
	
	function undo() {
		var undoMove = moves.pop();
		if (undoMove != undefined) {
			moveKnight(undoMove.oldX, undoMove.oldY);
			chessBoard[undoMove.newX][undoMove.newY].hasBeen = false;
			draw();
		}
	}
	
	function draw() {
		bgFill();
		drawSquares();
		drawLines();
		drawMoves();
	}
	
	function copyChessBoard() {
		var copy = [];
		for (var i = 0; i<chessBoardSize; i++) {
			copy[i] = [];
			for (var j=0; j<chessBoardSize; j++) {
				copy[i][j] = {hasKnight:chessBoard[i][j].hasKnight, canMoveKnight: chessBoard[i][j].canMoveKnight, hasBeen: chessBoard[i][j].hasBeen};
			}
		}
		return copy;
	}
	
	function checkChessBoard() {
		for (var i = 0; i<chessBoardSize; i++) {
			for (var j=0; j<chessBoardSize; j++) {
				if(!chessBoard[i][j].hasBeen) {
					return false;
				}
			}
		}
		return true;
	}
	var foundBruteForce = false;
	var index = 0;
	var listOfStacks = [];
	
	function animateBruteForce() {
        // update
		if (listOfStacks.length <= index) {
			var stack = [];
			findPossibleMoves(stack);
			if (stack.length == 0) {
				foundBruteForce = checkBruteForceVictory();
				if (foundBruteForce) {
					alert("This");
					return;
				}
				else { 
					undo();
					index--;
				}
			} else {
				listOfStacks.push(stack);
				if(listOfStacks[index].length != 0) {
					var move = listOfStacks[index].pop();
					updateBoard(move.x,move.y);
					index++;
				}
			}
		} else {
			if(listOfStacks[index].length != 0) {
				var move = listOfStacks[index].pop();
				updateBoard(move.x,move.y);
				index++;
			} else {
				//Pop empty stack
				listOfStacks.pop();
				undo();
				index--;
			}
		}


	
        // clear
        context.clearRect(0, 0, canvas.width, canvas.height);

        // draw
		draw();

        // request new frame
        requestAnimationFrame(function() {
          animateBruteForce();
        });
    }
	
	function bruteForceSolution() {
		var stack = [];
		findPossibleMoves(stack);
		if (stack.length == 0) {
			if (checkBruteForceVictory()) {
				return true;
			}
			return false;
		}
		var found = false;
		while(stack.length != 0) {
			var move = stack.pop();
			updateBoard(move.x,move.y);
			draw();
			alert("this");
			var result = bruteForceSolution();
			if (!result) undo();
			else return true;
		}
		return false;
	}
	
	function checkBruteForceVictory() {
		for (var i = 0; i<chessBoardSize; i++) {
			for (var j=0; j<chessBoardSize; j++) {
				if(!chessBoard[i][j].hasBeen) {
					return false;
				}
			}
		}
		return true;
	}
	
	function findPossibleMoves(stack) {
		for(var i=0; i<chessBoardSize; i++) {
			for (var j=0; j<chessBoardSize; j++) {
				if(chessBoard[i][j].canMoveKnight && !(chessBoard[i][j].hasBeen)) {
					stack.push({x:i, y:j});
				}
			}
		} 
	}
	
	function drawSquares() {
		for (var i=0; i<chessBoardSize; i++) {
			for (var j=0; j<chessBoardSize; j++) {
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
			context.moveTo(moves[i].oldX * (w/chessBoardSize) + (w/16), moves[i].oldY * (h/chessBoardSize) + (h/16));
			context.lineTo(moves[i].newX * (w/chessBoardSize) + (w/16), moves[i].newY * (h/chessBoardSize) + (h/16));
			context.stroke();
			context.closePath();
		}
	}
	
	function colorSquare(x,y) {
		context.fillStyle = "lightgray";
		context.fillRect(x * (w/chessBoardSize), y * (h/chessBoardSize), w/chessBoardSize, h/chessBoardSize);
	}
	
	function drawKnight(x,y) {
		context.fillStyle = "black";
		context.fillRect(x * (w/chessBoardSize) + 5, y * (h/chessBoardSize) + 5, w/chessBoardSize - 10, h/chessBoardSize - 10);
	}
	
	function drawPotentialMove(x,y) {
		context.fillStyle = "green";
		context.fillRect(x * (w/chessBoardSize) + 5, y * (h/chessBoardSize) + 5, w/chessBoardSize - 10, h/chessBoardSize - 10);
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
		for (var i=1; i<chessBoardSize; i++) {
			context.beginPath();			
			//Horizontal lines
			context.moveTo(0, h/chessBoardSize * i);
			context.lineTo(w, h/chessBoardSize * i); 
			context.stroke();
			
			//Vertical lines
			context.moveTo(w/chessBoardSize*i, 0);
			context.lineTo(w/chessBoardSize*i, h);
			context.stroke();
			context.closePath();
		}
	}
	

	
	function moveKnight(x,y) {
		updateMoveChoices(x,y);
		chessBoard[currKnightPos.x][currKnightPos.y].hasKnight = false;
		currKnightPos = {x: x, y: y};
		chessBoard[x][y].hasKnight = true;
		chessBoard[x][y].hasBeen = true;
	}
	
	function updateBoard(x,y) {
		if (!chessBoard[x][y].hasBeen && chessBoard[x][y].canMoveKnight) {
			moves.push({oldX: currKnightPos.x, oldY: currKnightPos.y, newX:x, newY:y});
			moveKnight(x,y);
		}
	}
	
	function clearMoveChoices() {
		for(var i=0; i<chessBoardSize; i++) {
			for (var j=0; j<chessBoardSize; j++) {
				chessBoard[i][j].canMoveKnight = false;
			}
		}
	}
	
	function updateMoveChoices(x,y) {
		clearMoveChoices();
		if (x - 2 >= 0) {
			if (y - 1 >= 0) chessBoard[x-2][y-1].canMoveKnight = true;
			if (y + 1 < chessBoardSize) 	chessBoard[x-2][y+1].canMoveKnight = true;
		} 
		if (x - 1 >= 0) {
			if (y-2 >= 0) 	chessBoard[x-1][y-2].canMoveKnight = true;
			if (y+2 < chessBoardSize) 	chessBoard[x-1][y+2].canMoveKnight = true;
		} 
		if (x + 1 < chessBoardSize) {
			if (y-2 >= 0) 	chessBoard[x+1][y-2].canMoveKnight = true;
			if (y+2 < chessBoardSize) 	chessBoard[x+1][y+2].canMoveKnight = true;
		}
		if (x + 2 < chessBoardSize) {
			if (y - 1 >= 0) chessBoard[x+2][y-1].canMoveKnight = true;
			if (y + 1 < chessBoardSize) 	chessBoard[x+2][y+1].canMoveKnight = true;
		} 
	}
	
	function getPosition(event) {
		var x = event.x;
		var y = event.y;
		
		x -= canvas.offsetLeft;
		y -= canvas.offsetTop;
		var gridPixelW = Math.floor(x/w * chessBoardSize)
		var gridPixelH = Math.floor(y/h * chessBoardSize);
		
		updateBoard(gridPixelW,gridPixelH);
		draw();
	}

})