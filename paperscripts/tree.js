var miniTrees = new Group();

/////////////////////////////
// Control baubels
/////////////////////////////
function Baubel(inital, color){
	var item = new Group();

	item.enable = function(){
		this.opacity = 1;
	};

	item.disable = function(){
		this.opacity = 0.5;
	};

	item.ison = function(){
		return this.opacity == 1;
	};

	item.toggle = function(){
		if(this.ison()){
			this.disable();
		}
		else{
			this.enable();
		}

	};

	// Add the circle bit
	var circle = new Path.Circle([20,30], 15);
	circle.strokeColor = 'white';
	circle.strokeWidth = 3;
	circle.fillColor = color;
	item.addChild(circle);

	// Add the hook
	var hook = new Path([15, 15], [20 + (Math.random() * 6 - 3),10], [25,15]);
	hook.strokeColor = 'white';
	hook.strokeWidth = 2;
	hook.smooth();
	item.addChild(hook);

	// Add the bobble
	var bobble = new Path.RoundRectangle([12,13], [16,5]);
	bobble.fillColor = 'white';
	item.addChild(bobble);

	// Add the Letter
	var letter = new PointText();
	letter.strokeColor = 'white';
	letter.fillColor = 'white';
	letter.fontFamily = 'Arial';
	letter.fontSize = '14pt';
	letter.content = inital;
	letter.position = circle.position + [0,1];
	item.addChild(letter);
	item.letter = letter;

	// Change the mouse to a click hand
	item.onMouseEnter = function(){
		document.body.style.cursor = "pointer";
	};
	item.onMouseLeave = function(){
		document.body.style.cursor = "auto";
	};

	return item;
}

/////////////////////////////
// String of lights
/////////////////////////////
function Lights(path, color){
	var item = new Group();
	item.color = color;
	var self = item;

	item.on = function(){
		for(i = 0; i < this.children.length; i++){
			this.children[i].fillColor = this.color;
			this.children[i].opacity = 0.7 + (Math.random() * 0.4);
		}
	};

	item.off = function(){
		for(i = 0; i < this.children.length; i++){
			this.children[i].fillColor = new Color(0.5, 0.5, 0.5);
			this.children[i].opacity = 0.3;
		}
	};

	item.specialon = function(){
		item.special = setInterval(item.doSpecial, Math.random() * 500 + 500);
	};

	item.specialoff = function(){
		clearInterval(item.special);
		item.special = undefined;
	};

	item.isSpecial = function(){
		return item.special != undefined;
	};

	item.doSpecial = function(){
		for(i = 0; i < self.children.length; i++){
			self.children[i].fillColor = self.color;
			self.children[i].opacity = Math.random();
		}
	};

	for(i = 0; i < path.length; i++){
		item.addChild(new Path.Circle(path[i], 4));
	}

	item.fillColor = color;
	item.strokeColor = 'black';
	item.strokeWidth = 0.5;

	return item;
}

/////////////////////////////
// Creates a mini christmas tree (used for navigation)
/////////////////////////////
function MiniTree(name, localStorageName){
	//Tree fits inside [60,90]
	var item = new Group();
	item.iscurrent = false;
	item.onchange = new function(){};
	item.bigtree = undefined;
	item.name = localStorageName;
	item.backgroundchange = undefined;

	// Tinsel for when it is the active tree
	item.tinselColor = new Color(0,0,1,1);
	item.tinsel = new Group();

	var tinsel1 = new Path([40,20],[30,40],[15,50]);
	tinsel1.strokeColor = item.tinselColor;
	tinsel1.strokeWidth = 10;
	tinsel1.strokeCap = 'round';
	tinsel1.smooth();
	var tinsel2 = new Path([45,40], [40,60], [10,75]);
	tinsel2.style = tinsel1.style;
	tinsel2.smooth();


	item.tinsel.addChild(tinsel1);
	item.tinsel.addChild(tinsel2);


	

	// Tree (leaves)
	var half1 = new Path([30,0], [45, 25], [40, 25], [52,50], [48,50], [60, 75], [30,75]);
	half1.strokeColor = 'white';
	half1.fillColor = 'green';
	half1.strokeCap = 'round';
	half1.strokeJoin = 'round';
	half1.strokeWidth = 3;

	var half2 = half1.clone();
	half2.scale(-1,1);
	half2.position -= [30,0];

	// Add the trunk
	var trunk = new Path([30,75], [30,90]);
	trunk.strokeColor = 'brown';
	trunk.strokeWidth = 20;
	trunk.strokeCap = 'butt';

	// Merges the two halves together
	var middle = new Path([30,1],[30,75]);
	middle.strokeColor = 'green';

	// Text
	var text = new PointText();
	text.strokeColor = 'white';
	text.fillColor = 'white';
	text.content = name;
	text.fontFamily = 'Arial';
	text.fontWeight = 'Bold';
	text.fontSize = '14pt';
	text.bounds.center = [30,100];

	// Assemble the tree
	item.addChild(middle);
	item.addChild(trunk);
	item.addChild(half1);
	item.addChild(half2);
	item.addChild(text);
	item.addChild(item.tinsel);

	// This function shows/hides the tinsel
	item.current = function(yesno){
		if(yesno == undefined) return this.iscurrent;
		this.iscurrent = yesno;
		if(yesno){
			this.tinsel.strokeColor = this.tinselColor;
			if(this.bigtree != undefined) this.bigtree.visible = true;			
			if(this.backgroundchange != undefined) this.backgroundchange();
		}else{
			this.tinsel.strokeColor = new Color(0,0,0,0);
			if(this.bigtree != undefined){
				this.bigtree.visible = false;
			}
		}
		return yesno;
	}

	// Hide tinsel by default
	item.current(false);

	// Makes sure the tinsel colour is up to date
	item.onFrame = function(event){
		this.tinsel.strokeColor = this.iscurrent ? this.tinselColor : new Color(0,0,0,0);
	}

	// Moves the tree around
	item.onMouseDrag = function(event){
		this.bounds.center = event.point;
	}

	// stores where the tree is placed in localstorage
	item.onMouseUp = function(event){
		if(typeof(Storage) != "undefined"){
			localStorage.setItem(this.name, JSON.stringify(event.point));
		}
		// Changes current tree to this one (only if not drag)
		if(event.delta == [0,0]){
			this.tinselColor.hue = Math.random() * 360;
			if(this.onchange != undefined) this.onchange();
			this.current(true);
		}
	};
	item.onDoubleClick = function(event){
		this.tinselColor.hue = Math.random() * 360;
		if(this.onchange != undefined) this.onchange();
		this.current(true);
	};
	
	// Change the mouse to a click hand
	item.onMouseEnter = function(){
		document.body.style.cursor = "pointer";
	};
	item.onMouseLeave = function(){
		document.body.style.cursor = "auto";
	};

	this.item = item;
	return item;
}


/////////////////////////////
// THIS IS THE MAIN TREE
/////////////////////////////
function BigTree(name){
	//Tree fits inside [300, 600]
	var item = new Group();
	item.tinselColor = new Color(0,0,1);
	item.redBaubel = new Baubel('R', 'red');
	item.greenBaubel = new Baubel('G', '#71f442');
	item.blueBaubel = new Baubel('B', 'blue');
	item.purpleBaubel = new Baubel('P', 'purple');
	item.whiteBaubel = new Baubel('W', 'white');

	// Blends the two halves of the tree
	var middle = new Path([150,3], [150,350]);
	middle.strokeColor = 'green';
	middle.strokeWidth = 10;

	// Tree (leaves)
	var half1 = new Path([150,0], 
						 [220, 70], [205, 65], 
						 [240, 140], [225, 135], 
						 [255, 210], [243, 207], 
						 [267, 280], [257, 277],
						 [272, 350], [150, 350]);
	half1.strokeColor = 'white';
	half1.fillColor = 'green';
	half1.strokeCap = 'round';
	half1.strokeJoin = 'round';
	half1.strokeWidth = 3;

	var half2 = half1.clone();
	half2.scale(-1,1);
	half2.position -= [half2.bounds.width,0];

	// Add the trunk
	var trunk = new Path([150, half1.bounds.height], [150,half1.bounds.height + 60]);
	trunk.strokeColor = 'brown';
	trunk.strokeWidth = 45;
	trunk.strokeCap = 'butt';

	// Add the pot at the bottom
	var pot = new Group();
		var potmiddle = new Path([0,20],[150,20]);
		potmiddle.strokeColor = 'grey';
		potmiddle.strokeWidth = 10;
	pot.addChild(potmiddle);
		var pottopbg = new Path.Rectangle(new Rectangle([0,0], [150,20]));
		pottopbg.fillColor = 'grey';
	pot.addChild(pottopbg);
		var potbottombg = new Path([0,20],[150,20],[140,60], [10, 60]);
		potbottombg.closed = true;
		potbottombg.style = pottopbg.style;
	pot.addChild(potbottombg);
		var border = new Path([0,0], [150,0], [150,20], [140,60], [10,60], [0,20], [0,0]);
		border.strokeColor = 'dark grey';
		border.strokeWidth = 7;
		border.closed = true;
		border.strokeJoin = 'round';
		border.strokeCap = 'round';
	pot.addChild(border);

	pot.position = [150,half1.bounds.height + 50];


	// Change the mouse to a click hand
	pot.onMouseEnter = function(){
		document.body.style.cursor = "pointer";
	};
	pot.onMouseLeave = function(){
		document.body.style.cursor = "auto";
	};

	item.base = pot;

	// Text
	var text = new PointText();
	text.strokeColor = 'white';
	text.fillColor = 'white';
	text.content = name;
	text.fontFamily = 'Arial';
	text.fontWeight = 'normal';
	text.fontSize = '14pt';
	text.position = pot.bounds.center;
	item.text = text;

	// Tinsel
	var tinsel = new Group();
		var tinsel1 = new Path([206,54],[187,77],[162,94],[136,109],[110,123],[81,131],[66,135]);
		tinsel1.strokeColor = 'blue';
		tinsel1.fillColor = new Color(0,0,0,0);
		tinsel1.strokeWidth = 16;
		tinsel1.smooth();
		tinsel1.strokeCap = 'round';
	tinsel.addChild(tinsel1);
		var tinsel2 = new Path([230,115], [212,139], [190,159], [164,174], [136,185], [107,194], [78,201], [48,200], [48,201]);
		tinsel2.style = tinsel1.style;
		tinsel2.smooth();
		tinsel2.strokeColor = 'yellow';
	tinsel.addChild(tinsel2);
		var tinsel3 = new Path([247,190], [222,206], [195,219], [168,232], [140,243], [111,252], [82,260], [52,260], [43,260]);
		tinsel3.style = tinsel1.style;
		tinsel3.smooth();
		tinsel3.strokeColor = 'rgb(59,255,0)';
	tinsel.addChild(tinsel3);
		var tinsel4 = new Path([262,266], [234,278], [206,287], [177,296], [149,306], [121,316], [97,334], [67,334], [37,331], [33,333]);
		tinsel4.style = tinsel1.style;
		tinsel4.smooth();
		tinsel4.strokeColor = 'blue';
	tinsel.addChild(tinsel4);	
		var tinsel5 = new Path([126,21], [148,41], [172,58], [202,58], [213,57]);
		tinsel5.style = tinsel1.style;
		tinsel5.strokeWidth = 7;
		tinsel5.smooth();
		tinsel5.strokeColor = 'red';
	tinsel.insertChild(0,tinsel5);	
		var tinsel6 = new Path([108,45], [121,71], [137,96], [165,107], [194,100], [216,89]);
		tinsel6.style = tinsel5.style;
		tinsel6.smooth();
	tinsel.insertChild(0,tinsel6);	
		var tinsel7 = new Path([69,144], [85,169], [108,187], [137,195], [167,200], [197,200], [227,201], [248,208]);
		tinsel7.style = tinsel5.style;
		tinsel7.smooth();
	tinsel.insertChild(0,tinsel7);	
		var tinsel8 = new Path([54,209], [68,235], [90,255], [118,268], [146,278], [173,291], [200,304], [228,314], [257,321], [267,325]);
		tinsel8.style = tinsel5.style;
		tinsel8.smooth();
	tinsel.insertChild(0,tinsel8);	

	// Baubels
	item.redBaubel.position = [100,100];
	item.greenBaubel.position = [150,40];
	item.blueBaubel.position = [200,300];
	item.purpleBaubel.position = [80,203];
	item.whiteBaubel.position = [220,195];
	item.whiteBaubel.letter.strokeColor = 'black';
	item.whiteBaubel.letter.fillColor = 'black';

	// Lights
	item.redLights = new Lights([[114,35], [154,79], [192,125], [219,178], [220,233], [175,272], [130,311], [83,348]], 'red');
	item.greenLights = new Lights([[93,79], [125,128], [113,187], [97,245], [92,305]], '#71f442');
	item.blueLights = new Lights([[67,170], [110,209], [150,253], [209,259], [265,271]], 'blue');
	item.purpleLights = new Lights([[71,148], [130,151], [183,133], [192,76]], 'purple');
	item.whiteLights = new Lights([[43,290], [95,262], [155,262], [197,221], [163,172], [203,128], [164,89]], 'white');

	// Assemble the tree
	item.addChild(middle);
	item.addChild(trunk);
	item.addChild(half1);
	item.addChild(half2);
	item.addChild(pot);
	item.addChild(text);
	item.addChild(item.redLights);
	item.addChild(item.greenLights);
	item.addChild(item.blueLights);
	item.addChild(item.purpleLights);
	item.addChild(item.whiteLights);
	item.addChild(tinsel);
	item.addChild(item.redBaubel);
	item.addChild(item.greenBaubel);
	item.addChild(item.blueBaubel);
	item.addChild(item.purpleBaubel);
	item.addChild(item.whiteBaubel);

	item.disable = function(color){
		if(color == undefined){
			this.redBaubel.disable();
			this.greenBaubel.disable();
			this.blueBaubel.disable();
			this.purpleBaubel.disable();
			this.whiteBaubel.disable();
			return;
		};
		switch(color){
			case 'red':
				return this.redBaubel.disable();
			case 'green':
				return this.greenBaubel.disable();
			case 'blue':
				return this.blueBaubel.disable();
			case 'purple':
				return this.purpleBaubel.disable();
			case 'white':
				return this.whiteBaubel.disable();
		}
	};

	item.enable = function(color){
		if(color == undefined){
			this.redBaubel.enable();
			this.greenBaubel.enable();
			this.blueBaubel.enable();
			this.purpleBaubel.enable();
			this.whiteBaubel.enable();
			return;
		};
		switch(color){
			case 'red':
				return this.redBaubel.enable();
			case 'green':
				return this.greenBaubel.enable();
			case 'blue':
				return this.blueBaubel.enable();
			case 'purple':
				return this.purpleBaubel.enable();
			case 'white':
				return this.whiteBaubel.enable();
		}
	}

	return item;
}

// Setups up lights for tree
var processLights = function(lights, tree){
	if(lights.red > 0){
		tree.enable('red');
		tree.redLights.on();
	}else{
		tree.disable('red');
		tree.redLights.off();
	}

	if(lights.green > 0){
		tree.enable('green');
		tree.greenLights.on();
	}else{
		tree.disable('green');
		tree.greenLights.off();
	}

	if(lights.blue > 0){
		tree.enable('blue');
		tree.blueLights.on();
	}else{
		tree.disable('blue');
		tree.blueLights.off();
	}

	if(lights.purple > 0){
		tree.enable('purple');
		tree.purpleLights.on();
	}else{
		tree.disable('purple');
		tree.purpleLights.off();
	}

	if(lights.white > 0){
		tree.enable('white');
		tree.whiteLights.on();
	}else{
		tree.disable('white');
		tree.whiteLights.off();
	}

	if(lights.special){
		tree.redLights.specialon();
		tree.greenLights.specialon();
		tree.blueLights.specialon();
		tree.purpleLights.specialon();
		tree.whiteLights.specialon();
	}else{
		tree.redLights.specialoff();
		tree.greenLights.specialoff();
		tree.blueLights.specialoff();
		tree.purpleLights.specialoff();
		tree.whiteLights.specialoff();
	}
};

// Add Mini Trees
var miniTony = new MiniTree("Tony", "tony");
miniTrees.addChild(miniTony);
miniTony.current(true);
miniTony.onchange = disableminitrees;
miniTony.backgroundchange = globals.showTonyBg;
var miniJinjin = new MiniTree("Jinjin", "jinjin");
miniTrees.addChild(miniJinjin);
miniJinjin.onchange = disableminitrees;
miniJinjin.backgroundchange = globals.showJinjinBg;
var miniLunch = new MiniTree("Lunch Room", "lunch");
miniTrees.addChild(miniLunch);
miniLunch.onchange = disableminitrees;
miniLunch.backgroundchange = globals.showLunchBg;

// Initially Position Mini Trees
miniTony.position = [view.viewSize.width / 4, 100];
miniJinjin.position = [(view.viewSize.width / 4) * 2, 100];
miniLunch.position = [(view.viewSize.width / 4) * 3, 100];
// If we have already got their position stored...
if(typeof(Storage) != "undefined"){
	if(localStorage.tony != undefined) miniTony.position = JSON.parse(localStorage.tony).splice(1,2);
	if(localStorage.jinjin != undefined) miniJinjin.position = JSON.parse(localStorage.jinjin).splice(1,2);
	if(localStorage.lunch != undefined) miniLunch.position = JSON.parse(localStorage.lunch).splice(1,2);
}


// Tell the mini trees to disable
function disableminitrees(){
	miniTony.current(false);
	miniJinjin.current(false);
	miniLunch.current(false);
}


// Add trees
// var devtree = new BigTree("devtree").scale(view.viewSize.height / 700);
// devtree.position = view.center + [0,(view.viewSize.height / 1200) * 100];
var tree1 = new BigTree("Tony's Desk").scale(view.viewSize.height / 700);
tree1.position = view.center + [0,(view.viewSize.height / 1200) * 100];
tree1.visible = true;
var tree2 = new BigTree("Jinjin's Desk").scale(view.viewSize.height / 700);
tree2.position = view.center + [0,(view.viewSize.height / 1200) * 100];
tree2.visible = false;
var tree3 = new BigTree("Lunch Room").scale(view.viewSize.height / 700);
tree3.position = view.center + [0,(view.viewSize.height / 1200) * 100];
tree3.visible = false;

// Assign the big trees to the mini trees
miniTony.bigtree = tree1;
miniJinjin.bigtree = tree2;
miniLunch.bigtree = tree3;

// Add listeners
globals.tree1listener = function(){
	processLights(this, tree1);
};
globals.tree2listener = function(){
	processLights(this, tree2);
};
globals.tree3listener = function(){
	processLights(this, tree3);
};
// globals.devtreelistener = function() {
// 	processLights(this, devtree);
// };
// Listeners for clicks
globals.finishListeners = function(){
	tree1.redBaubel.onClick = function(){ updateserver(globals.tree1, tree1, 'red') };
	tree1.greenBaubel.onClick = function(){ updateserver(globals.tree1, tree1, 'green') };
	tree1.blueBaubel.onClick = function(){ updateserver(globals.tree1, tree1, 'blue') };
	tree1.purpleBaubel.onClick = function(){ updateserver(globals.tree1, tree1, 'purple') };
	tree1.whiteBaubel.onClick = function(){ updateserver(globals.tree1, tree1, 'white') };
	tree1.base.onClick = function(){ updateserver(globals.tree1, tree1, 'special') };
	tree1.text.onClick = tree1.base.onClick;

	tree2.redBaubel.onClick = function(){ updateserver(globals.tree2, tree2, 'red') };
	tree2.greenBaubel.onClick = function(){ updateserver(globals.tree2, tree2, 'green') };
	tree2.blueBaubel.onClick = function(){ updateserver(globals.tree2, tree2, 'blue') };
	tree2.purpleBaubel.onClick = function(){ updateserver(globals.tree2, tree2, 'purple') };
	tree2.whiteBaubel.onClick = function(){ updateserver(globals.tree2, tree2, 'white') };
	tree2.base.onClick = function(){ updateserver(globals.tree2, tree2, 'special') };
	tree2.text.onClick = tree2.base.onClick;

	tree3.redBaubel.onClick = function(){ updateserver(globals.tree3, tree3, 'red') };
	tree3.greenBaubel.onClick = function(){ updateserver(globals.tree3, tree3, 'green') };
	tree3.blueBaubel.onClick = function(){ updateserver(globals.tree3, tree3, 'blue') };
	tree3.purpleBaubel.onClick = function(){ updateserver(globals.tree3, tree3, 'purple') };
	tree3.whiteBaubel.onClick = function(){ updateserver(globals.tree3, tree3, 'white') };
	tree3.base.onClick = function(){ updateserver(globals.tree3, tree3, 'special') };
	tree3.text.onClick = tree3.base.onClick;

	// devtree.redBaubel.onClick = function(){ updateserver(globals.devtree, devtree, 'red') };
	// devtree.greenBaubel.onClick = function(){ updateserver(globals.devtree, devtree, 'green') };
	// devtree.blueBaubel.onClick = function(){ updateserver(globals.devtree, devtree, 'blue') };
	// devtree.purpleBaubel.onClick = function(){ updateserver(globals.devtree, devtree, 'purple') };
	// devtree.whiteBaubel.onClick = function(){ updateserver(globals.devtree, devtree, 'white') };
	// devtree.base.onClick = function(){ updateserver(globals.devtree, devtree, 'special') };
	// devtree.text.onClick = devtree.base.onClick;
};

// This updates the server tree (mqtt library) with the values
var updateserver = function(servertree, papertree, color){
	servertree.special = false;
	switch(color){
		case 'red':
			papertree.redBaubel.toggle();
			servertree.red = papertree.redBaubel.ison() ? 255 :  0;
			break;
		case 'green':
			papertree.greenBaubel.toggle();
			servertree.green = papertree.greenBaubel.ison() ? 255 :  0;
			break;
		case 'blue':
			papertree.blueBaubel.toggle();
			servertree.blue = papertree.blueBaubel.ison() ? 255 :  0;
			break;
		case 'purple':
			papertree.purpleBaubel.toggle();
			servertree.purple = papertree.purpleBaubel.ison() ? 255 :  0;
			break;
		case 'white':
			papertree.whiteBaubel.toggle();
			servertree.white = papertree.whiteBaubel.ison() ? 255 :  0;
			break;	
		case 'special':
			if(papertree.redLights.isSpecial()){
				papertree.redLights.specialoff();
				papertree.greenLights.specialoff();
				papertree.blueLights.specialoff();
				papertree.purpleLights.specialoff();
				papertree.whiteLights.specialoff();
			}
			else
				servertree.special = true;	
	};
	servertree.SaveChanges();
};

// This gets the new position of an object given the current position and the old viewsize and new view size
function getnewpos(oldview, newview, current){
	return [(current.x / oldview.width) * newview.width, (current.y / oldview.height) * newview.height];
};


// Add Resize code
var oldViewSize = view.viewSize;
window.addEventListener("resize", function(){
	// Scale the big trees back to original
	tree1.scale(700 / oldViewSize.height);
	tree2.scale(700 / oldViewSize.height);
	tree3.scale(700 / oldViewSize.height);
	// devtree.scale(700 / oldViewSize.height);

	// Scale big trees to new 
	tree1.scale(view.viewSize.height / 700);
	tree2.scale(view.viewSize.height / 700);
	tree3.scale(view.viewSize.height / 700);
	// devtree.scale(view.viewSize.height / 700);

	// Reposition big trees
	tree1.position = view.bounds.center + [0,(view.viewSize.height / 1200) * 100];
	tree2.position = view.bounds.center + [0,(view.viewSize.height / 1200) * 100];
	tree3.position = view.bounds.center + [0,(view.viewSize.height / 1200) * 100];
	// devtree.position = view.bounds.center + [0,(view.viewSize.height / 1200) * 100];

	// Reposition the mini trees
	miniTony.position = getnewpos(oldViewSize, view.viewSize, miniTony.position);
	miniJinjin.position = getnewpos(oldViewSize, view.viewSize, miniJinjin.position);
	miniLunch.position = getnewpos(oldViewSize, view.viewSize, miniLunch.position);

	// Save new position to storage
	miniTony.onMouseUp({point: miniTony.position});
	miniJinjin.onMouseUp({point: miniJinjin.position});
	miniLunch.onMouseUp({point: miniLunch.position});

	// Set the old viewsize
	oldViewSize = view.viewSize;

});
