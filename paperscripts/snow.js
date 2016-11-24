tool.fixedDistance = 30;
		
var snowbits = [];
var backgroundsnowbits = [];
var clearSnowTimer = setInterval(clearsnow, 1000);
var createSnowTimer = setInterval(createsnow, 500);
var createBackgroundTimer = setInterval(createbackgroundsnow, 700);
var lastmouselocation;

// Freezes all animations when the page is unfocused
window.addEventListener('focus', function(){
	clearSnowTimer = setInterval(clearsnow, 1000);
	createSnowTimer = setInterval(createsnow, 500);
	createBackgroundTimer = setInterval(createbackgroundsnow, 700);
});
window.addEventListener('blur', function(){
	clearInterval(clearSnowTimer);
	clearInterval(createSnowTimer);
	clearInterval(createBackgroundTimer);
});

// Called when the mouse is moved. Creates snow around mouse
function onMouseMove(event){
	lastmouselocation = event.point;
	createsnow();
}

// Move the snow down (and add jitter)
// Also keeps snow flakes to 600 in total
function onFrame(event){
	var keep = 600;
	var bgkeep = 200;
	processsnowmove(snowbits, keep);
	processsnowmove(backgroundsnowbits, bgkeep);
}

// Processes snowbit movements for a list of snow
function processsnowmove(bits, max){
		for(i = 0; i < bits.length; i++){
		bits[i].position.y += Math.random() + 1;
		if(Math.random() > 0.7)
			bits[i].position.x += Math.random() - 0.5;
		if(i < bits.length - max)
			bits[i].remove();
	};
	bits.splice(0, Math.max(bits.length - max, 0));
}

// Removes snow that has fallen below the bottom of the screen
function clearsnow(){
	removesnow(snowbits);
	removesnow(backgroundsnowbits);
}

// Removes snow for a list of snow
function removesnow(bits){
	var removeids = [];
	for(i = 0; i < bits.length; i++){
		if(bits[i].position.y > view.viewSize.height){
			removeids.push(i);
			bits[i].remove();
		}
	};

	for(i = removeids.length - 1 ; i >= 0; i--)
		bits.splice(removeids[i], 1);
}

// Create's snowflakes around the mouse
function createsnow(){
	var startlocation = lastmouselocation;
	for(i = 0; i < 2; i++){
		var flake = new Path.Circle(startlocation + getrandomoffset(60), parseInt(Math.random() * 3));
		flake.fillColor = 'white';
		snowbits.push(flake);
	}
}

// Returns a jitter vector (added to snow for random initial placement)
function getrandomoffset(spread){
	var vector = new Point();
	vector.length = Math.random() * spread - spread/2;
	vector.angle = Math.random() * 360;
	return vector;
}

// Creates background snow
function createbackgroundsnow(){
	for(i = 0; i < 2; i++){
		var startlocation = [Math.random() * view.viewSize.width, 0];
		var flake = new Path.Circle(startlocation, 1.5);
		flake.fillColor = 'white';
		flake.opacity = 0.75;
		backgroundsnowbits.push(flake);
	}
}