$(document).ready(function() {
hideHonoursInfo();

	function hideHonoursInfo() {
		hideTimer = window.setTimeout(function() {
			document.getElementById("honours-info").style.display = 'none';
			removeClass(document.getElementById("honours"), "hover-info");
		}, 100);
	}
	function showHonoursInfo() {
		addClass(document.getElementById("honours"), "hover-info");
		document.getElementById("honours-info").style.display = 'inline-block';
		document.getElementById("honours-info").style.below = document.getElementById("honours-info").offsetParent.offsetWidth - (document.getElementById("honours").offsetLeft + document.getElementById("honours-info").offsetWidth + document.getElementById("honours").offsetWidth + 7) + 'px';
	}
	
	document.getElementById("honours-info").addEventListener("mouseover", showHonoursInfo);
	document.getElementById("honours").addEventListener("mouseover", showHonoursInfo);

	document.getElementById("honours-info").addEventListener("mouseout", hideHonoursInfo);
	document.getElementById("honours").addEventListener("mouseout", hideHonoursInfo);
	
	function addClass(el, name) {
		var names = el.className.split(' ');

		if(!~names.indexOf(name)) {
		  names.push(name);
		  el.className = names.join(' ');
		}

		return el;
	}

	function removeClass(el, name) {
		var names = el.className.split(' ');

		while(~names.indexOf(name)) {
		  names.splice(names.indexOf(name), 1);
		}

		el.className = names.join(' ');

		return el;
	}

})