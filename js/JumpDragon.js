var KEYCODE_SPACE = 32;    
var KEYCODE_UP = 38;
var KEYCODE_DOWN = 40;
var KEYCODE_W = 87;
var KEYCODE_S = 83;
var KEYCODE_J = 74;
// var KEYDOWN_SPACE = KEYDOWN_UP = KEYDOWN_DOWN = false;
var CMD_jump = false;
var CMD_bend = false;
var stageEventListener = {
    "mousedown":false,
    "pressmove":false,
    "startY":0,
    "endY":0
}
var stage = new createjs.Stage("canvas");
createjs.Touch.enable(stage);
var loader;
var dragon;
var text;
var GameOverContainer;
var setTO_sendObstacle;
var obstacleArray = [];
var cactisize = ["s_1","s_2","s_3","l_1","l_2","l_3"];
var IsGameOver = false;
var willRefreshGameParams = false;
var GameParamsInit = function() {
    this.width= stage.canvas.width;
    this.height= stage.canvas.height;
    this.gravity= 1.2;
    this.jumpVelocity= 25;
    this.groundHeight= 400;
    this.groundInsert=24;
    this.velocity=12;
    this.level=1;
    this.dragonX=100;
};
var GameParams = new GameParamsInit();
init();
function init(){	
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
	loader = new createjs.LoadQueue(true);
    loader.on("progress", handleLoadProgress);
	loader.on("complete", handleLoadComplete);
	loader.loadManifest(loadManifest,true,"./img/");
}
function handleSoundLoaded(){
}
function handleLoadProgress(e){
    console.log(e.progress);
}
function handleLoadComplete(){
	startGame();
}

function startGame(){
    document.addEventListener('keydown',function(e){
        handleKeyDown(e);
    });
    document.addEventListener('keyup',function(e){
        handleKeyUp(e);
    });
    stage.addEventListener("stagemousedown",function(e){
        stageEventListener.mousedown = true;
        stageEventListener.startY = e.localY;
    });
    stage.addEventListener("stagemousemove",function(e){
        if(stageEventListener.mousedown&&!IsGameOver){
            stageEventListener.pressmove = true;
            stageEventListener.endY = e.localY;
            console.log(stageEventListener.endY, stageEventListener.startY)
            if(stageEventListener.endY>stageEventListener.startY+0.5){
                CMD_bend = true;
                CMD_jump = false;
            }
            else if (stageEventListener.endY < stageEventListener.startY-0.5){
                CMD_jump = true;
                CMD_bend = false;
            }
        }
    });
    stage.addEventListener("stagemouseup",function(){
        stageEventListener.mousedown = false;
        CMD_bend = false;
        CMD_jump = false;
    });
	dragon = new Dragon(loader.getResult("dragon"));
    createGrade();
    gradeContainer.startGradeUpdate();
    createBackground();
    sendObstacle();
    stage.addChild(dragon,text); 
	createjs.Ticker.addEventListener("tick",tick);
    createjs.Ticker.setFPS(60);
}
function overGame(){
    IsGameOver = true;
    clearTimeout(setTO_sendObstacle);
    dragon.gotoAndPlay("dead");
    stage.update();
    if(gradeContainer.getChildByName("GRADE").number>gradeContainer.getChildByName("HI_GRADE").number){
        gradeContainer.recordNewHightGrade();
    }
    showGameOverPanel();
    (typeof window.orientation !== 'undefined')&&(document.title="我在JumpDragon里跑了"+gradeContainer.getChildByName("GRADE").number+"分，最高"+gradeContainer.getChildByName("HI_GRADE").number+"分，敢来挑战吗？");
}
function restartGame(){
    // debugger;
    GameOverContainer.visible = false;
    IsGameOver = false;
    GameParams = new GameParamsInit(); 
    for( var i = 0; i< obstacleArray.length; i++){
        stage.removeChild(obstacleArray[i]);
    }
    obstacleArray = [];
    gradeContainer.startGradeUpdate(true);
    sendObstacle();
    dragon.init();
}
function showGameOverPanel(){
    if(!GameOverContainer){
        GameOverContainer = new createjs.Container();
        var label_gameover = new createjs.Bitmap(loader.getResult("label_gameover"));
        var restart = new createjs.Bitmap(loader.getResult("restart"));
        GameOverContainer.addChild(label_gameover,restart);
        GameOverContainer.visible = false;
        label_gameover.x = (GameParams.width-label_gameover.getBounds().width)/2;
        label_gameover.y = 180;
        restart.x = (GameParams.width-restart.getBounds().width)/2;
        restart.y = 260;

        restart.on("mousedown",function(){
            restartGame();
        });
        
        stage.addChild(GameOverContainer);
        stage.update();
    }
    GameOverContainer.visible = true;
}
function tick(){
    if(!IsGameOver){
        stage.update();
        dragon.update();
        for(var i=0;i<obstacleArray.length;i++){
            obstacleArray[i].x -= GameParams.velocity;
            if(obstacleArray[i] instanceof Bird) {
                obstacleArray[i].update();  // 更新鸟的位置
            }
            if(obstacleArray[i].x<-obstacleArray[i].getBounds().width){
                stage.removeChild(obstacleArray[i]);
                obstacleArray.splice(i,1);
                i--;
            }
        }
        checkCollision();
    }
}
function refreshGameParams(){
    GameParams.level ++;
    setGameDiffi(GameParams.level);
    willRefreshGameParams = false;
}
function handleKeyDown(e) {
    if (!e) { var e = window.event; }
    switch (e.keyCode) {
    	case KEYCODE_SPACE:
        	CMD_jump = true;
        	break;
        case KEYCODE_UP:
        	CMD_jump = true;
        	break;
        case KEYCODE_W:
            CMD_jump = true;
            break;
        case KEYCODE_J:
            CMD_jump = true;
            break;
        case KEYCODE_DOWN:
            CMD_bend = true;
            break;
        case KEYCODE_S:
            CMD_bend = true;
            break;
    }
}
function handleKeyUp(e){
	if (!e) { var e = window.event; }
    switch (e.keyCode) {
        case KEYCODE_SPACE:
            CMD_jump = false;
            break;
        case KEYCODE_UP:
            CMD_jump = false;
            break;
        case KEYCODE_W:
            CMD_jump = false;
            break;
        case KEYCODE_J:
            CMD_jump = false;
            break;
        case KEYCODE_DOWN:
            CMD_bend = false;
            break;
        case KEYCODE_S:
            CMD_bend = false;
            break;
    }
}

function sendObstacle(){
        var time = Math.floor(1200*Math.random()+600);
        var obstacle;
        if(GameParams.level<5){
            obstacle = createCacti();
        }
        else{
            var _subvalue = GameParams.level - 4;
            _subvalue = _subvalue>4?5:_subvalue;
            if(_subvalue>10*Math.random()){
                obstacle = createBird();
            }
            else{
                obstacle = createCacti();
            }
        }
        setTO_sendObstacle = setTimeout(function(){
            obstacleArray.push(obstacle);
            stage.addChild(obstacle);
            stage.setChildIndex(obstacle,2);
            sendObstacle();
        },time);
}
function checkCollision(){
    for( var i = 0; i < obstacleArray.length; i++){
        obstacleArray[i].x -= GameParams.velocity;
        if(obstacleArray[i].x<(GameParams.dragonX+90)&&ndgmr.checkPixelCollision(dragon,obstacleArray[i])){
            overGame();
        }
    }
    if(obstacleArray[0]&&obstacleArray[0].x+obstacleArray[0].getBounds().width<0){
        stage.removeChild(obstacleArray[0]);
        obstacleArray.splice(0,1);
    }
}
function Random(min,max){
    return Math.floor(Math.random()*(max-min+1))+min;
}
function createCacti(){
    var cacti = new Cacti(loader.getResult("cacti"));
    cacti.gotoAndPlay(cactisize[Random(0,5)]);
    cacti.y = GameParams.groundHeight-cacti.getBounds().height+GameParams.groundInsert;
    cacti.x = GameParams.width;
    return cacti;
}
function createBird(){
    var bird = new Bird(loader.getResult("bird"));
    bird.originalY = GameParams.groundHeight-bird.getBounds().height-40*Random(0,2);
    bird.y = bird.originalY;
    bird.x = GameParams.width;
    return bird;
}
function setGameDiffi(level){
    GameParams.velocity = 11 + level;
}


