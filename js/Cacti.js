(function(window){
	function Cacti(img){
		this.initialize(img);
	}
	Cacti.prototype = new createjs.Sprite();
	Cacti.prototype.tmp_initialize = Cacti.prototype.initialize;
	Cacti.prototype.initialize = function(img){
		var Sheet = new createjs.SpriteSheet({
			"images":[img],
			"frames":[
				[2,2,30,66],
				[36,2,64,66],
				[104,2,98,66],
				[208,2,46,96],
				[258,2,96,96],
				[358,2,146,96]
			],
			"animations":{
				s_1:0,
				s_2:1,
				s_3:2,
				l_1:3,
				l_2:4,
				l_3:5
			}
		});
		this.tmp_initialize(Sheet);
	}
	window.Cacti = Cacti;
}(window));