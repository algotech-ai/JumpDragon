function createGrade(){
	var gradeContainer = new createjs.Container();
	gradeContainer.x = GameParams.width-340;
	gradeContainer.y = 50;
	gradeContainer.name = gradeContainer;
	var HI = new Char("HI");
	var HI_GRADE = new Char("000000");
	var GRADE = new Char("000000");
	gradeContainer.addChild(HI,HI_GRADE,GRADE);

	HI.x = 0;
	HI_GRADE.x = 50;
	GRADE.x = 200;
	GRADE.number = 0;
	HI_GRADE.number=0;
	GRADE.name = "GRADE";
	HI_GRADE.name="HI_GRADE";
	var localHI_GRADE = window.localStorage.getItem("HI_GRADE");
	if(localHI_GRADE){
		HI_GRADE.text = localHI_GRADE;
		HI_GRADE.number=localHI_GRADE-0;
	}
	stage.addChild(gradeContainer);
	var setTO;
	gradeContainer.startGradeUpdate = function(bool){
		bool&&(GRADE.number = 0,GRADE.text = "000000");
		setTO&&clearInterval(setTO);
		(function gradeUpdate(){
			setTO = setInterval(function(){
				if(!IsGameOver){
					GRADE.number += 1;
					var _text='';
					for(var i = 0; i<GRADE.text.length-(GRADE.number+"").length;i++){
						_text += "0"; 
					}
					GRADE.text = _text + GRADE.number;
					if(GRADE.number/100>GameParams.level){
						GameParams.level ++;
    					setGameDiffi(GameParams.level);
						// willRefreshGameParams = true;
					}
				}
			},100);

		})(setTO);

	};
	gradeContainer.recordNewHightGrade = function(){
		HI_GRADE.text = GRADE.text;
		HI_GRADE.number = GRADE.number;
		window.localStorage.setItem("HI_GRADE",HI_GRADE.text);
		stage.update();
	};
	window.gradeContainer = gradeContainer;
}

