
function RootBrawl(gameAreaElement){
	console.log('rootbrawl constructor loaded');
	this.gameArea = $(gameAreaElement);
	this.gameID = null;
	this.model = null;
	this.chatHandler = null;
	this.gameState = {
		messages: []
	};

	this.sendMessage = function(message){
		if(!Array.isArray(this.gameState.messages)){
			this.gameState.messages = [];
		}
		this.gameState.messages.push(message);
		this.updateRemoteGameState();
	}
	this.receiveMessage = function(allMessages){
		this.chatHandler.receiveMessage(allMessages);
	}
	
	this.initialize = function(){
		this.createInitialGameID();
		this.attachClickHandlers();
		this.createChatHandler();
	}
	this.updateRemoteGameState = function(){
		this.model.saveState(this.gameState);
	}
	this.createChatHandler = function(){
		this.chatHandler = new Chat(this.sendMessage.bind(this),this.receiveMessage.bind(this));
		this.chatHandler.initialize('#communicationDisplay','#outboundMessageInput','#sendMessageButton');
	}
	this.handleChat
	this.attachClickHandlers = function(){
		$("#submitGameID").click(this.handleGameConnectClick.bind(this));
	}
	this.createInitialGameID = function(){
		$("#gameID").val(this.createRandomID());
	}
	this.initializeModel = function(){
		this.setGameID();
		this.model = new GenericFBModel(this.gameID,this.gameStateChangeHandler.bind(this));
	}
	this.createRandomID = function(stringLength){
		return 'danielpaschallearningfuzecom'; //TODO: temp fixed value, return to normal
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
	this.gameStateChangeHandler = function(data){
		//console.log('game state changed',data);
		if(data===null){
			this.updateRemoteGameState();
			return;
		}
		this.gameState = data;
		this.chatHandler.receiveMessage(data.messages);
	}
}

function Chat(sendHandler, receiveHandler){
	this.parentSendHandler = sendHandler;
	this.parentReceiveHandler = receiveHandler;
	this.outputElement = null;
	this.inputElement = null;
	this.sendElement = null;
	this.initialize = function(output,input,send){
		this.outputElement = $(output);
		this.inputElement = $(input);
		this.sendElement = $(send);
		this.attachHandlers();
	}
	this.attachHandlers = function(){
		this.sendElement.click(this.sendMessage.bind(this));
		this.inputElement.on('keypress',this.interceptReturnKey.bind(this))
	}
	this.interceptReturnKey = function(event){
		if(event.which===13){
			this.sendElement.click();
		}
	}
	this.scrollToBottom = function(){
		this.outputElement.scrollTop(this.outputElement[0].scrollHeight);
	}
	this.sendMessage = function(){
		var myMessage = this.inputElement.val();
		this.parentSendHandler(myMessage);
		this.outputElement.text(this.outputElement.text() + "\n" + myMessage);
		this.scrollToBottom();
	}
	this.receiveMessage = function(messages){
		this.outputElement.text(messages.join("\n"));
		this.scrollToBottom();

	}
}












