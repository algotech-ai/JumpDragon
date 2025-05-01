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
    this.velocity=8;
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
    
    // 先添加其他元素
    stage.addChild(dragon, text);
    
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
    // 重置夜晚模式状态
    if (window.nightModeTimer) {
        clearTimeout(window.nightModeTimer);
    }
    window.isInverted = false;
    window.nightModeActivated = false;
    
    // 确保画布恢复正常颜色
    var canvasElement = document.getElementById("canvas");
    document.body.style.backgroundColor = "white";
    canvasElement.style.backgroundColor = "white";
    canvasElement.style.filter = "none";
    canvasElement.style.transform = "none";
    
    // 原有的重启游戏逻辑
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
    stage.update();  // 确保舞台更新
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
    }
    GameOverContainer.visible = true;
    stage.update();  // 确保舞台更新
}
function tick(){
    if(!IsGameOver){
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
        
        // 检查当前分数
        var currentScore = 0;
        if (gradeContainer && gradeContainer.getChildByName("GRADE")) {
            var scoreText = gradeContainer.getChildByName("GRADE").text;
            currentScore = parseInt(scoreText.replace(/^0+/, '') || '0');
        }
        
        // 基于分数控制夜晚模式
        if (currentScore >= window.nightModeScoreThreshold && !window.nightModeActivated) {
            window.nightModeActivated = true;
            console.log("达到夜晚模式分数阈值：" + currentScore);
            
            // 进入夜晚模式
            window.toggleDragonColor(true);
            
            // 设置定时器，在指定时间后切换回白天模式
            window.nightModeTimer = setTimeout(function() {
                window.toggleDragonColor(false);
                
                // 再次设置定时器，在更长时间后允许再次进入夜晚模式
                setTimeout(function() {
                    window.nightModeActivated = false;
                    console.log("允许再次进入夜晚模式");
                }, window.dayModeDuration); // 使用更长的白天持续时间
            }, window.nightModeDuration);
        }
        
        // 确保在每一帧的最后更新舞台
        stage.update();
    }
}
function refreshGameParams(){
    GameParams.level ++;
    setGameDiffi(GameParams.level);
    willRefreshGameParams = false;
}
function handleKeyDown(e) {
    if (!e) { var e = window.event; }
    
    // 防止空格键的默认行为（通常是滚动页面）
    if (e.keyCode === KEYCODE_SPACE) {
        e.preventDefault();
    }
    
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

// 定义变色相关变量
window.isInverted = false;
window.nightModeActivated = false;
window.nightModeTimer = null;
window.nightModeDuration = 30000; // 夜晚持续时间，从10秒增加到30秒
window.dayModeDuration = 30000;   // 白天持续时间，30秒，增加了时间间隔
window.nightModeScoreThreshold = 400; // 进入夜晚模式的分数阈值

// 添加颜色反转功能
window.toggleDragonColor = function(forceState) {
    console.log("切换颜色模式");
    
    // 如果传入了强制状态，则使用该状态，否则切换当前状态
    if (typeof forceState === 'boolean') {
        window.isInverted = forceState;
    } else {
        window.isInverted = !window.isInverted;
    }
    
    var canvasElement = document.getElementById("canvas");
    
    // 清除所有可能的过渡效果，防止干扰
    canvasElement.style.transition = "none";
    void canvasElement.offsetWidth; // 强制重排
    
    // 重新应用过渡效果
    canvasElement.style.transition = "filter 1.5s ease, background-color 1.5s ease";
    
    // 立即应用样式变化
    if (window.isInverted) {
        console.log("进入夜晚模式");
        document.body.style.backgroundColor = "black";
        canvasElement.style.backgroundColor = "black";
        canvasElement.style.filter = "invert(100%)";
    } else {
        console.log("退出夜晚模式");
        document.body.style.backgroundColor = "white";
        canvasElement.style.backgroundColor = "white";
        canvasElement.style.filter = "none";
    }
    
    // 在过渡期间定期更新舞台
    var transitionInterval = setInterval(function() {
        if (stage) {
            stage.update();
        }
    }, 100);
    
    // 过渡结束后清除定时器
    setTimeout(function() {
        clearInterval(transitionInterval);
        if (stage) {
            stage.update();
        }
        
        // 确保过渡结束后滤镜已正确应用
        if (window.isInverted) {
            if (canvasElement.style.filter !== "invert(100%)") {
                canvasElement.style.filter = "invert(100%)";
                if (stage) stage.update();
            }
        }
    }, 1600);
}

// 定义标记过渡状态的变量
window.isTransitioning = false;

// 页面加载完成后预先初始化filter属性
window.addEventListener('load', function() {
    var canvas = document.getElementById('canvas');
    
    // 预先应用一次filter属性然后立即移除，确保浏览器缓存该属性
    canvas.style.filter = "invert(0%)";
    
    // 强制重绘
    void canvas.offsetWidth;
    
    // 移除filter
    canvas.style.filter = "none";
});

function sendObstacle(){
        var time = Math.floor(1200*Math.random()+600);
        var obstacle;
        if(GameParams.level<2){
            obstacle = createCacti();
        }
        else{
            var _subvalue = GameParams.level - 1;
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
    GameParams.velocity = 8 + level * 0.5;
}


