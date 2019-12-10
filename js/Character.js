(function(window){
	function Char(string){
		this.initialize(string);
	}
	Char.prototype = new createjs.BitmapText();
	Char.prototype.initialize = function(string){
		var Sheet = new createjs.SpriteSheet({
			"images":[loader.getResult("character")],
			"frames":{width:20, height:21},
			"animations":{
				"0":0,
				"1":1,
				"2":2,
				"3":3,
				"4":4,
				"5":5,
				"6":6,
				"7":7,
				"8":8,
				"9":9,
				"H":10,
				"I":11
			}
		});
		this.text = string;
		this.spriteSheet = Sheet;
	}
	window.Char = Char;
}(window));