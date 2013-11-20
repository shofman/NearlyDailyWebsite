var passVar = 'a';

function passValues() {
	return passVar;
}

$(document).ready(function() {
	var canvas = $("#letters")[0];
	var ctx = canvas.getContext("2d");
	var w = canvas.width;
	var h = canvas.height;
	var alphabet = "abcdefghijklmnopqrstuvwxyz";
	var charPosArray = [];
	
	canvas.addEventListener('mousedown', function(event) {
		var mousePos = getMousePos(canvas, event);
		var selectedLetter;
		var chosen = false;
		for (var i=0; i<25; i++) {
			if (charPosArray[i] > mousePos.x) {
				selectedLetter = alphabet.charAt(i);
				chosen = true;
				break;
			}
		}
		if (!chosen) {
			selectedLetter = alphabet.charAt(alphabet.length-1);
		}
		alert(selectedLetter);
		passVar = selectedLetter;
	});
	
	bgFill();
	fillLetters();

	function getMousePos(canvas, event) {
		var rect = canvas.getBoundingClientRect();
		return {
			x: event.clientX - rect.left,
			y: event.clientY - rect.top
		};

	}
	
	
	function bgFill() {
		ctx.fillStyle = "white";
		ctx.fillRect(0,0,w,h);
		ctx.strokeStyle = "black";
		ctx.strokeRect(0,0,w,h);
	}
	
	function fillLetters() {
		var hpos = h/1.6;
		var wpos = w/(26*2);
		ctx.font = '30pt Times';

		for (var i=0; i<alphabet.length; i++) {
			ctx.strokeText(alphabet.charAt(i), wpos, hpos);
			metrics = ctx.measureText(alphabet.charAt(i));
			charPosArray[i] = wpos + (metrics.width/2) + w/(26*2.2);			
			wpos += w/(26*2.2) + metrics.width;
		}

	}
	

})