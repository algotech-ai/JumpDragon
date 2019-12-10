function createBackground(bgObj){
	var Params = {
		"cloudNum": 3,
		"cloudVelorityRate":0.1
	};
	var groundShiftIndex=-1;
	var Background = new createjs.Container();

	var GroundUnit = new createjs.Container();
	var GroundUnitArray = [];
	var ground = new createjs.Bitmap(loader.getResult("ground"));
	ground.y = GameParams.groundHeight;
	GroundUnit.addChild(ground);
	var UnitWidth = ground.getBounds().width;
	

	var UnitLength = Math.ceil(GameParams.width/UnitWidth);
	UnitLength = UnitLength>1?UnitLength:2;
	for(var i = 0; i < UnitLength ; i++){
		var _GroundUnit = GroundUnit.clone(true);
		_GroundUnit.x = UnitWidth*i;
		Background.addChild(_GroundUnit);
		GroundUnitArray.push(_GroundUnit);
	}



	var cloud = new createjs.Bitmap(loader.getResult("cloud"));
	var CloudBoxUnit = new createjs.Container();
	var CloudBoxUnitArray = [];
	CloudBoxUnit.setBounds(0,0,GameParams.width,GameParams.height);
	for(var i=0;i<Params.cloudNum;i++){
		var dx = Math.floor(1000/Params.cloudNum)/1000;
		var randomX = CloudBoxUnit.getBounds().width*dx*(i+0.6*Math.random());
		var randomY = 80+220*Math.random();
		var _cloud = cloud.clone();
		_cloud.x = randomX;
		_cloud.y = randomY;
		_cloud.initX = randomX;
		_cloud.initY = randomY;
		CloudBoxUnit.addChild(_cloud);
	}
	for(var i = 0; i<2; i++){
		var _CloudBoxUnit = CloudBoxUnit.clone(true);
		_CloudBoxUnit.x = i*_CloudBoxUnit.getBounds().width;
		Background.addChild(_CloudBoxUnit);
		CloudBoxUnitArray.push(_CloudBoxUnit);
	}


	stage.addChild(Background);
	Background.update = function(){
		for( var i = 0,l=GroundUnitArray.length; i < l; i++){
			GroundUnitArray[i].x -= GameParams.velocity;
			if(GroundUnitArray[i].x + UnitWidth <= 0){
				groundShiftIndex = i;
			}
		}
		(groundShiftIndex!=-1)&&groundShift(groundShiftIndex,GroundUnitArray.length);
		groundShiftIndex=-1;
		// for( var i = 0,l=GroundUnitArray.length; i < l; i++){
		// 	var _i = i>0?(i-1):(l-1);
		// 	if(GroundUnitArray[i].x + UnitWidth <= 0){
		// 		GroundUnitArray[i].x = GroundUnitArray[_i].x + UnitWidth;
		// 		// GroundUnitArray[i].x = UnitWidth * (GroundUnitArray.length - 1);
		// 	}
		// 	// console.log(GroundUnitArray[i].x,GroundUnitArray[_i].x)
		// }
		for(var i = 0 ;i < CloudBoxUnitArray.length ;i++){
			CloudBoxUnitArray[i].x -= GameParams.velocity*Params.cloudVelorityRate;
			if(CloudBoxUnitArray[i].x + CloudBoxUnitArray[i].getBounds().width <= 0){
				CloudBoxUnitArray[i].x = CloudBoxUnitArray[i].getBounds().width * (CloudBoxUnitArray.length - 1);
			}
		}
	};
	function groundShift(i,l){
		var _i = i>0?(i-1):(l-1);
		GroundUnitArray[i].x = GroundUnitArray[_i].x + UnitWidth;
	}
	window.Background = Background;
	window.GroundUnitArray = GroundUnitArray;
}




