////////////////////////////////////////////////////////////
// CANVAS
////////////////////////////////////////////////////////////
var stage;
var canvasW=0;
var canvasH=0;

// Mobile detection for performance optimization
var isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
var outlineSize = isMobileDevice ? 2 : 6; // Moderate outline on mobile (2px vs 6px)

/*!
 * 
 * START GAME CANVAS - This is the function that runs to setup game canvas
 * 
 */
function initGameCanvas(w,h){
	const gameCanvas = document.getElementById("gameCanvas");
	gameCanvas.width = w;
	gameCanvas.height = h;
	
	canvasW=w;
	canvasH=h;
	stage = new createjs.Stage("gameCanvas"); // CreateJS handles its own optimization
	
	createjs.Touch.enable(stage);
	stage.enableMouseOver(20);
	stage.mouseMoveOutside = true;
	
	// Use standard 60 FPS - modern mobile browsers handle this well
	createjs.Ticker.framerate = 60;
	createjs.Ticker.addEventListener("tick", tick);	
}

var safeZoneGuide = false;
var canvasContainer, mainContainer, gameContainer, resultContainer, exitContainer, optionsContainer, shareContainer, shareSaveContainer, socialContainer, tJunctionContainer, quizContainer, quizButtonContainer;
var guideline, bg, bgP, logo, logoP;
var itemExit, itemExitP, popTitleTxt, popDescTxt, buttonConfirm, buttonCancel;
var itemResult, itemResultP, buttonContinue, resultTitleTxt, resultDescTxt, buttonShare, buttonSave;
var resultTitleOutlineTxt,resultDescOutlineTxt,resultShareTxt,resultShareOutlineTxt,popTitleOutlineTxt,popDescOutlineTxt;
var buttonSettings, buttonFullscreen, buttonSoundOn, buttonSoundOff, buttonMusicOn, buttonMusicOff, buttonExit;
// T-Junction Modal Variables
var itemTJunction, tJunctionTitleTxt, buttonTurnLeft, buttonTurnRight, tJunctionPendingDirection;
// Quiz Modal Variables
var itemQuiz, quizTitleTxt, quizQuestionTxt, buttonQuizA, buttonQuizB, buttonQuizC, buttonQuizD, buttonQuizContinue;
var labelA, labelB, labelC, labelD, labelContinue; // Quiz option labels
// Quiz Button Variables (no overlay)
var buttonYes, buttonNo, currentQuizQuestion, quizButtonQuestionTxt, quizButtonQuestionShadowTxt;
$.share = {};

var statusContainer, gameStatusContainer, worldContainer;
var buttonStart,smokeAnimate,fireData,fireAnimate,scoreTxt,scoreShadowTxt,fuelTxt,fuelShadowTxt,fuelBarBackground,fuelBarEmpty,fuelBarFill,gameStatusTxt,gameStatusShadowTxt,instructionTxt,instructionShadowTxt,itemTouchUp,itemTouchDown,itemTouchLeft,itemTouchRight,resultTitleShadowTxt,resultScoreTxt,resultScoreShadowTxt,resultScoreDescTxt,resultScoreDescShadowTxt,resultShareShadowTxt;
$.sprites = {};
$.background = {};

/*!
 * 
 * BUILD GAME CANVAS ASSERTS - This is the function that runs to build game canvas asserts
 * 
 */
function buildGameCanvas(){
	canvasContainer = new createjs.Container();
    mainContainer = new createjs.Container();
    gameContainer = new createjs.Container();
    exitContainer = new createjs.Container();
    resultContainer = new createjs.Container();
    shareContainer = new createjs.Container();
    shareSaveContainer = new createjs.Container();
    socialContainer = new createjs.Container();
    tJunctionContainer = new createjs.Container();
    quizContainer = new createjs.Container();
    quizButtonContainer = new createjs.Container();
	
	statusContainer = new createjs.Container();
	gameStatusContainer = new createjs.Container();
	worldContainer = new createjs.Container();
	
	bg = new createjs.Bitmap(loader.getResult('background'));
	logo = new createjs.Bitmap(loader.getResult('logo'));
	
	buttonStart = new createjs.Bitmap(loader.getResult('buttonStart'));
	centerReg(buttonStart);
	buttonStart.x = canvasW/2;
	buttonStart.y = canvasH/100 * 55;
	
	//road	
	for(var key in spritesData) {
		if(spritesData[key].src != undefined){
			spritesData[key].id = key;
			var loadedResult = loader.getResult(key);
			if (loadedResult) {
				$.sprites[key] = new createjs.Bitmap(loadedResult);
				$.sprites[key].y -= $.sprites[key].image.naturalHeight;
				gameContainer.addChild($.sprites[key]);
				
				spritesData[key].id = key;
				spritesData[key].w = $.sprites[key].image.naturalWidth;
				spritesData[key].h = $.sprites[key].image.naturalHeight;
				
				// Debug log for coin sprites
				if (key.includes('COIN')) {
					console.log('Loaded sprite:', key, 'Size:', spritesData[key].w + 'x' + spritesData[key].h);
				}
			} else {
				console.error('Failed to load sprite:', key, 'from', spritesData[key].src);
			}
		}
	}
	
	for(var key in backgroundData) {
		if(backgroundData[key].src != undefined){
			$.background[key] = new createjs.Bitmap(loader.getResult(key));
			$.background[key].y -= $.background[key].image.naturalHeight;
			gameContainer.addChild($.background[key]);
			
			backgroundData[key].id = key;
			backgroundData[key].w = $.background[key].image.naturalWidth;
			backgroundData[key].h = $.background[key].image.naturalHeight;
		}
	}
	
	for(var key in playerCarData) {
		if(playerCarData[key].src != undefined){
			$.sprites[key] = new createjs.Bitmap(loader.getResult(key));
			$.sprites[key].y -= $.sprites[key].image.naturalHeight;
			gameContainer.addChild($.sprites[key]);
			
			playerCarData[key].id = key;
			playerCarData[key].w = $.sprites[key].image.naturalWidth;
			playerCarData[key].h = $.sprites[key].image.naturalHeight;
		}
	}
	
	var _frameW = 70;
	var _frameH = 100;
	
	var _frame = {"regX": 0, "regY": 0, "height": _frameH, "count": 2, "width": _frameW};
	var _animations = {animate:{frames: [0,1], speed:1}};
						
	smokeData = new createjs.SpriteSheet({
		"images": [loader.getResult('itemSmoke').src],
		"frames": _frame,
		"animations": _animations
	});
	
	smokeAnimate = new createjs.Sprite(smokeData, "animate");
	smokeAnimate.framerate = 20;
	smokeAnimate.x = -200;
	
	var _frameW = 155;
	var _frameH = 55;
	var _frame = {"regX": 0, "regY": 0, "height": _frameH, "count": 2, "width": _frameW};
	var _animations = {animate:{frames: [0,1], speed:1}};
						
	fireData = new createjs.SpriteSheet({
		"images": [loader.getResult('itemFire').src],
		"frames": _frame,
		"animations": _animations
	});
	
	fireAnimate = new createjs.Sprite(fireData, "animate");
	fireAnimate.framerate = 20;
	fireAnimate.x = -200;
	
	scoreTxt = new createjs.Text();
	scoreTxt.font = "50px Mont Heavy DEMO";
	scoreTxt.color = "#071c27";
	scoreTxt.textAlign = "left";
	scoreTxt.textBaseline='alphabetic';
	scoreTxt.text = scoreData.text;
	scoreTxt.x = canvasW/100 * 2;
	scoreTxt.y = canvasH/100 * 5;
	
	scoreShadowTxt = new createjs.Text();
	scoreShadowTxt.font = "50px Mont Heavy DEMO";
	scoreShadowTxt.color = "#ffffff";
	scoreShadowTxt.textAlign = "left";
	scoreShadowTxt.textBaseline='alphabetic';
	scoreShadowTxt.text = scoreData.text;
	scoreShadowTxt.outline = outlineSize;
	scoreShadowTxt.x = scoreTxt.x;
	scoreShadowTxt.y = scoreTxt.y;
	
	fuelTxt = new createjs.Text();
	fuelTxt.font = "30px Mont Heavy DEMO";
	fuelTxt.color = "#0087ac";
	fuelTxt.textAlign = "left";
	fuelTxt.textBaseline='alphabetic';
	fuelTxt.text = fuelData.text;
	fuelTxt.x = canvasW/100 * 2;
	fuelTxt.y = canvasH/100 * 9;
	
	fuelShadowTxt = new createjs.Text();
	fuelShadowTxt.font = "30px Mont Heavy DEMO";
	fuelShadowTxt.color = "#ffffff";
	fuelShadowTxt.textAlign = "left";
	fuelShadowTxt.textBaseline='alphabetic';
	fuelShadowTxt.text = fuelData.text;
	fuelShadowTxt.outline = Math.max(2, outlineSize - 2);
	fuelShadowTxt.x = fuelTxt.x;
	fuelShadowTxt.y = fuelTxt.y;
	
	fuelBarBackground = new createjs.Shape();
	fuelBarBackground.graphics.beginFill(fuelData.bar.backgroundColor).drawRect(0, 0, fuelData.bar.width, fuelData.bar.height);
	fuelBarBackground.x = canvasW/100 * 12;
	fuelBarBackground.y = canvasH/100 * 6.8;
	
	fuelBarEmpty = new createjs.Shape();
	fuelBarEmpty.graphics.beginFill(fuelData.bar.blankColor).drawRect(0, 0, fuelData.bar.width - (fuelData.bar.space*2), fuelData.bar.height - (fuelData.bar.space * 4));
	fuelBarEmpty.x = fuelBarBackground.x + fuelData.bar.space;
	fuelBarEmpty.y = fuelBarBackground.y + fuelData.bar.space;
	
	fuelBarFill = new createjs.Shape();
	fuelBarFill.x = fuelBarBackground.x + fuelData.bar.space;
	fuelBarFill.y = fuelBarBackground.y + fuelData.bar.space;
	
	gameStatusTxt = new createjs.Text();
	gameStatusTxt.font = "90px Mont Heavy DEMO";
	gameStatusTxt.color = "#fff";
	gameStatusTxt.textAlign = "center";
	gameStatusTxt.textBaseline='alphabetic';
	gameStatusTxt.text = '';
	gameStatusTxt.x = canvasW/2;
	gameStatusTxt.y = canvasH/100 * 30;
	
	gameStatusShadowTxt = new createjs.Text();
	gameStatusShadowTxt.font = "90px Mont Heavy DEMO";
	gameStatusShadowTxt.color = "#ffffff";
	gameStatusShadowTxt.textAlign = "center";
	gameStatusShadowTxt.textBaseline='alphabetic';
	gameStatusShadowTxt.text = '';
	gameStatusShadowTxt.outline = outlineSize + 2;
	gameStatusShadowTxt.x = gameStatusTxt.x;
	gameStatusShadowTxt.y = gameStatusTxt.y;
	
	instructionTxt = new createjs.Text();
	instructionTxt.font = "50px Mont Heavy DEMO";
	instructionTxt.color = "#ffffff";
	instructionTxt.textAlign = "center";
	instructionTxt.textBaseline='alphabetic';
	instructionTxt.text = intructionDisplayText;
	instructionTxt.x = canvasW/2;
	instructionTxt.y = canvasH/100 * 40;
	
	instructionShadowTxt = new createjs.Text();
	instructionShadowTxt.font = "50px Mont Heavy DEMO";
	instructionShadowTxt.color = "#2f2f2f";
	instructionShadowTxt.textAlign = "center";
	instructionShadowTxt.textBaseline='alphabetic';
	instructionShadowTxt.text = intructionDisplayText;
	instructionShadowTxt.x = instructionTxt.x+1;
	instructionShadowTxt.y = instructionTxt.y;
	
	//key
	itemTouchUp = new createjs.Bitmap(loader.getResult('itemTouchUp'));
	centerReg(itemTouchUp);
	createHitarea(itemTouchUp);
	itemTouchDown = new createjs.Bitmap(loader.getResult('itemTouchDown'));
	centerReg(itemTouchDown);
	createHitarea(itemTouchDown);
	itemTouchLeft = new createjs.Bitmap(loader.getResult('itemTouchLeft'));
	centerReg(itemTouchLeft);
	createHitarea(itemTouchLeft);
	itemTouchRight = new createjs.Bitmap(loader.getResult('itemTouchRight'));
	centerReg(itemTouchRight);
	createHitarea(itemTouchRight);
	
	itemTouchUp.alpha = itemTouchDown.alpha = itemTouchLeft.alpha = itemTouchRight.alpha = .2;
	
	//result
	resultTitleTxt = new createjs.Text();
	resultTitleTxt.font = "90px Mont Heavy DEMO";
	resultTitleTxt.color = "#071c27";
	resultTitleTxt.textAlign = "center";
	resultTitleTxt.textBaseline='alphabetic';
	resultTitleTxt.text = resultTitleText;
	resultTitleTxt.x = canvasW/2;
	resultTitleTxt.y = canvasH/100 * 30;
	
	resultTitleShadowTxt = new createjs.Text();
	resultTitleShadowTxt.font = "90px Mont Heavy DEMO";
	resultTitleShadowTxt.color = "#ffffff";
	resultTitleShadowTxt.textAlign = "center";
	resultTitleShadowTxt.textBaseline='alphabetic';
	resultTitleShadowTxt.text = resultTitleText;
	resultTitleShadowTxt.outline = outlineSize;
	resultTitleShadowTxt.x = resultTitleTxt.x+1;
	resultTitleShadowTxt.y = resultTitleTxt.y;
	
	resultScoreTxt = new createjs.Text();
	resultScoreTxt.font = "120px Mont Heavy DEMO";
	resultScoreTxt.color = "#0087ac";
	resultScoreTxt.textAlign = "center";
	resultScoreTxt.textBaseline='alphabetic';
	resultScoreTxt.text = '1500PTS';
	resultScoreTxt.x = canvasW/2;
	resultScoreTxt.y = canvasH/100 * 70;
	
	resultScoreShadowTxt = new createjs.Text();
	resultScoreShadowTxt.font = "120px Mont Heavy DEMO";
	resultScoreShadowTxt.color = "#ffffff";
	resultScoreShadowTxt.textAlign = "center";
	resultScoreShadowTxt.textBaseline='alphabetic';
	resultScoreShadowTxt.text = '1500PTS';
	resultScoreShadowTxt.outline = outlineSize;
	resultScoreShadowTxt.x = resultScoreTxt.x+1;
	resultScoreShadowTxt.y = resultScoreTxt.y;
	
	resultScoreDescTxt = new createjs.Text();
	resultScoreDescTxt.font = "60px Mont Heavy DEMO";
	resultScoreDescTxt.color = "#0087ac";
	resultScoreDescTxt.textAlign = "center";
	resultScoreDescTxt.textBaseline='alphabetic';
	resultScoreDescTxt.text = resultScoreText;
	resultScoreDescTxt.x = canvasW/2;
	resultScoreDescTxt.y = canvasH/100 * 52;
	
	resultScoreDescShadowTxt = new createjs.Text();
	resultScoreDescShadowTxt.font = "60px Mont Heavy DEMO";
	resultScoreDescShadowTxt.color = "#ffffff";
	resultScoreDescShadowTxt.textAlign = "center";
	resultScoreDescShadowTxt.textBaseline='alphabetic';
	resultScoreDescShadowTxt.outline = outlineSize;
	resultScoreDescShadowTxt.text = resultScoreText;
	resultScoreDescShadowTxt.x = resultScoreDescTxt.x+1;
	resultScoreDescShadowTxt.y = resultScoreDescTxt.y;
	
	// resultShareTxt = new createjs.Text();
	// resultShareTxt.font = "25px Mont Heavy DEMO";
	// resultShareTxt.color = "#fff";
	// resultShareTxt.textAlign = "center";
	// resultShareTxt.textBaseline='alphabetic';
	// resultShareTxt.text = shareText;
	
	// resultShareShadowTxt = new createjs.Text();
	// resultShareShadowTxt.font = "25px Mont Heavy DEMO";
	// resultShareShadowTxt.color = "#2f2f2f";
	// resultShareShadowTxt.textAlign = "center";
	// resultShareShadowTxt.textBaseline='alphabetic';
	// resultShareShadowTxt.text = shareText;
	// resultShareShadowTxt.x = 1;

	shareContainer.x = shareSaveContainer.x = canvasW/2;
    shareContainer.y = shareSaveContainer.y = canvasH/100 * 63;
	
	socialContainer.visible = false;
    socialContainer.scale = 1;
    shareContainer.addChild(resultShareShadowTxt, resultShareTxt, socialContainer);

    if(shareSettings.enable){
        buttonShare = new createjs.Bitmap(loader.getResult('buttonShare'));
        centerReg(buttonShare);
        
        var pos = {x:0, y:45, spaceX:65};
        pos.x = -(((shareSettings.options.length-1) * pos.spaceX)/2)
        for(let n=0; n<shareSettings.options.length; n++){
            var shareOption = shareSettings.options[n];
            var shareAsset = String(shareOption[0]).toUpperCase() + String(shareOption).slice(1);
            $.share['button'+n] = new createjs.Bitmap(loader.getResult('button'+shareAsset));
            $.share['button'+n].shareOption = shareOption;
            centerReg($.share['button'+n]);
            $.share['button'+n].x = pos.x;
            $.share['button'+n].y = pos.y;
            socialContainer.addChild($.share['button'+n]);
            pos.x += pos.spaceX;
        }
        buttonShare.y = (buttonShare.image.naturalHeight/2) + 10;
        shareContainer.addChild(buttonShare);
    }

    if ( typeof toggleScoreboardSave == 'function' ) { 
        buttonSave = new createjs.Bitmap(loader.getResult('buttonSave'));
        centerReg(buttonSave);
        buttonSave.y = (buttonSave.image.naturalHeight/2) + 10;
        shareSaveContainer.addChild(buttonSave);
    }
	
	buttonRestart = new createjs.Bitmap(loader.getResult('buttonRestart'));
	centerReg(buttonRestart);
	createHitarea(buttonRestart);
	buttonRestart.x = canvasW/2;
	buttonRestart.y = canvasH/100 * 80;
	
	//option
	buttonFullscreen = new createjs.Bitmap(loader.getResult('buttonFullscreen'));
	centerReg(buttonFullscreen);
	buttonSoundOn = new createjs.Bitmap(loader.getResult('buttonSoundOn'));
	centerReg(buttonSoundOn);
	buttonSoundOff = new createjs.Bitmap(loader.getResult('buttonSoundOff'));
	centerReg(buttonSoundOff);
	buttonSoundOn.visible = false;
	buttonMusicOn = new createjs.Bitmap(loader.getResult('buttonMusicOn'));
	centerReg(buttonMusicOn);
	buttonMusicOff = new createjs.Bitmap(loader.getResult('buttonMusicOff'));
	centerReg(buttonMusicOff);
	buttonMusicOn.visible = false;
	
	buttonExit = new createjs.Bitmap(loader.getResult('buttonExit'));
	centerReg(buttonExit);
	buttonSettings = new createjs.Bitmap(loader.getResult('buttonSettings'));
	centerReg(buttonSettings);
	
	createHitarea(buttonFullscreen);
	createHitarea(buttonSoundOn);
	createHitarea(buttonSoundOff);
	createHitarea(buttonMusicOn);
	createHitarea(buttonMusicOff);
	createHitarea(buttonExit);
	createHitarea(buttonSettings);
	optionsContainer = new createjs.Container();
	optionsContainer.addChild(buttonFullscreen, buttonSoundOn, buttonSoundOff, buttonMusicOn, buttonMusicOff, buttonExit);
	optionsContainer.visible = false;
	
	//exit
	itemExit = new createjs.Bitmap(loader.getResult('itemExit'));
	
	buttonConfirm = new createjs.Bitmap(loader.getResult('buttonConfirm'));
	centerReg(buttonConfirm);
	buttonConfirm.x = canvasW/100* 37;
	buttonConfirm.y = canvasH/100 * 58;
	
	buttonCancel = new createjs.Bitmap(loader.getResult('buttonCancel'));
	centerReg(buttonCancel);
	buttonCancel.x = canvasW/100 * 66;
	buttonCancel.y = canvasH/100 * 58;
	
	confirmMessageTxt = new createjs.Text();
	confirmMessageTxt.font = "35px Mont Heavy DEMO";
	confirmMessageTxt.color = "#2f2f2f";
	confirmMessageTxt.textAlign = "center";
	confirmMessageTxt.textBaseline='alphabetic';
	confirmMessageTxt.text = exitMessage;
	confirmMessageTxt.x = canvasW/2;
	confirmMessageTxt.y = canvasH/100 *38;
	
	exitContainer.addChild(itemExit, buttonConfirm, buttonCancel, confirmMessageTxt);
	exitContainer.visible = false;
	
	//T-Junction Choice Modal
	itemTJunction = new createjs.Bitmap(loader.getResult('itemExit')); // Reuse exit modal background
	
	buttonTurnLeft = new createjs.Bitmap(loader.getResult('buttonCancel')); // Reuse cancel button for left
	centerReg(buttonTurnLeft);
	buttonTurnLeft.x = canvasW/100* 37;
	buttonTurnLeft.y = canvasH/100 * 58;
	
	buttonTurnRight = new createjs.Bitmap(loader.getResult('buttonConfirm')); // Reuse confirm button for right
	centerReg(buttonTurnRight);
	buttonTurnRight.x = canvasW/100 * 66;
	buttonTurnRight.y = canvasH/100 * 58;
	
	tJunctionTitleTxt = new createjs.Text();
	tJunctionTitleTxt.font = "35px Mont Heavy DEMO";
	tJunctionTitleTxt.color = "#2f2f2f";
	tJunctionTitleTxt.textAlign = "center";
	tJunctionTitleTxt.textBaseline='alphabetic';
	tJunctionTitleTxt.text = "T-JUNCTION AHEAD!\nCHOOSE YOUR DIRECTION";
	tJunctionTitleTxt.x = canvasW/2;
	tJunctionTitleTxt.y = canvasH/100 *35;
	
	// Button labels
	var leftLabel = new createjs.Text();
	leftLabel.font = "28px Mont Heavy DEMO";
	leftLabel.color = "#ffffff";
	leftLabel.textAlign = "center";
	leftLabel.textBaseline='alphabetic';
	leftLabel.text = "TURN\nRIGHT";
	leftLabel.x = buttonTurnLeft.x;
	leftLabel.y = buttonTurnLeft.y + 10;
	
	var rightLabel = new createjs.Text();
	rightLabel.font = "28px Mont Heavy DEMO";
	rightLabel.color = "#ffffff";
	rightLabel.textAlign = "center";
	rightLabel.textBaseline='alphabetic';
	rightLabel.text = "TURN\nLEFT";
	rightLabel.x = buttonTurnRight.x;
	rightLabel.y = buttonTurnRight.y + 10;
	
	tJunctionContainer.addChild(itemTJunction, buttonTurnLeft, buttonTurnRight, tJunctionTitleTxt, leftLabel, rightLabel);
	tJunctionContainer.visible = false;
	
	//Quiz Modal
	itemQuiz = new createjs.Bitmap(loader.getResult('itemExit')); // Reuse exit modal background
	
	quizTitleTxt = new createjs.Text();
	quizTitleTxt.font = Math.min(30, canvasW/25) + "px Mont Heavy DEMO"; // Responsive font size
	quizTitleTxt.color = "#2f2f2f";
	quizTitleTxt.textAlign = "center";
	quizTitleTxt.textBaseline='alphabetic';
	quizTitleTxt.text = "FUEL QUIZ!";
	quizTitleTxt.x = canvasW/2;
	quizTitleTxt.y = canvasH/100 * 25;
	quizTitleTxt.lineWidth = canvasW * 0.7; // Set max width for text wrapping
	
	quizQuestionTxt = new createjs.Text();
	quizQuestionTxt.font = Math.min(20, canvasW/35) + "px Mont Heavy DEMO"; // Responsive font size  
	quizQuestionTxt.color = "#2f2f2f";
	quizQuestionTxt.textAlign = "center";
	quizQuestionTxt.textBaseline='alphabetic';
	quizQuestionTxt.text = "Question will appear here";
	quizQuestionTxt.x = canvasW/2;
	quizQuestionTxt.y = canvasH/100 * 35;
	quizQuestionTxt.lineWidth = canvasW * 0.8; // Set max width for text wrapping
	
	// Quiz option buttons (A, B only - 2 choices)
	buttonQuizA = new createjs.Bitmap(loader.getResult('buttonCancel'));
	centerReg(buttonQuizA);
	buttonQuizA.x = canvasW/100 * 35; // Moved more center
	buttonQuizA.y = canvasH/100 * 55;
	
	buttonQuizB = new createjs.Bitmap(loader.getResult('buttonConfirm'));
	centerReg(buttonQuizB);
	buttonQuizB.x = canvasW/100 * 65; // Moved more center
	buttonQuizB.y = canvasH/100 * 55;
	
	// Dynamic Continue Button for quiz results
	buttonQuizContinue = new createjs.Bitmap(loader.getResult('buttonStart'));
	centerReg(buttonQuizContinue);
	buttonQuizContinue.x = canvasW/2;
	buttonQuizContinue.y = canvasH/100 * 65;
	buttonQuizContinue.visible = false; // Hidden by default
	
	buttonQuizC = new createjs.Bitmap(loader.getResult('buttonCancel'));
	centerReg(buttonQuizC);
	buttonQuizC.x = canvasW/100 * 25;
	buttonQuizC.y = canvasH/100 * 65;
	buttonQuizC.visible = false; // Hide C button
	
	buttonQuizD = new createjs.Bitmap(loader.getResult('buttonConfirm'));
	centerReg(buttonQuizD);
	buttonQuizD.x = canvasW/100 * 75;
	buttonQuizD.y = canvasH/100 * 65;
	buttonQuizD.visible = false; // Hide D button
	
	// Quiz option labels (A, B only) - Responsive text
	labelA = new createjs.Text();
	labelA.font = Math.min(16, canvasW/45) + "px Mont Heavy DEMO"; // Responsive font size
	labelA.color = "#ffffff";
	labelA.textAlign = "center";
	labelA.textBaseline='alphabetic';
	labelA.text = "A";
	labelA.x = buttonQuizA.x;
	labelA.y = buttonQuizA.y + 5;
	labelA.lineWidth = canvasW * 0.35; // Max width for wrapping
	
	labelB = new createjs.Text();
	labelB.font = Math.min(16, canvasW/45) + "px Mont Heavy DEMO"; // Responsive font size
	labelB.color = "#ffffff";
	labelB.textAlign = "center";
	labelB.textBaseline='alphabetic';
	labelB.text = "B";
	labelB.x = buttonQuizB.x;
	labelB.y = buttonQuizB.y + 5;
	labelB.lineWidth = canvasW * 0.35; // Max width for wrapping
	
	// Continue Button Label
	labelContinue = new createjs.Text();
	labelContinue.font = Math.min(18, canvasW/40) + "px Mont Heavy DEMO"; // Responsive font size
	labelContinue.color = "#ffffff";
	labelContinue.textAlign = "center";
	labelContinue.textBaseline='alphabetic';
	labelContinue.text = "CONTINUE";
	labelContinue.x = buttonQuizContinue.x;
	labelContinue.y = buttonQuizContinue.y + 5;
	labelContinue.visible = false; // Hidden by default
	
	labelC = new createjs.Text();
	labelC.font = "20px Mont Heavy DEMO";
	labelC.color = "#ffffff";
	labelC.textAlign = "center";
	labelC.textBaseline='alphabetic';
	labelC.text = "C";
	labelC.x = buttonQuizC.x;
	labelC.y = buttonQuizC.y + 5;
	labelC.visible = false; // Hide C label
	
	labelD = new createjs.Text();
	labelD.font = "20px Mont Heavy DEMO";
	labelD.color = "#ffffff";
	labelD.textAlign = "center";
	labelD.textBaseline='alphabetic';
	labelD.text = "D";
	labelD.x = buttonQuizD.x;
	labelD.y = buttonQuizD.y + 5;
	labelD.visible = false; // Hide D label
	
	quizContainer.addChild(itemQuiz, quizTitleTxt, quizQuestionTxt, buttonQuizA, buttonQuizB, buttonQuizC, buttonQuizD, labelA, labelB, labelC, labelD, buttonQuizContinue, labelContinue);
	quizContainer.visible = false;
	
	// Quiz Buttons (Yes/No - no overlay)
	// Calculate responsive font size and button scale with proper margins for mobile
	var quizFontSize = isMobileDevice ? Math.min(28, canvasW * 0.045) : Math.min(40, canvasW * 0.05); // Smaller font on mobile
	var quizLineWidth = canvasW * 0.75; // 75% of screen width (more margins: 12.5% left + 12.5% right)
	var buttonScale = Math.min(1, canvasW / 600); // Scale buttons for smaller screens
	
	// Question text shadow (outline)
	quizButtonQuestionShadowTxt = new createjs.Text();
	quizButtonQuestionShadowTxt.font = quizFontSize + "px Mont Heavy DEMO";
	quizButtonQuestionShadowTxt.color = "#ffffff";
	quizButtonQuestionShadowTxt.textAlign = "center";
	quizButtonQuestionShadowTxt.textBaseline = "alphabetic";
	quizButtonQuestionShadowTxt.outline = outlineSize + 2;
	quizButtonQuestionShadowTxt.text = "";
	quizButtonQuestionShadowTxt.x = canvasW/2; // Centered
	quizButtonQuestionShadowTxt.y = canvasH/100 * 50; // Moved higher for better mobile visibility
	quizButtonQuestionShadowTxt.lineWidth = quizLineWidth; // With margins
	
	// Question text main
	quizButtonQuestionTxt = new createjs.Text();
	quizButtonQuestionTxt.font = quizFontSize + "px Mont Heavy DEMO";
	quizButtonQuestionTxt.color = "#0087ac";
	quizButtonQuestionTxt.textAlign = "center";
	quizButtonQuestionTxt.textBaseline = "alphabetic";
	quizButtonQuestionTxt.text = "";
	quizButtonQuestionTxt.x = canvasW/2; // Centered
	quizButtonQuestionTxt.y = canvasH/100 * 50; // Moved higher for better mobile visibility
	quizButtonQuestionTxt.lineWidth = quizLineWidth; // With margins
	
	buttonYes = new createjs.Bitmap(loader.getResult('buttonYes'));
	centerReg(buttonYes);
	createHitarea(buttonYes);
	buttonYes.x = canvasW/100 * 35;
	buttonYes.y = canvasH/100 * 70;
	buttonYes.scaleX = buttonYes.scaleY = buttonScale;
	
	buttonNo = new createjs.Bitmap(loader.getResult('buttonNo'));
	centerReg(buttonNo);
	createHitarea(buttonNo);
	buttonNo.x = canvasW/100 * 65;
	buttonNo.y = canvasH/100 * 70;
	buttonNo.scaleX = buttonNo.scaleY = buttonScale;
	
	quizButtonContainer.addChild(quizButtonQuestionShadowTxt, quizButtonQuestionTxt, buttonYes, buttonNo);
	quizButtonContainer.visible = false;
	
	guideline = new createjs.Shape();
	
	mainContainer.addChild(logo, buttonStart);
	gameStatusContainer.addChild(gameStatusShadowTxt, gameStatusTxt);
	gameContainer.addChild(smokeAnimate, fireAnimate, gameStatusContainer, statusContainer, instructionShadowTxt, instructionTxt, itemTouchUp, itemTouchDown, itemTouchLeft, itemTouchRight);
	statusContainer.addChild(scoreShadowTxt, scoreTxt, fuelShadowTxt, fuelTxt, fuelBarBackground, fuelBarEmpty, fuelBarFill);
	resultContainer.addChild(resultTitleShadowTxt, resultTitleTxt, resultScoreDescShadowTxt, resultScoreDescTxt, resultScoreShadowTxt, resultScoreTxt, buttonRestart, shareContainer, shareSaveContainer);
	
	canvasContainer.addChild(bg, worldContainer, mainContainer, gameContainer, resultContainer, exitContainer, tJunctionContainer, quizContainer, quizButtonContainer, optionsContainer, buttonSettings, guideline);
	stage.addChild(canvasContainer);
	
	resizeCanvas();
}


/*!
 * 
 * RESIZE GAME CANVAS - This is the function that runs to resize game canvas
 * 
 */
function resizeCanvas(){
	const cssWidth = stageW * scalePercent;
	const cssHeight = stageH * scalePercent;
	const gameCanvas = document.getElementById("gameCanvas");
	gameCanvas.style.width = cssWidth + "px";
	gameCanvas.style.height = cssHeight + "px";

	gameCanvas.style.left = (offset.left/2) + "px";
	gameCanvas.style.top = (offset.top/2) + "px";
	
	gameCanvas.width = stageW * dpr;
	gameCanvas.height = stageH * dpr;
	
 	if(canvasContainer!=undefined){
		stage.scaleX = stage.scaleY = dpr;
		
		if(safeZoneGuide){	
			guideline.graphics.clear().setStrokeStyle(2).beginStroke('red').drawRect((stageW-contentW)/2, (stageH-contentH)/2, contentW, contentH);
		}
		
		statusContainer.x = offset.x;
		statusContainer.y = offset.y;
		
		buttonSettings.x = (canvasW - offset.x) - 60;
		buttonSettings.y = offset.y + 45;
		
		var distanceNum = 60;
		var nextCount = 0;
		buttonSoundOn.x = buttonSoundOff.x = buttonSettings.x;
		buttonSoundOn.y = buttonSoundOff.y = buttonSettings.y+distanceNum;
		buttonSoundOn.x = buttonSoundOff.x;
		buttonSoundOn.y = buttonSoundOff.y = buttonSettings.y+distanceNum;
		if (typeof buttonMusicOn != "undefined") {
			buttonMusicOn.x = buttonMusicOff.x = buttonSettings.x;
			buttonMusicOn.y = buttonMusicOff.y = buttonSettings.y+(distanceNum*2);
			buttonMusicOn.x = buttonMusicOff.x;
			buttonMusicOn.y = buttonMusicOff.y = buttonSettings.y+(distanceNum*2);
			nextCount = 2;
		}else{
			nextCount = 1;
		}
		buttonFullscreen.x = buttonSettings.x;
		buttonFullscreen.y = buttonSettings.y+(distanceNum*(nextCount+1));

		if(curPage == 'main' || curPage == 'result'){
			buttonExit.visible = false;			
			buttonFullscreen.x = buttonSettings.x;
			buttonFullscreen.y = buttonSettings.y+(distanceNum*(nextCount+1));
		}else{
			buttonExit.visible = true;			
			buttonExit.x = buttonSettings.x;
			buttonExit.y = buttonSettings.y+(distanceNum*(nextCount+2));
		}
		
		/*itemTouchUp.x = offset.x + 90;
		itemTouchDown.x = offset.x + 90;
		itemTouchDown.y = canvasH - (offset.y + 90);
		itemTouchUp.y = itemTouchDown.y - 140;*/
		
		itemTouchUp.x = (offset.x + 90)
		itemTouchUp.y = canvasH - (offset.y + 90);
		itemTouchDown.x = itemTouchUp.x + 110;
		itemTouchDown.y = itemTouchUp.y;
		
		itemTouchRight.x = canvasW - (offset.x + 90)
		itemTouchRight.y = canvasH - (offset.y + 90);
		itemTouchLeft.x = itemTouchRight.x - 110;
		itemTouchLeft.y = itemTouchRight.y;
	}
}

/*!
 * 
 * REMOVE GAME CANVAS - This is the function that runs to remove game canvas
 * 
 */
 function removeGameCanvas(){
	 stage.autoClear = true;
	 stage.removeAllChildren();
	 stage.update();
	 createjs.Ticker.removeEventListener("tick", tick);
	 createjs.Ticker.removeEventListener("tick", stage);
 }

/*!
 * 
 * CANVAS LOOP - This is the function that runs for canvas loop
 * 
 */ 
function tick(event) {
	updateGame();
	stage.update(event);
}

/*!
 * 
 * CANVAS MISC FUNCTIONS
 * 
 */
function centerReg(obj){
	obj.regX=obj.image.naturalWidth/2;
	obj.regY=obj.image.naturalHeight/2;
}

function createHitarea(obj){
	obj.hitArea = new createjs.Shape(new createjs.Graphics().beginFill("#000").drawRect(0, 0, obj.image.naturalWidth, obj.image.naturalHeight));
}