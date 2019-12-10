var imgMonsterARun = new Image();

var stage;
var bmpAnimation;
var runApp = {
		"w": 300,
		"h": 150
	};
init();
function init() {
    //find canvas and load images, wait for last image to load
    imgMonsterARun.onload = handleImageLoad;
    imgMonsterARun.src = "img/MonsterARun.png";
}

function handleImageLoad(){
	stage= new createjs.Stage("canvas");
	// create spritesheet and assign the associated data.
	var spriteSheet = new createjs.SpriteSheet({
	    // image to use
	    "images": [imgMonsterARun], 
	    // width, height & registration point of each sprite
	    "frames": {"width": 64, "height": 64, "regX": 32, "regY": 32}, 
	    "animations": {    
	        "walk": [0, 9, "walk"]
	    }
	});
	// create a BitmapAnimation instance to display and play back the sprite sheet:
	bmpAnimation = new createjs.Sprite(spriteSheet);

	// start playing the first sequence:
	bmpAnimation.gotoAndPlay("walk");     //animate
	    
	// set up a shadow. Note that shadows are ridiculously expensive. You could display hundreds
	// of animated rats if you disabled the shadow.

	bmpAnimation.name = "monster1";
	bmpAnimation.direction = 90;
	bmpAnimation.vX = 4;
	bmpAnimation.x = 16;
	bmpAnimation.y = 32;
	        
	// have each monster start at a specific frame
	bmpAnimation.currentFrame = 0;
	stage.addChild(bmpAnimation);

	createjs.Ticker.addEventListener("tick",tick);
	createjs.Ticker.useRAF = true;
	// Best Framerate targeted (60 FPS)
	createjs.Ticker.setFPS(60);
}



function tick() {
    // Hit testing the screen width, otherwise our sprite would disappear
    if (bmpAnimation.x >= runApp.width - 16) {
        // We've reached the right side of our screen
        // We need to walk left now to go back to our initial position
        bmpAnimation.direction = -90;
    }

    if (bmpAnimation.x < 16) {
        // We've reached the left side of our screen
        // We need to walk right now
        bmpAnimation.direction = 90;
    }

    // Moving the sprite based on the direction & the speed
    if (bmpAnimation.direction == 90) {
        bmpAnimation.x += bmpAnimation.vX;
    }
    else {
        bmpAnimation.x -= bmpAnimation.vX;
    }
    // update the stage:
    stage.update();
}
