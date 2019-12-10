(function(window){
	function Bird(img){
		this.initialize(img);
	}
	Bird.prototype = new createjs.Sprite();
	Bird.prototype.tmp_initialize = Bird.prototype.initialize;
	Bird.prototype.initialize = function(img){
		var Sheet = new createjs.SpriteSheet({
			"images":[img],
			"frames":[
				[2,2,88,75],
				[94,2,88,75]
			],
			"animations":{
				fly: {
					frames: [0,1],
					speed: 0.15
				}
			}
		});
		this.tmp_initialize(Sheet);
		this.gotoAndPlay("fly");
	}
	window.Bird = Bird;
}(window));