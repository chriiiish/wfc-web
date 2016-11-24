function ChristmasTreeController(serverHost, serverPort){
	if(serverHost == undefined || serverPort == undefined) throw "You must specify some variables, dude. ChristmasTreeController(serverhost, serverport)";
	if(typeof jQuery == "undefined" || typeof Paho == "undefined") throw "This requires jQuery and Paho.MQTT to run!";
	// Variable Delcaration
	var self = this;				// Store this object
	this.trees = [];				// All the christmas trees you want information for
	this.serverHost = serverHost;	// The websocket server host
	this.serverPort = serverPort;	// The websocket server port
	this.clientOptions = undefined; // The options for the websocket client
	this.client = undefined;		// The websocket client
	this.connected = undefined;		// Called when connected to the websocket server

	// Creates a new tree
	this.CreateTree = function(friendlyName, topicName){
		var tree = new Tree(friendlyName, topicName, self);
		self.trees.push(tree);
		return tree;
	}

	// Subscribe to MQTT topic/channel
	this.Subscribe = function(channelName){
		self.client.subscribe(channelName);
		var obj = { "status": "request" };

		var getStatus = new Paho.MQTT.Message(JSON.stringify(obj));
		getStatus.destinationName = channelName;
		self.client.send(getStatus);
	}

	// When a message is received from MQTT Server
	this.ReceiveMessage = function(message){
		self.trees.forEach(function(tree){
			if(tree.channelName == message.destinationName)
				tree.Update(message);
		});
	}

	// SET SOME THINGS UP!

	// Options for client connection
	this.clientOptions = {
		timeout: 3,
		onSuccess: function () {
			console.log("Connected to MQTT server successfully!");
			if(self.connected != undefined)
				self.connected();
		},
		onFailure: function (message) {
			console.log("Connection failed: " + message.errorMessage);
		}
	};

	// Connect to the client
	this.client = new Paho.MQTT.Client(self.serverHost, self.serverPort, "/", "web_client_" + parseInt(Math.random() * 10000, 10));
	this.client.onConnectionLost = function (responseObject) {
		console.log("MQTT connection lost: " + responseObject.errorMessage);
		console.log("Reconnecting");
		self.client.connect(self.clientOptions);
	};

	self.client.onMessageArrived = self.ReceiveMessage;

	self.client.connect(self.clientOptions);
}


// Represents a Christmas tree in the office
function Tree(friendlyName, topicName, parent){
	if(friendlyName == undefined || topicName == undefined || parent == undefined) throw "You must specify some variables, mate. Tree(friendlyName, topicName, christmasTreeController)";
	// Variable Declaration
	var self = this;					// Store this object
	this.friendlyName = friendlyName;	// The friendly name of the tree
	this.channelName = topicName;		// The topic it is subscribed to
	this.parent = parent;				// The Christmas tree controller this tree belongs to
	this.red = 0;						// Red LED brightness (0-255)
	this.green = 0;						// Green LED brightness (0-255)
	this.blue = 0;						// Blue LED brightness (0-255)
	this.purple = 0;					// Purple LED brightness (0-255)
	this.white = 0;						// White LED brightness (0-255)
	this.special = false;				// Doing special lighting display

	this.OnChanged = undefined;			// This method is the callback for when something on the tree changes

	// This sends data out to the tree
	this.SaveChanges = function(){
		var obj = {
			"status": "colour",
			"red": self.red,
			"green": self.green,
			"blue": self.blue,
			"purple": self.purple,
			"white": self.white,
			"special": self.special
		};
		var sending = new Paho.MQTT.Message(JSON.stringify(obj));
		sending.destinationName = self.channelName;
		self.parent.client.send(sending);
	}

	// This updates the local javascript object
	this.Update = function(message){
		console.log("Got colour update for " + self.friendlyName + " tree.");
		var obj = JSON.parse(message.payloadString);
		if("status" in obj && obj.status == "colour"){
			self.UpdateColours(obj);
		}
	}

	// This updates the tree information (called by Update)
	this.UpdateColours = function(data){
		self.red = data.red;
		self.green = data.green;
		self.blue = data.blue;
		self.purple = data.purple;
		self.white = data.white;
		self.special = data.special;
		if(typeof self.OnChanged != "undefined")
			self.OnChanged();
	}

	// On create - subscribe tree to MQTT server
	self.parent.Subscribe(self.channelName);
}