	
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
		this.player.createHand();
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
		hand: null,
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
		this.cardHolders.deck = new Deck('player deck');
		this.cardHolders.deck.load(this.cardLibrary);
		var deckDomElement = this.cardHolders.deck.createElement();
		this.playerAreas.deck.append(deckDomElement);
		this.cardHolders.deck.revealedByDefault = false;
	}
	this.createHand = function(){
		this.cardHolders.hand = new Deck('player hand');
		var handDeckDomElement = this.cardHolders.hand.createElement();
		this.playerAreas.hand.append(handDeckDomElement);
		this.cardHolders.hand.draggable = true;
		this.cardHolders.hand.revealedByDefault = true;
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
				var container = $("<div>",{
					id: _this.id
				});
				container.append(data);
				_this.domElement = container;
				_this.getDomReferences();
				creationCallback(_this.domElement);
				//TODO: this is a temporary button for testing
				_this.prepInterface();
			}
		});
		//this code 2

	}
	this.prepInterface = function(){
		$("#dealCards").click(()=>{
			this.cardHolders.deck.dealCard(this.cardHolders.hand);
		});
		this.playerAreas.active.droppable({
			drop: (event, references)=>{
				var index = references.draggable.attr('index');
				var card = references.helper[0].card;
				card.becomeActive();
			},
			accept: '.rootBrawlCard'
		})
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
	this.domFront = null;
	this.domBack = null;
	this.parent = parentObject;
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
	this.becomeActive = function(){
		console.log('ROAAAAAARR ahem... errr... I\'m alive');
		this.domElement.css('transform','rotateZ(45deg)');
	}
	this.makeDraggable = function(){
		var _this = this;
		this.domElement.draggable({
			revert: 'invalid',
			start: (p1, reference)=>{
				console.log(reference);
				reference.helper[0].originalObject = _this;
				//p2.position.theObject = _this;
				reference.helper.attr('index',this.parent.cardStack.indexOf(this));

				//debugger;
			},
			stop: (p1, reference)=>{
				console.log(this.parent);
			}
		});
	}
	this.moveCard = function(destinationDeck){
		var offset = this.domElement.offset();
		var currentHeight = this.domElement.height();
		var currentWidth = this.domElement.width();
		this.domElement.css({
			height: currentHeight+'px',
			width: currentWidth + 'px'
		});
		var animationCard = this.domElement.clone();
		//TODO: fix this animation
		animationCard.css({
			'z-index':100,
			position: 'fixed',
			top: offset.top + 'px',
			left: offset.left + 'px'
		});
		destinationDeck.domElement.append(animationCard);
		destinationDeck.domElement.append(this.domElement);
		//this.domElement.css('opacity',0);
		var destinationOffset = this.domElement.offset();
		animationCard.animate({
			left: destinationOffset.left +'px',
			top: destinationOffset.top +'px'
		},1000, function(){
			$(this).remove()
		})

	}
	this.setVisibilityState = function(newState){
		if(newState==='show'){
			this.domBack.hide();
		} else {
			this.domBack.show();
		}
	}
	this.createElement = function(){
		this.domElement = $("<div>",{
			class: 'rootBrawlCard',
		});
		this.domFront = $("<div>",{
			class: 'front'
		}).css('background-image','url('+this.image+')');
		this.domBack = $("<div>",{
			class: 'back'
		}).css('background-image','url('+this.backfaceImageValue+')');
		this.domElement.append(this.domFront,this.domBack);
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

function Deck(name){
	this.name = name;
	this.cardStack = [];
	this.domElement = null;
	this.draggableValue = false;
	this.revealedByDefaultValue = true;
	Object.defineProperties(this,{
		revealedByDefault : {
			get: function(){
				return this.revealedByDefaultValue;
			},
			set: function(newValue){
				this.revealedByDefaultValue = newValue;
				if(this.revealedByDefaultValue){
					this.revealAllCards();
				} else {
					this.hideAllCards();
				}
				console.log('update the cards now');
			}
		},
		draggable: {
			get: function(){
				return this.draggableValue;
			},
			set: function(newValue){
				if(newValue){
					this.instantiateDrag();
				}
				this.draggableValue = newValue;
			}
		}
	});
	this.revealAllCards = function(){
		this.setCardState('show');
	}
	this.hideAllCards = function(){
		this.setCardState('hide');
	}
	this.setCardState = function(state){
		this.cardStack.map((card)=>{
			card.setVisibilityState(state);
		});
	}
	this.instantiateDrag = function(){
		console.log('here',this);
		for(var i=0; i<this.cardStack.length; i++){
			this.cardStack[i].makeDraggable();
		}
	}
	this.createElement = function(){
		var deck = $("<div>",{
			class: 'deck'
		});
		this.domElement = deck;
		if(this.cardStack.length>0){
			this.showCard(this.cardStack[this.cardStack.length-1]);
		}
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
	this.showCard = function(cardToShow){
		this.domElement.append(cardToShow.domElement);
	}
	this.getTopCard = function(){
		var cardToGet = this.cardStack.pop();
		this.showCard(this.cardStack[this.cardStack.length-1]);
		return cardToGet;
	}
	this.dealCard = function(receivingDeck,card){
		if(card === undefined){
			card = this.getTopCard();
		}
		this.animateDeal(receivingDeck,card);
		if(card !== undefined){
			receivingDeck.receiveCard(this, card);
		} else {
			console.warn('no more cards available');
		}
	}
	this.animateDeal = function(dealingDeck, card){
		card.moveCard(dealingDeck);
	}
	this.receiveCard = function(dealingDeck, card){

		this.cardStack.push(card);
		if(this.revealedByDefault){
			card.setVisibilityState('show');
		}
		if(this.draggable){
			card.makeDraggable();
		}
		card.parent = this;
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










