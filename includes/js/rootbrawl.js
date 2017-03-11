	
function RootBrawl(gameAreaElement){
	console.log('rootbrawl constructor loaded');
	this.gameArea = $(gameAreaElement);
	this.gameID = null;
	this.model = null;
	this.chatHandler = null;
	this.player = null;
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
		console.log(window.performance.now());
		this.createInitialGameID();
		console.log(window.performance.now());

		this.attachClickHandlers();
		this.createChatHandler();
		this.createPlayer();
	}
	this.updateRemoteGameState = function(){
		this.model.saveState(this.gameState);
	}
	this.createChatHandler = function(){
		this.chatHandler = new Chat(this.sendMessage.bind(this),this.receiveMessage.bind(this));
		this.chatHandler.initialize('#communicationDisplay','#outboundMessageInput','#sendMessageButton','#userName');
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
	this.createPlayer = function(){
		var player = new Player();
		var playerDomElement = player.createInterface(this.playerCreated.bind(this));
		this.player = player;
	}
	this.playerCreated = function(playerDomElement){
		this.gameArea.append(playerDomElement);
		this.player.addCards();
		this.player.addCards();
		this.player.addCards();
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


function Player(){
	this.name = null;
	this.id = 'player1';
	this.local = null;
	this.cards = {
		deck: [],
		hand: [],
		activeArea: [],
		graveyard: []
	};
	this.domElement = null;
	this.stats = {
		hitpoints : 30,
		manaTotal : 0,
		manaMax : 10,
		manaCurrent : 0,
		manaGainPerTurn : 1
	}
	this.addCards = function(){
		var cardDomElement = this.createCards(this.cards.activeArea);
		this.domElement.find('.playerActiveArea').append(cardDomElement);
	}
	this.createCards = function(destination){
		var card = new Card(this);
		var cardElement = card.createElement();
		destination.push(card);
		return cardElement;
	}
	this.createInterface = function(creationCallback){
		//this code 1
		var _this = this;
		$.ajax({
			url: 'includes/templates/playerView.html',
			dataType: 'text',
			method: 'get',
			success: function(data){
				//this code 3
				console.log(data);
				var container = $("<div>",{
					id: _this.id
				});
				container.append(data);
				_this.domElement = container;
				creationCallback(_this.domElement);
			}
		});
		//this code 2

	}
}

function Card(parentObject){
	this.image = 'images/IMG_6744.jpg';
	this.owner = parentObject;
	this.domElement = null;
	this.createElement = function(){
		this.domElement = $("<div>",{
			class: 'rootBrawlCard',
		}).css('background-image','url('+this.image+')');
		return this.domElement;
	}
}

function Deck(){

}











