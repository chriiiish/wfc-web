// Background of tony's desk
var tonybg = new Raster("tonybg");
tonybg.position = view.center;

// Background of Jinjin's desk
var jinjinbg = new Raster("jinjinbg");
jinjinbg.position = view.center;

// Background of the Lunch room
var lunchbg = new Raster("lunchbg");
lunchbg.position = view.center;

// Show tony's background
globals.showTonyBg = function(){
	jinjinbg.visible = false;
	lunchbg.visible = false;
	tonybg.visible = true;
	tonybg.sendToBack();
};

// Show Jinjin's background
globals.showJinjinBg = function(){
	tonybg.visible = false;
	lunchbg.visible = false;
	jinjinbg.visible = true;
	jinjinbg.sendToBack();
};

// Show Lunch room background
globals.showLunchBg = function(){
	tonybg.visible = false;
	jinjinbg.visible = false;
	lunchbg.visible = true;
	lunchbg.sendToBack();
};

globals.showTonyBg();

function resize(){
	var list = [tonybg, jinjinbg, lunchbg];
	for(i = 0; i < list.length; i++){
		var ratioheight = list[i].height / list[i].width;
		var ratiowidth = list[i].width / list[i].height;

		//Try set width, but check that image height is still outside edges
		if(ratioheight * view.viewSize.width > view.viewSize.height){
			list[i].height = ratioheight * view.viewSize.width;
			list[i].width = view.viewSize.width;
		}else{
			list[i].height = view.viewSize.height;
			list[i].width = ratiowidth * view.viewSize.height;
		}

		list[i].position = view.center;
	}
};

resize();

// Handle some resize
window.addEventListener("resize", resize);

