(function(window){
	function Dragon(img){
		this.initialize(img);
	}

	Dragon.prototype = new createjs.Sprite();
	Dragon.prototype.tmp_initialize = Dragon.prototype.initialize;
	Dragon.prototype.initialize = function(img){
		var dragonSheet = new createjs.SpriteSheet({
			"images": [img],
			"frames": [
				[2,2,84,90],
				[90,2,84,90],
				[178,2,84,90],
				[266,2,84,90],
				[354,2,84,90],
				[442,2,84,90],
				[530,2,114,90],
				[648,2,114,90]
			],
			"animations":{
				idle: 0,
	      blink: [0,1,"idle",0.2],
				run: {
          frames:[2,3],
          speed: 0.2
        },
        bend:{
        	frames:[6,7],
        	speed: 0.2
        },
        dead:5
			}
		});
		this.tmp_initialize(dragonSheet);
		// var blur = new createjs.BlurFilter(0,5,1);
		// this.filters = [blur];
		// this.cache(0,0,this.getBounds().width,this.getBounds().height);
		this.initY = GameParams.groundHeight-this.getBounds().height+GameParams.groundInsert;
		this.isJump = false;
		this.canDoubleJump = true;  // 是否可以二次跳跃
		this.jumpPressed = false;   // 记录跳跃键是否被按下
		this.init = function(){
			this.y = this.initY;
			this.x = GameParams.dragonX;
			this.vy = 0;
			this.isJump = false;
			this.canDoubleJump = true;  // 重置二次跳跃状态
			this.jumpPressed = false;   // 重置跳跃键状态
		};
		this.jump = function(isDoubleJump = false){
			if (!isDoubleJump) {
				this.vy = -GameParams.jumpVelocity * 0.8;  // 降低第一次跳跃的高度
				this.gotoAndPlay("idle");
				this.isJump = true;
				this.canDoubleJump = true;  // 允许二次跳跃
			} else if (this.canDoubleJump) {
				this.vy = -GameParams.jumpVelocity * 0.7;  // 二次跳跃高度为第一次的70%
				this.canDoubleJump = false;  // 使用掉二次跳跃机会
			}
		};
		this.update = function(){
			this.y += this.vy;
			if(this.y<this.initY){
				this.vy += GameParams.gravity;
			}
			else{
				this.vy = 0;
				this.y = this.initY;
				this.isJump = false;
				this.canDoubleJump = true;  // 落地后重置二次跳跃
			}
			
			// 处理跳跃输入
			if(CMD_jump && !this.jumpPressed) {  // 只在按键按下时触发
				this.jumpPressed = true;  // 标记按键已按下
				if(!this.isJump){
					this.jump(false);  // 第一次跳跃
				} else if (this.canDoubleJump) {
					this.jump(true);  // 二次跳跃
				}
			} else if (!CMD_jump) {
				this.jumpPressed = false;  // 按键释放时重置状态
			}
			
			if(CMD_bend&&!this.isJump){
				this.currentAnimation!="bend"&&this.gotoAndPlay("bend");
			}
			else if(CMD_bend){
				this.vy = GameParams.jumpVelocity*0.8;
			}
			else{
				this.currentAnimation!="run"&&!this.isJump&&this.gotoAndPlay("run");
			}
		};
		this.init();
		this.gotoAndPlay("run");
	};
	window.Dragon = Dragon;
}(window));