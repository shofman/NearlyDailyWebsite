$(document).ready(function () {
	var canvas = $("#canvas")[0];
	var ctx = canvas.getContext("2d");	
	var w = canvas.width;
	var h = canvas.height;
	
	var grid = new Array();
	var gridSize = 10;
	drawBG();
	drawLetterUnderlines();
	//drawLine(2*h/3, (1*10) + (w/20), (1*10) + (w/10));
	var word = "lightfaced";
	var alphabet = "abcdefghijklmnopqrstuvwxyz";
	var shuffledAlphabet = "a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z";
	var alphaArray = shuffledAlphabet.split(',');
	shuffledAlphabet = fisherYatesShuffle(alphaArray);
	
	canvas.addEventListener('mousedown', function(event) {
		var response = passValues();
		drawBG();
		drawLetterUnderlines();
		ctx.fillStyle = "black";
		ctx.font = '30pt Times';
		ctx.strokeText(response, 800, 2*h/3);

	});

	
	var dupeAlphabet = alphabet;
		//alert(letter + " = " + shuffledAlphabet[alphabet.indexOf(letter)]);

	function drawLetterUnderlines() {
		for (var i=0; i<gridSize; i++) {
			drawLine(2*h/3, (i*75), 50 + (i*75));
		}
	}
	
	function drawLine(height, initialWidth, finalWidth) {
		ctx.beginPath();
		ctx.strokeStyle = "black";
		ctx.lineWidth = 2;
		ctx.moveTo(initialWidth, height);
		ctx.lineTo(finalWidth, height);
		ctx.stroke();
		ctx.closePath();
	}
	
	function drawBG() {
		ctx.fillStyle = "white";
		ctx.fillRect(0,0,w,h);
		ctx.strokeStyle = "black";
		ctx.strokeRect(0,0,w,h);
	}
	
	function fisherYatesShuffle(array) {
		for (var i = array.length - 1; i > 0; i--) {
			var j = Math.floor(Math.random() * (i + 1));
			var temp = array[i];
			array[i] = array[j];
			array[j] = temp;
		}
		return array;
	}

})