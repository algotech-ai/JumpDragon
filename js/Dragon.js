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
		var isJump = false;
		this.init = function(){
			this.y = this.initY;
			this.x = GameParams.dragonX;
			this.vy = 0;
		};
		this.jump = function(){
			this.vy = -GameParams.jumpVelocity;
			this.gotoAndPlay("idle");
			isJump = true;
		};
		this.update = function(){
			this.y += this.vy;
			if(this.y<this.initY){
				this.vy += GameParams.gravity;
			}
			else{
				this.vy = 0;
				this.y = this.initY;
				isJump = false;
			}
			if((CMD_jump)&&!isJump){
				this.jump();
			}
			else if(CMD_bend&&!isJump){
				this.currentAnimation!="bend"&&this.gotoAndPlay("bend");
			}
			else if(CMD_bend){
				this.vy = GameParams.jumpVelocity*0.8;
			}
			else{
				this.currentAnimation!="run"&&!isJump&&this.gotoAndPlay("run");
			}
		};
		this.init();
		this.gotoAndPlay("run");
	};
	window.Dragon = Dragon;
}(window));