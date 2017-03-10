
function Chat(sendHandler, receiveHandler){
	this.parentSendHandler = sendHandler;
	this.parentReceiveHandler = receiveHandler;
	this.outputElement = null;
	this.inputElement = null;
	this.sendElement = null;
	this.nameElement = null;
	this.chatterName = 'Some Dumbass' + Math.floor(Math.random()*1000000);
	this.initialize = function(output,input,send,name){
		this.outputElement = $(output);
		this.inputElement = $(input);
		this.sendElement = $(send);
		this.nameElement = $(name);
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
	this.clearInputElement = function(){
		this.inputElement.val('');
	}
	this.sendMessage = function(){
		if(this.nameElement.val() !== ''){
			this.chatterName = this.nameElement.val();
			this.nameElement.remove();
		}
		var myMessage = this.inputElement.val();
		if(myMessage===''){
			return;
		}
		this.parentSendHandler(this.chatterName + ' : ' + myMessage);
		this.outputElement.text(this.outputElement.text() + "\n" + this.chatterName + " : " + myMessage);
		this.scrollToBottom();
		this.clearInputElement();
	}
	this.receiveMessage = function(messages){
		this.outputElement.text(messages.join("\n"));
		this.scrollToBottom();

	}
}

