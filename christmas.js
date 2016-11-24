function ChristmasTreeController(devMode){
	var tree = {

	}
	var me = this;
	this._trees = ['tree1','tree2','tree3'];
	this._devtree = ['devtree'];
	this._issetup = false;
	this._client = undefined;
	this._clientOptions = {
      timeout: 3,
      onSuccess: function () {
        console.log("mqtt connected");  
      },
      onFailure: function (message) {
        console.log("Connection failed: " + message.errorMessage);
      }
    };

	// Should be set on the outside

	// Callback functions - when a colour change it detected for the tree
	// Parameters should be (red=int, green=int, blue=int, purple=int, white=int, special=bool)
	this.tree1_callback = undefined;
	this.tree2_callback = undefined;
	this.tree3_callback = undefined;
	this.devtree_callback = undefined;

	// Parameters should be (responseObject)
	this.onConnectionLost = undefined;

	// This sends out an update to the tree with the colours requested
	// Params::
	// 		treename - string - the name of the tree to send it to
	//		red - int - 0-255 how bright red should be
	//		green - int - 0-255 how bright green should be
	//		blue - int - 0-255 how bright blue should be
	//		purple - int - 0-255 how bright purple should be
	//		white - int - 0-255 how bright white should be
	// 		special - bool - show the special colour pattern
	this.update = function(treename, red, green, blue, purple, white, special){
		if(!this._issetup) throw "Please call init()";
	}

	this._receive = function(message){
		var teehee = 1;
	}

	// This initialises the Christmas Tree Controller
	// Params::
	//		mqttServerAddress - string - the address of the MQTT server
	//		mqttServerPort - int - the port number of the MQTT server (websockets)
	this.init = function(mqttServerAddress, mqttServerPort){
		if(typeof mqttServerAddress == "undefined" || typeof mqttServerPort == "undefined")
			throw "Must specify the MQTT server + port :: init(server,port)";

		if(typeof Paho == "undefined") throw "Must include Paho js";

		if(typeof jQuery == "undefined") throw "Must include jQuery";

		this._client = new Paho.MQTT.Client(mqttServerAddress, mqttServerPort, "/", "web_client_" + parseInt(Math.random() * 10000, 10));

		this._client.onConnectionLost = function (responseObject) {
			console.log("MQTT connection lost: " + responseObject.errorMessage);
			if(typeof this.onConnectionLost != "undefined") this.onConnectionLost(responseObject);
		};

		this._client.onMessageArrived = this._receive;

		this._client.connect(this._clientOptions);

	}

}