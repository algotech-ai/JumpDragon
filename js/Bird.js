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
		
		// 添加上下飞行的参数
		this.originalY = 0;  // 初始Y位置
		this.flyOffset = 0;  // 当前偏移量
		this.flyDirection = 1;  // 飞行方向（1向下，-1向上）
		this.flySpeed = 0.5;  // 飞行速度
		this.maxOffset = 10;  // 最大偏移量
		
		// 更新函数
		this.update = function() {
			// 更新飞行偏移量
			this.flyOffset += this.flySpeed * this.flyDirection;
			
			// 检查是否需要改变方向
			if (Math.abs(this.flyOffset) >= this.maxOffset) {
				this.flyDirection *= -1;
			}
			
			// 更新实际位置
			this.y = this.originalY + this.flyOffset;
		};
	}
	window.Bird = Bird;
}(window));