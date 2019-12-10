var stage, runApp, loader, bmpAnimation;

init();
function init(){
	
	runApp = {
		"w": 300,
		"h": 150
	};
	loader = new createjs.LoadQueue(true);
	loader.addEventListener("complete", handleComplete);
	loader.loadManifest([
		{"src": "MonsterA.png", "id":"monsterA"},
		{"src": "MonsterB.png", "id":"monsterB"},
		{"src": "MonsterC.png", "id":"monsterC"},
		{"src": "MonsterD.png", "id":"monsterD"},
		{"src": "BlockA0.png", "id":"blockA0"}
		],true,"./img/");
}
function handleComplete(){
	//here define stage Object
	stage = new createjs.Stage("canvas");
	var spriteSheet = new createjs.SpriteSheet({
		"images": [loader.getResult("monster1")],
		"frames": {
			"width": 64,
			"height": 64,
			"regX": 32,
			"regY": 32
		},
		"animations": {
			"walk": [0,9,"walk",0.25]
		}
	});
	var spriteSheetIdle = new createjs.SpriteSheet({
		"images": [loader.getResult("monster2")],
		"frames": {
			"width": 64,
			"height": 64,
			"regX": 32,
			"regY": 32
		},
		"animations": {
			"idle": [0,10,"idle",0.25]
		}
	});
	createjs.SpriteSheetUtils.addFlippedFrames(spriteSheet, true, false, false);
	bmpAnimation = new createjs.Sprite(spriteSheet);

	bmpAnimation.regX = bmpAnimation.spriteSheet.frameWidth/2|0;
	bmpAnimation.regY = bmpAnimation.spriteSheet.frameHeight/2|0;
	bmpAnimation.x = 16;
	bmpAnimation.vX = 1;
	bmpAnimation.y = 32;

	bmpAnimationIdle = new createjs.Sprite(spriteSheetIdle);
	bmpAnimationIdle.x = 16;bmpAnimationIdle.y = 32;

	bmpAnimation.direction = 90;
	bmpAnimation.currentFrame = 0;

	bmpAnimation.gotoAndPlay("walk_h");
	stage.addChild(bmpAnimation);
	// createjs.Ticker.timingMode = createjs.Ticker.RAF;
	createjs.Ticker.useRAF = true;
	createjs.Ticker.setFPS(60);
	createjs.Ticker.addEventListener("tick",tick);
}

function tick(){
	if (bmpAnimation.x >= runApp.w - 16) {
        bmpAnimation.direction = -90;
        bmpAnimation.gotoAndPlay("walk");
    }

    if (bmpAnimation.x < 16) {
        bmpAnimation.direction = 90;
        bmpAnimation.gotoAndStop("walk");
        stage.removeChild(bmpAnimation);
        bmpAnimationIdle.gotoAndPlay("idle");
        stage.addChild(bmpAnimationIdle);
    }

    if (bmpAnimation.direction == 90) {
        bmpAnimation.x += bmpAnimation.vX;
    }
    else {
        bmpAnimation.x -= bmpAnimation.vX;
    }
	stage.update();
}













