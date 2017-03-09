
$(document).ready(function(){
	//$.getScript('includes/js/rootbrawl.js',initialize);
	initialize();
});
var app;
function initialize(){
	app = new RootBrawl('#gameArea');
	app.initialize();
}