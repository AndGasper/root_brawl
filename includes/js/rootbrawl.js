	
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
		this.player.createDeck(deckStats);
		//TODO: get deckStats from a parameter or load through a property

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
	this.cardLibrary = null;
	this.playerAreas = {
		deck: null,
		hand: null,
		active: null
	}
	this.cardHolders = {
		deck: null,
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
	this.createDeck = function(playerCardLibrary){
		this.cardLibrary = playerCardLibrary;
		this.cardHolders.deck = new Deck();
		this.cardHolders.deck.load(this.cardLibrary);
		var deckDomElement = this.cardHolders.deck.createElement();
		this.playerAreas.deck.append(deckDomElement);
	}
	this.createCards = function(destination){
		var card = new Card(this);
		var cardElement = card.createElement();
		destination.push(card);
		return cardElement;
	}
	this.getDomReferences = function(){
		this.playerAreas.deck = this.domElement.find('.playerDeck');
		this.playerAreas.hand = this.domElement.find('.playerHand');
		this.playerAreas.active = this.domElement.find('.playerActiveArea');
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
				_this.getDomReferences();
				creationCallback(_this.domElement);
			}
		});
		//this code 2

	}
}

function Card(parentObject){
	this.image = null;
	this.backfaceImageValue = 'images/cardBack.png';
	this.owner = parentObject;
	this.name = '';
	this.facing = 'back';
	this.baseID = null;
	this.baseSeries = null;
	this.domElement = null;
	this.attackValue = null;
	this.defenseValue = null;
	this.handleAttack = null
	this.handleDefend = null;
	this.handleCreate = null;
	this.handleDeath = null;
	this.init = function(options){
		this.attackValue = options.attack;
		this.defenseValue = options.defense;
		this.name = options.name;
		this.image = options.image;
		this.baseID = options.id;
		this.baseSeries = options.series;
		this.handleAttack = options.onAttack;
		this.handleDefend = options.onDefend;
		this.handleCreate = options.onCreated;
		this.handleDeath = options.onDeath;
	}
	Object.defineProperties(this,{
		
	});
	this.createElement = function(){
		this.domElement = $("<div>",{
			class: 'rootBrawlCard',
		});
		var front = $("<div>",{
			class: 'front'
		}).css('background-image','url('+this.image+')');
		var back = $("<div>",{
			class: 'back'
		}).css('background-image','url('+this.backfaceImageValue+')');
		this.domElement.append(front,back);
		return this.domElement;
	}
	this.create = function(){

	}
	this.die = function(){

	}
	this.attack = function(){

	}
	this.defend = function(){

	}
}

function Deck(){
	this.cardStack = [];
	this.domElement = null;
	this.createElement = function(){
		var deck = $("<div>",{
			class: 'deck'
		});
		debugger;
		this.domElement = deck;
		this.domElement.append(this.cardStack[0].domElement);
		return deck;
	}
	this.load = function(cardOptions){
		for(var i=0; i<cardOptions.length; i++){
			var card = new Card(this);
			this.cardStack.push(card);
			card.init(cardOptions[i]);
			card.createElement();
		}
		
	}
	
}
//this is a template for a card
var baseCardObject = {
		image: '',
		name: '',
		id: 0,
		series: 0,
		attack: 0,
		defense: 0,
		onAttack: function(){
			console.log('I am attacking');
		},
		onDefend: function(){
			console.log('I am defending');
		},
		onCreated: function(){
			console.log('I am created')
		},
		onDeath: function(){
			console.log('I am dead');
		}
}

var deckStats = [
	{
		id: 0,
		series: 0,
		image: 'images/IMG_6744.jpg',
		name: 'Andres the distracted',
		attack: 1,
		defense: 5,
		onAttack: function(){
			console.log('I am attacking');
		},
		onDefend: function(){
			console.log('I am defending');
		},
		onCreated: function(){
			console.log('I am created')
		},
		onDeath: function(){
			console.log('I am dead');
		}
	},
	{
		id: 1,
		series: 0,
		image: 'images/A81U9826.jpg',
		name: 'Donald the Voluntolding',
		attack: 5,
		defense: 1,
		onAttack: function(){
			console.log('I am attacking');
		},
		onDefend: function(){
			console.log('I am defending');
		},
		onCreated: function(){
			console.log('I am created')
		},
		onDeath: function(){
			console.log('I am dead');
		}
	},
	{
		id: 2,
		series: 0,
		image: 'images/A81U9828.jpg',
		name: 'Ryan the tired',
		attack: 0,
		defense: 10,
		onAttack: function(){
			console.log('I am attacking');
		},
		onDefend: function(){
			console.log('I am defending');
		},
		onCreated: function(){
			console.log('I am created')
		},
		onDeath: function(){
			console.log('I am dead');
		}
	},
	{
		id: 3,
		series: 0,
		image: 'images/A81U9827.jpg',
		name: 'Miranda says "wattah!"',
		attack: 5,
		defense: 1,
		onAttack: function(){
			console.log('I am attacking');
		},
		onDefend: function(){
			console.log('I am defending');
		},
		onCreated: function(){
			console.log('I am created')
		},
		onDeath: function(){
			console.log('I am dead');
		}
	}
];










