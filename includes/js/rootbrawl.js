
function RootBrawl(gameAreaElement){
	console.log('rootbrawl constructor loaded');
	this.gameArea = $(gameAreaElement);
	this.gameID = null;
	this.initialize = function(){
		this.createInitialGameID();
		this.attachClickHandlers();
	}
	this.attachClickHandlers = function(){
		$("#submitGameID").click(this.handleGameConnectClick.bind(this));
	}
	this.createInitialGameID = function(){
		$("#gameID").val(this.createRandomID());
	}
	this.initializeModel = function(){
		this.setGameID();
		var connect4Model = new GenericFBModel(this.gameID,this.gameStateChangeHandler);
	}
	this.createRandomID = function(stringLength){
		stringLength = stringLength || 20;
		var output = '';
		var sourceChars = 'abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
		for(var i=0; i<stringLength; i++){
			output+= sourceChars[this.getRandomNumber(0,sourceChars.length)];
		}
		return output;
	}
	this.handleGameConnectClick = function(){
		console.log('connecting to db');
		this.setGameID();
		this.initializeModel();
	}
	this.setGameID = function(){
		this.gameID = $("#gameID").val();
	}
	this.getRandomNumber = function(minOrArray,maxOrReturnIndex){
		if(Array.isArray(min)){
			var array = min;
			max = array.length;
			if(maxOrReturnIndex || true){
				return (Math.floor(Math.random()*max));
			}
			return array[Math.floor(Math.random()*max)];
		} else {
			var min = minOrArray;
			var max = maxOrReturnIndex;
		}
		return (Math.floor(Math.random()*(max-min))+min);
	}
	this.createPlayers = function(){

	}
	this.gameStateChangeHandler = function(){

	}
}