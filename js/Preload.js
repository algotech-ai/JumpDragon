(function(){
	var loadManifest = [
		{"src": "dragon.png", "id":"dragon"},
        {"src": "ground.png", "id":"ground"},
        {"src": "cloud.png", "id":"cloud"},
        {"src": "cacti.png", "id":"cacti"},
        {"src": "bird.png", "id":"bird"},
        {"src": "character.png", "id":"character"},
        {"src": "label_gameover.png", "id":"label_gameover"},
        {"src": "restart.png", "id":"restart"}
	];
	var Preload = function () {
        this.initialize();
    };
    var p = Preload.prototype = new createjs.EventDispatcher();
    p.EventDispatcher_initialize = p.initialize;

    p.initialize = function(){
    	this.EventDispatcher_initialize();
    };
}());