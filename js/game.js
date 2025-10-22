////////////////////////////////////////////////////////////
// GAME v1.8
////////////////////////////////////////////////////////////

/*!
 * 
 * GAME SETTING CUSTOMIZATION START
 * 
 * FUEL SYSTEM: DISABLED for infinite driving
 * - Fuel bar always shows full
 * - No fuel consumption
 * - No fuel pickups generated
 * - No game over from running out of fuel
 * - Drive as long as you want!
 * 
 */
 
//background assets - city theme
const backgroundData = {
	hills: { src:'assets/background_hills.png'}, // City skyline
	sky:   { src:'assets/background_sky.png'},   // Urban sky
	trees: { src:'assets/background_trees.png'} // Foreground buildings
};

//road assets
const roadData = {
	width:1800,
	rumbleLength:2,
	lanes:3,
	fogDensity:5,
	fog:'#045b4c',
	light:{road:'#434343', grass:'#509b50', rumble:'#7c4d29', lane:'#CCCCCC'},
	dark:{road:'#444', grass:'#5bae5d', rumble:'#7c4d29'}
};

/* NEW ROAD TYPES ADDED:
 * - leftCurve: Medium left turn with optional hill
 * - rightCurve: Medium right turn with optional hill  
 * - sharpLeftCurve: Sharp left turn (shorter distance, tighter curve)
 * - sharpRightCurve: Sharp right turn (shorter distance, tighter curve)
 * - extremeLeftCurve: Very tight left turn for challenge
 * - extremeRightCurve: Very tight right turn for challenge
 * - leftSCurves: Series of left-biased S-curves
 * - rightSCurves: Series of right-biased S-curves
 * - chicane: Quick left-right-left sequence
 * 
 * HARD TURNS (90-degree style):
 * - hardLeftTurn: 90-degree left turn after straight section
 * - hardRightTurn: 90-degree right turn after straight section
 * - tJunctionLeft: T-junction forcing hard left turn
 * - tJunctionRight: T-junction forcing hard right turn
 * 
 * CHOICE JUNCTIONS:
 * - tJunctionChoice: T-junction where player CHOOSES left or right
 * - forkInRoad: Fork where player can see both left and right paths
 * 
 * EXTREME TURNS:
 * - hairpinLeft: Extreme 180-degree left hairpin turn
 * - hairpinRight: Extreme 180-degree right hairpin turn
 */

//player assets
const playerCarData = {
	left: { src:'assets/car_left.png'},
	right:   { src:'assets/car_right.png'},
	straight: { src:'assets/car_straight.png'},
	up_left: { src:'assets/car_up_left.png'},
	up_right:   { src:'assets/car_up_right.png'},
	up_straight: { src:'assets/car_up_straight.png'}
};

//world assets
const spritesData = {
	BILLBOARD01:{src:'assets/billboard_01.png'},
	BILLBOARD02:{src:'assets/billboard_02.png'},
	BILLBOARD03:{src:'assets/billboard_03.png'},
	BUILDING1:{src:'assets/tree_01.png'}, // Tall office building
	BUILDING2:{src:'assets/tree_02.png'}, // Modern glass building
	BUILDING3:{src:'assets/tree_03.png'}, // Residential apartment building
	BUILDING4:{src:'assets/tree_04.png'}, // Industrial building
	BUILDING5:{src:'assets/tree_05.png'}, // Mixed-use building
	STREETLAMP:{src:'assets/rock_01.png'}, // Street lamp
	TRAFFICLIGHT:{src:'assets/rock_02.png'}, // Traffic light
	FIREHYDRANT:{src:'assets/rock_03.png'}, // Fire hydrant
	TRUCK01:{src:'assets/truck_01.png'},
	TRUCK02:{src:'assets/truck_02.png'},
	JEEP01:{src:'assets/jeep_01.png'},
	CAR04:{src:'assets/car_04.png'},
	CAR03:{src:'assets/car_03.png'},
	CAR02:{src:'assets/car_02.png'},
	CAR01:{src:'assets/car_01.png'},
	COIN:{src:'assets/item_power_coin.png'},
	FUEL:{src:'assets/item_power_fuel.png'}
};

spritesData.CITYSCAPE = [spritesData.BUILDING1, spritesData.BUILDING2, spritesData.BUILDING3, spritesData.BUILDING4, spritesData.BUILDING5, spritesData.STREETLAMP, spritesData.TRAFFICLIGHT, spritesData.FIREHYDRANT];
spritesData.CARS = [spritesData.CAR01, spritesData.CAR02, spritesData.CAR03, spritesData.CAR04, spritesData.JEEP01, spritesData.TRUCK01, spritesData.TRUCK02];
spritesData.BILLBOARDS = [spritesData.BILLBOARD01, spritesData.BILLBOARD02, spritesData.BILLBOARD03];

const intructionDisplayText = 'Press W,A,S,D to\ndrive the car.'; //instruction display text

//keyboard keycode
const keyboard_arr = {left:[65,37],
					right:[68,39],
					up:[87,38],
					down:[83,40]};

//powers
const scoreData = {text:'SCORE: [NUMBER]',//score display text
				coin:500} //collect coin score
				
const fuelData = {text:'FUEL:', //fuel display text
				total:100, //total fuel
				add:20, //collect fuel total
				updateTime:1, //fuel update timer
				decrease:3, //fuel decrease
				bar:{width:200, height:28, backgroundColor:'#2f2f2f', blankColor:'#fff', fillColor:'#25bf1d', space:3} //fuel bar
				};
				
//game status (text, color and font size)				
const statusData = {
				start:{text:'GO', color:'#fff', size:120},
				fuel:{text:'+FUEL', color:'#39b54a', size:70},
				score:{text:'+[NUMBER]', color:'#fcdb05', size:70},
				penalty:{text:'TIMEOUT:\n[NUMBER]', color:'#ec3e34', size:70},
				lowFuel:{text:'LOW FUEL', color:'#ff7f00', size:70},
				noFuel:{text:'OUT OF FUEL', color:'#ec3e34', size:70},
				}
				
const exitMessage = 'Are you sure\nyou want to quit?'; //go to main page message
const resultTitleText = 'GAME OVER';  //result text display
const resultScoreText = 'BEST SCORE:';  //result text display

//Social share, [SCORE] will replace with game score
const shareText = 'SHARE YOUR SCORE'; //social share message
const shareSettings = {
	enable:true,
	options:['facebook','twitter','whatsapp','telegram','reddit','linkedin'],
	shareTitle:'Highscore on Speed Racer Game is [SCORE]PTS.',
	shareText:'[SCORE]PTS is mine new highscore on Speed Racer Game! Try it now!',
	customScore:true, //share a custom score to Facebook, it use customize share.php (Facebook and PHP only)
	gtag:true //Google Tag
};
				
/*!
 *
 * GAME SETTING CUSTOMIZATION END
 *
 */
var dt;

const defaultData = {
	width:768,
	height:840,
	extraHeight:184,
	scale:0.00165,
	centrifugal:.6,
	skySpeed:0.001,
	hillSpeed:0.002,
	treeSpeed:0.003,
	skyOffset:0,
	hillOffset:0,
	treeOffset:0,
	segmentLength:200,
	trackLength:null,
	fieldOfView:100,
	cameraHeight:800,
	cameraDepth:null,
	drawDistance:300,
	playerX:0,
	playerZ:0,
	position:0,
	speed:0,
	maxSpeed:0,
	accel:0,
	breaking:0,
	decel:0,
	offRoadDecel:0,
	offRoadLimit:0,
	totalCars:200,
	lastY:0,
	turnSpeed:3.5
};
				
var worldData = {};
var segments = [];
var cars = [];
var background = null;
var sprites = null;
var resolution = null;
var currentLapTime = 0;

const roadLengthData = {length:{none:0, short:25, medium:50, long:100},
					  hill:{none:0, low:20, medium:40, high:60},
					  curve:{none:0, easy:2, medium:4, hard:6, veryHard:8, extreme:12, ninety:20}};

const playerData = {score:0, displayScore:0};
const gameData = {paused:true, fuel:0, fuelUpdate:false, accel:false, penalty:false, penaltyTime:0, brakeSound:false, accelSound:false, stopSound:false, ended:false};
const keyData = {left:false, right:false, accelerate:false, brake:false};

// T-Junction Modal System Variables
var tJunctionPendingDirection = null; // 'left', 'right', or null
var tJunctionForcedDirection = 0; // Curve value to apply
var tJunctionTriggerDistance = 0; // Distance to trigger modal
var tJunctionModalTriggered = false; // Prevent multiple triggers
var tJunctionAutoTurn = null; // Automatic turning object
var tJunctionChoiceMade = false; // Track if player has made a choice

// Quiz System Variables
var quizQuestions = []; // Array to store quiz questions from JSON
var currentQuiz = null; // Current quiz question object
var quizModalActive = false; // Track if quiz modal is showing
var pendingFuelAmount = 0; // Amount of fuel to add if quiz is correct

// Game Progress Variables
var totalQuizzes = 5; // Total number of quiz questions in the game
var quizzesCompleted = 0; // Number of quizzes completed correctly
var finishLinePosition = 3000; // Position of the finish line
var gameWon = false; // Track if player reached the finish line
var gamePaused = false; // Track if game is paused (separate from gameData.paused)

/*!
 * FINISH LINE SYSTEM
 */

// Check if player reached the finish line
function checkFinishLine() {
	if (gameWon || gamePaused) return;
	
	var currentSegment = Math.floor(defaultData.position / defaultData.segmentLength);
	
	// Check if player reached the finish line and completed all quizzes
	if (currentSegment >= finishLinePosition && quizzesCompleted >= totalQuizzes) {
		gameWon = true;
		gamePaused = true;
		gameData.paused = true;
		defaultData.speed = 0;
		
		// Trigger victory
		playSound('soundCollectFuel'); // Victory sound
		showVictoryMessage();
	}
	// Check if player reached finish line but didn't complete all quizzes
	else if (currentSegment >= finishLinePosition && quizzesCompleted < totalQuizzes) {
		// Player reached finish but failed - end game
		gamePaused = true;
		gameData.paused = true;
		defaultData.speed = 0;
		
		playSound('soundHit');
		updateGameText("You need to answer all quiz questions correctly!", "#ff0000", 30, 0);
		setTimeout(function() {
			endGame();
		}, 3000);
	}
}

// Show victory message
function showVictoryMessage() {
	updateGameText("CONGRATULATIONS! You reached the finish line!", "#00ff00", 30, 0);
	
	setTimeout(function() {
		// Show final score and end game
		updateGameText("Final Score: " + addCommas(playerData.score), "#ffff00", 25, 0);
		setTimeout(function() {
			endGame();
		}, 3000);
	}, 3000);
}

/*!
 * QUIZ SYSTEM FUNCTIONS
 */

// Load quiz questions from JSON
function loadQuizQuestions() {
	console.log('Loading quiz questions...'); // Debug log
	$.getJSON('quiz-questions.json', function(data) {
		quizQuestions = data.questions;
		console.log('Quiz questions loaded successfully:', quizQuestions.length); // Debug log
	}).fail(function() {
		console.warn('Failed to load quiz questions, using fallback');
		// Fallback questions if JSON fails to load
		quizQuestions = [
			{
				"id": 1,
				"question": "What is the capital of France?",
				"options": ["London", "Paris", "Berlin", "Madrid"],
				"correct": 1,
				"explanation": "Paris is the capital and largest city of France."
			}
		];
		console.log('Using fallback questions:', quizQuestions.length); // Debug log
	});
}

// Trigger fuel quiz when player collects fuel
function triggerFuelQuiz() {
	console.log('triggerFuelQuiz called!'); // Debug log
	console.log('Quiz questions available:', quizQuestions.length); // Debug log
	
	try {
		if (quizQuestions.length === 0) {
			console.warn('No quiz questions available, adding fuel directly');
			gameData.fuel = Math.min(gameData.fuel + 50, fuelData.total);
			playSound('soundCollectFuel');
			return;
		}
		
		// Completely pause game - stop fuel consumption and car movement
		console.log('Completely pausing game for quiz'); // Debug log
		gamePaused = true;
		gameData.paused = true; // Additional pause flag
		
		// Stop car movement by setting speed to 0
		var savedSpeed = defaultData.speed;
		defaultData.speed = 0;
		
		// Store current speed for restoration
		if (!currentQuiz) {
			currentQuiz = {savedSpeed: savedSpeed};
		} else {
			currentQuiz.savedSpeed = savedSpeed;
		}
		
		// Select random question
		var questionIndex = Math.floor(Math.random() * quizQuestions.length);
		var selectedQuestion = quizQuestions[questionIndex];
		
		// Merge question data with saved speed
		currentQuiz = Object.assign({}, selectedQuestion, {savedSpeed: savedSpeed});
		console.log('Selected quiz:', currentQuiz); // Debug log
		
		// Check if quiz UI elements exist (only A and B needed now)
		if (!quizTitleTxt || !quizQuestionTxt || !labelA || !labelB) {
			console.error('Quiz UI elements not found, adding fuel directly');
			gameData.fuel = Math.min(gameData.fuel + 50, fuelData.total);
			playSound('soundCollectFuel');
			gamePaused = false;
			gameData.paused = false;
			// Restore speed if it was saved
			if (currentQuiz && currentQuiz.savedSpeed !== undefined) {
				defaultData.speed = currentQuiz.savedSpeed;
			}
			return;
		}
		
		// Update quiz modal UI
		quizTitleTxt.text = "Fuel Quiz!";
		quizQuestionTxt.text = currentQuiz.question;
		
		// Update option buttons with quiz options (only A and B)
		labelA.text = "A. " + currentQuiz.options[0];
		labelB.text = "B. " + currentQuiz.options[1];
		
		// Show quiz modal
		console.log('Showing quiz modal'); // Debug log
		toggleQuizModal(true);
		quizModalActive = true;
		
	} catch (error) {
		console.error('Error in triggerFuelQuiz:', error);
		// Fallback: just add fuel and continue
		gameData.fuel = Math.min(gameData.fuel + 50, fuelData.total);
		playSound('soundCollectFuel');
		gamePaused = false;
		gameData.paused = false;
		quizModalActive = false;
		// Restore speed if it was saved
		if (currentQuiz && currentQuiz.savedSpeed !== undefined) {
			defaultData.speed = currentQuiz.savedSpeed;
		}
	}
}

// Check quiz answer
function checkQuizAnswer(optionIndex) {
	if (!currentQuiz) return;
	
	var isCorrect = (optionIndex === currentQuiz.correct);
	
	if (isCorrect) {
		// Correct answer - add fuel and track progress
		gameData.fuel = Math.min(gameData.fuel + 50, fuelData.total);
		quizzesCompleted++;
		playSound('soundCollectFuel');
		
		// Check if all quizzes completed
		if (quizzesCompleted >= totalQuizzes) {
			showQuizResult(true, currentQuiz.explanation + "\n\nAll quizzes completed! Head to the finish line!", true);
		} else {
			var remaining = totalQuizzes - quizzesCompleted;
			showQuizResult(true, currentQuiz.explanation + "\n\n" + remaining + " more questions to go!", true);
		}
	} else {
		// Wrong answer - no fuel, game over (fuel will run out)
		playSound('soundHit');
		showQuizResult(false, currentQuiz.explanation + "\n\nWrong answer! Your fuel is running low...", false);
	}
}

// Show quiz result
function showQuizResult(isCorrect, explanation, addedFuel) {
	var resultText = isCorrect ? "Correct!" : "Wrong!";
	var fuelText = addedFuel ? "\nFuel added!" : "\nNo fuel added.";
	
	// Update quiz modal with result
	quizTitleTxt.text = resultText;
	quizQuestionTxt.text = explanation + fuelText;
	
	// Hide option buttons and labels temporarily (only A and B)
	buttonQuizA.visible = false;
	buttonQuizB.visible = false;
	labelA.visible = false;
	labelB.visible = false;
	
	// Auto-close modal after 3 seconds
	setTimeout(function() {
		toggleQuizModal(false);
		quizModalActive = false;
		
		// Resume game with appropriate behavior
		if (addedFuel) {
			// Correct answer: resume normal game
			gamePaused = false;
			gameData.paused = false;
			// Restore saved speed
			if (currentQuiz && currentQuiz.savedSpeed !== undefined) {
				defaultData.speed = currentQuiz.savedSpeed;
			}
		} else {
			// Wrong answer: resume but keep fuel decreasing
			gamePaused = false;
			gameData.paused = false;
			// Restore saved speed
			if (currentQuiz && currentQuiz.savedSpeed !== undefined) {
				defaultData.speed = currentQuiz.savedSpeed;
			}
			// Force immediate fuel decrease for wrong answer
			setTimeout(function() {
				if (!gamePaused && defaultData.speed > 0) {
					gameData.fuel -= fuelData.decrease;
					gameData.fuel = gameData.fuel < 0 ? 0 : gameData.fuel;
					updateGameStatus();
				}
			}, 100);
		}
		
		// Reset button and label visibility (only A and B)
		buttonQuizA.visible = true;
		buttonQuizB.visible = true;
		labelA.visible = true;
		labelB.visible = true;
		
		currentQuiz = null;
	}, 3000);
}

// Toggle quiz modal visibility
function toggleQuizModal(show) {
	console.log('toggleQuizModal called with show:', show); // Debug log
	try {
		if (!quizContainer) {
			console.error('quizContainer not found');
			return;
		}
		
		if (show) {
			console.log('Showing quiz container'); // Debug log
			quizContainer.visible = true;
			quizContainer.alpha = 0;
			TweenMax.to(quizContainer, 0.5, {alpha: 1});
		} else {
			console.log('Hiding quiz container'); // Debug log
			TweenMax.to(quizContainer, 0.5, {alpha: 0, onComplete: function() {
				quizContainer.visible = false;
			}});
		}
	} catch (error) {
		console.error('Error in toggleQuizModal:', error);
	}
}

/*!
 * 
 * GAME BUTTONS - This is the function that runs to setup button event
 * 
 */
function buildGameButton(){
	$(window).focus(function() {
		if(!buttonSoundOn.visible){
			toggleSoundInMute(false);
		}

		if (typeof buttonMusicOn != "undefined") {
			if(!buttonMusicOn.visible){
				toggleMusicInMute(false);
			}
		}
	});
	
	$(window).blur(function() {
		if(!buttonSoundOn.visible){
			toggleSoundInMute(true);
		}

		if (typeof buttonMusicOn != "undefined") {
			if(!buttonMusicOn.visible){
				toggleMusicInMute(true);
			}
		}
	});

	if(audioOn){
		if(muteSoundOn){
			toggleSoundMute(true);
		}
		if(muteMusicOn){
			toggleMusicMute(true);
		}
	}

	itemTouchUp.visible = itemTouchDown.visible = itemTouchLeft.visible = itemTouchRight.visible = false;
	
	if(!isDesktop){
		itemTouchUp.visible = itemTouchDown.visible = itemTouchLeft.visible = itemTouchRight.visible = true;
		
		itemTouchUp.addEventListener("mousedown", function(evt) {
			if(gameData.paused){
				return;	
			}
			keyData.accelerate = true;
		});
		
		itemTouchUp.addEventListener("pressup", function(evt) {
			if(keyData.accelerate){
				keyData.accelerate = false;	
			}
		});
		
		itemTouchDown.addEventListener("mousedown", function(evt) {
			if(gameData.paused){
				return;	
			}
			keyData.brake = true;
		});
		
		itemTouchDown.addEventListener("pressup", function(evt) {
			if(keyData.brake){
				keyData.brake = false;	
			}
		});
		
		itemTouchLeft.addEventListener("mousedown", function(evt) {
			if(gameData.paused){
				return;	
			}
			keyData.left = true;
		});
		
		itemTouchLeft.addEventListener("pressup", function(evt) {
			if(keyData.left){
				keyData.left = false;	
			}
		});
		
		itemTouchRight.addEventListener("mousedown", function(evt) {
			if(gameData.paused){
				return;	
			}
			keyData.right = true;
		});
		
		itemTouchRight.addEventListener("pressup", function(evt) {
			if(keyData.right){
				keyData.right = false;	
			}
		});
	}else{
		var isInIframe = (window.location != window.parent.location) ? true : false;
		if(isInIframe){
			this.document.onkeydown = keydown;
			this.document.onkeyup = keyup;
		
			$(window).blur(function() {
				appendFocusFrame();
			});
			appendFocusFrame();
        }else{
            this.document.onkeydown = keydown;
			this.document.onkeyup = keyup;
        }
	}
	
	buttonStart.cursor = "pointer";
	buttonStart.addEventListener("click", function(evt) {
		playSound('soundClick');
		goPage('game');
	});
	
	if(shareSettings.enable){
		buttonShare.cursor = "pointer";
		buttonShare.addEventListener("click", function(evt) {
			playSound('soundButton');
			toggleSocialShare(true);
		});

		for(let n=0; n<shareSettings.options.length; n++){
			$.share['button'+n].cursor = "pointer";
			$.share['button'+n].addEventListener("click", function(evt) {
				shareLinks(evt.target.shareOption, addCommas(playerData.score));
			});
		}
	}
	
	buttonSoundOff.cursor = "pointer";
	buttonSoundOff.addEventListener("click", function(evt) {
		toggleSoundMute(true);
	});
	
	buttonSoundOn.cursor = "pointer";
	buttonSoundOn.addEventListener("click", function(evt) {
		toggleSoundMute(false);
	});

	if (typeof buttonMusicOff != "undefined") {
		buttonMusicOff.cursor = "pointer";
		buttonMusicOff.addEventListener("click", function(evt) {
			toggleMusicMute(true);
		});
	}
	
	if (typeof buttonMusicOn != "undefined") {
		buttonMusicOn.cursor = "pointer";
		buttonMusicOn.addEventListener("click", function(evt) {
			toggleMusicMute(false);
		});
	}
	
	buttonFullscreen.cursor = "pointer";
	buttonFullscreen.addEventListener("click", function(evt) {
		toggleFullScreen();
	});
	
	buttonExit.cursor = "pointer";
	buttonExit.addEventListener("click", function(evt) {
		playSound('soundClick');
		togglePop(true);
	});
	
	buttonSettings.cursor = "pointer";
	buttonSettings.addEventListener("click", function(evt) {
		toggleOptions();
	});
	
	buttonConfirm.cursor = "pointer";
	buttonConfirm.addEventListener("click", function(evt) {
		playSound('soundClick');
		togglePop(false);
		stopGame(true);
		goPage('main');
	});
	
	buttonCancel.cursor = "pointer";
	buttonCancel.addEventListener("click", function(evt) {
		playSound('soundClick');
		togglePop(false);
	});
	
	// T-Junction Choice Button Events
	buttonTurnLeft.cursor = "pointer";
	buttonTurnLeft.addEventListener("click", function(evt) {
		playSound('soundClick');
		tJunctionPendingDirection = 'left'; // Left button = turn left
		toggleTJunctionModal(false);
		gameData.paused = false; // Resume game
		applyTJunctionChoice();
	});
	
	buttonTurnRight.cursor = "pointer";
	buttonTurnRight.addEventListener("click", function(evt) {
		playSound('soundClick');
		tJunctionPendingDirection = 'right'; // Right button = turn right
		toggleTJunctionModal(false);
		gameData.paused = false; // Resume game
		applyTJunctionChoice();
	});
	
	// Quiz Button Events
	buttonQuizA.cursor = "pointer";
	buttonQuizA.addEventListener("click", function(evt) {
		playSound('soundClick');
		checkQuizAnswer(0);
	});
	
	buttonQuizB.cursor = "pointer";
	buttonQuizB.addEventListener("click", function(evt) {
		playSound('soundClick');
		checkQuizAnswer(1);
	});
	
	// Removed buttonQuizC and buttonQuizD event handlers - only 2 choices now
	
	buttonRestart.cursor = "pointer";
	buttonRestart.addEventListener("click", function(evt) {
		playSound('soundClick');
		resetGame();
		goPage('game');
	});

	preventScrolling();
}

function preventScrolling(){
	const inIframe = window.self !== window.top;
	if(inIframe){
		var keys = [32,38,37,40,39];
		$(window).on( "keydown", function(event) {
		if(keys.indexOf(event.keyCode) != -1){
			event.preventDefault();
		}
		});
	}
}

function appendFocusFrame(){
	$('#mainHolder').prepend('<div id="focus" style="position:absolute; width:100%; height:100%; z-index:1000;"></div');
	$('#focus').click(function(){
		$('#focus').remove();
	});	
}

/*!
 * 
 * KEYBOARD EVENTS - This is the function that runs for keyboard events
 * 
 */
function keydown(event) {
	if(gameData.paused){
		return;	
	}
	
	if(keyboard_arr.left.indexOf(event.keyCode) != -1){
		//left
		keyData.left = true;
	}
	
	if(keyboard_arr.right.indexOf(event.keyCode) != -1){
		//right
		keyData.right = true;
	}
	
	if(keyboard_arr.up.indexOf(event.keyCode) != -1){
		//up
		keyData.accelerate = true;
	}
	
	if(keyboard_arr.down.indexOf(event.keyCode) != -1){
		//down
		keyData.brake = true;
	}
}

function keyup(event) {
	if(gameData.paused){
		return;	
	}
	
	if(keyboard_arr.left.indexOf(event.keyCode) != -1 && keyData.left){
		keyData.left = false
	}
	
	if(keyboard_arr.right.indexOf(event.keyCode) != -1 && keyData.right){
		keyData.right = false;
	}
	
	if(keyboard_arr.up.indexOf(event.keyCode) != -1 && keyData.accelerate){
		keyData.accelerate = false;
	}
	
	if(keyboard_arr.down.indexOf(event.keyCode) != -1 && keyData.brake){
		keyData.brake = false;
	}
}

/*!
 * 
 * TOGGLE SOCIAL SHARE - This is the function that runs to toggle social share
 * 
 */
function toggleSocialShare(con){
	if(!shareSettings.enable){return;}
	buttonShare.visible = con == true ? false : true;
	shareSaveContainer.visible = con == true ? false : true;
	socialContainer.visible = con;

	if(con){
		if (typeof buttonSave !== 'undefined') {
			TweenMax.to(buttonShare, 3, {overwrite:true, onComplete:toggleSocialShare, onCompleteParams:[false]});
		}
	}
}

function positionShareButtons(){
	if(!shareSettings.enable){return;}
	if (typeof buttonShare !== 'undefined') {
		if (typeof buttonSave !== 'undefined') {
			if(buttonSave.visible){
				buttonShare.x = -((buttonShare.image.naturalWidth/2) + 5);
				buttonSave.x = ((buttonShare.image.naturalWidth/2) + 5);
			}else{
				buttonShare.x = 0;
			}
		}
	}
}

/*!
 * 
 * DISPLAY PAGES - This is the function that runs to display pages
 * 
 */
var curPage=''
function goPage(page){
	curPage=page;
	
	mainContainer.visible = false;
	gameContainer.visible = false;
	resultContainer.visible = false;
	toggleOptions(false);
	
	TweenMax.killTweensOf(playerData);
	
	var targetContainer = null;
	switch(page){
		case 'main':
			targetContainer = mainContainer;
			resetGame();
		break;
		
		case 'game':
			targetContainer = gameContainer;
			startGame();
		break;
		
		case 'result':
			targetContainer = resultContainer;
			toggleSocialShare(false);
			stopGame(true);
			playSound('soundOver');

			TweenMax.to(playerData, 1, {displayScore:playerData.score, overwrite:true, onUpdate:function(){
				resultScoreTxt.text = addCommas(Math.floor(playerData.displayScore));
				resultScoreShadowTxt.text = addCommas(Math.floor(playerData.displayScore));
			}});
			
			saveGame(playerData.score);
		break;
	}
	
	if(targetContainer != null){
		targetContainer.visible = true;
		targetContainer.alpha = 0;
		TweenMax.to(targetContainer, .5, {alpha:1, overwrite:true});
	}
	
	resizeCanvas();
}

function togglePop(con){
	exitContainer.visible = con;
	
	if(con){
		TweenMax.pauseAll(true, true);
		gameData.paused = true;
	}else{
		TweenMax.resumeAll(true, true);
		if(curPage == 'game'){
			gameData.paused = false;
		}
	}
}

/*!
 * 
 * TOGGLE T-JUNCTION MODAL - This function shows/hides the T-junction choice modal
 * 
 */
function toggleTJunctionModal(con){
	tJunctionContainer.visible = con;
	
	if(con){
		TweenMax.pauseAll(true, true);
		gameData.paused = true;
		// Add visual effect to make modal stand out
		tJunctionContainer.alpha = 0;
		TweenMax.to(tJunctionContainer, 0.3, {alpha:1, overwrite:true});
	}else{
		TweenMax.resumeAll(true, true);
		if(curPage == 'game'){
			gameData.paused = false;
		}
	}
}

/*!
 * 
 * APPLY T-JUNCTION CHOICE - This function applies the player's direction choice
 * 
 */
function applyTJunctionChoice(){
	if(tJunctionPendingDirection == 'left'){
		// Create sharp 90-degree left turn after the junction
		addRoad(defaultData.segmentLength, defaultData.segmentLength, 0, roadLengthData.curve.ninety, 0); // Sharp 90° left turn
		addRoad(defaultData.segmentLength, defaultData.segmentLength, 0, roadLengthData.curve.ninety, 0); // Continue left
		addRoad(defaultData.segmentLength, defaultData.segmentLength, 0, roadLengthData.curve.hard, 0); // Ease out
		addRoad(defaultData.segmentLength, defaultData.segmentLength, 0, 0, 0); // Straight
		
		// Set up automatic left turning
		tJunctionAutoTurn = {
			direction: 'left',
			startPosition: defaultData.position + (defaultData.segmentLength * 2),
			duration: 2.0, // seconds to complete the turn
			active: false,
			startTime: 0,
			originalSpeed: 0
		};
		
		// Add more road segments to continue the track
		for (var i = 0; i < 30; i++) {
			addRoadType();
		}
		
	}else if(tJunctionPendingDirection == 'right'){
		// Create sharp 90-degree right turn after the junction  
		addRoad(defaultData.segmentLength, defaultData.segmentLength, 0, -roadLengthData.curve.ninety, 0); // Sharp 90° right turn
		addRoad(defaultData.segmentLength, defaultData.segmentLength, 0, -roadLengthData.curve.ninety, 0); // Continue right
		addRoad(defaultData.segmentLength, defaultData.segmentLength, 0, -roadLengthData.curve.hard, 0); // Ease out
		addRoad(defaultData.segmentLength, defaultData.segmentLength, 0, 0, 0); // Straight
		
		// Set up automatic right turning
		tJunctionAutoTurn = {
			direction: 'right',
			startPosition: defaultData.position + (defaultData.segmentLength * 2),
			duration: 2.0, // seconds to complete the turn
			active: false,
			startTime: 0,
			originalSpeed: 0
		};
		
		// Add more road segments to continue the track
		for (var i = 0; i < 30; i++) {
			addRoadType();
		}
	}
	
	// Mark choice as made and clear pending direction
	tJunctionChoiceMade = true;
	tJunctionPendingDirection = null;
	
	// Reset T-junction state after some time
	setTimeout(function() {
		tJunctionModalTriggered = false;
		tJunctionChoiceMade = false;
	}, 10000); // Reset after 10 seconds
}

/*!
 * 
 * START GAME - This is the function that runs to start play game
 * 
 */

function startGame(){
	playerData.score = 0;
	gameData.fuel = fuelData.total;
	gameData.fuelUpdate = false;
	gameData.paused = setGameLaunch();
	gameData.accel = false;
	gameData.penalty = false;
	gameData.brakeSound = false;
	gameData.accelSound = false;
	gameData.stopSound = false;
	gameData.ended = false;
	
	// Reset T-junction variables
	tJunctionPendingDirection = null;
	tJunctionForcedDirection = 0;
	tJunctionModalTriggered = false;
	tJunctionAutoTurn = null;
	
	// Initialize quiz and progress system
	try {
		// Only initialize quiz if UI elements are ready
		if (typeof quizContainer !== 'undefined' && quizContainer) {
			if (quizQuestions.length === 0) {
				loadQuizQuestions();
			}
			quizModalActive = false;
			currentQuiz = null;
			
			// Reset progress variables
			quizzesCompleted = 0;
			gameWon = false;
			gamePaused = false;
			
			console.log('Quiz system initialized successfully');
		} else {
			console.warn('Quiz container not ready, skipping quiz initialization');
		}
	} catch (error) {
		console.error('Error initializing quiz system:', error);
		// Set fallback to prevent game from breaking
		quizQuestions = [];
		quizModalActive = false;
		currentQuiz = null;
		quizzesCompleted = 0;
		gameWon = false;
		gamePaused = false;
	}
	
	defaultData.playerX = 0;
	defaultData.speed = 0;
	
	instructionShadowTxt.visible = instructionTxt.visible = false;
	if(!isDesktop){
		
	}else{
		instructionShadowTxt.visible = instructionTxt.visible = true;
	}
	
	updateGameText(statusData.start.text, statusData.start.color, statusData.start.size, 0);
	updateGameStatus();
}

 /*!
 * 
 * STOP GAME - This is the function that runs to stop play game
 * 
 */
function stopGame(){
	gameData.paused = true;
	TweenMax.killAll();
}

/*!
 * 
 * SAVE GAME - This is the function that runs to save game
 * 
 */
function saveGame(score){
	if ( typeof toggleScoreboardSave == 'function' ) { 
		$.scoreData.score = score;
		if(typeof type != 'undefined'){
			$.scoreData.type = type;	
		}
		toggleScoreboardSave(true);
	}

	/*$.ajax({
      type: "POST",
      url: 'saveResults.php',
      data: {score:score},
      success: function (result) {
          console.log(result);
      }
    });*/
}

/*!
 * 
 * LOOP UPDATE GAME - This is the function that runs to update game loop
 * 
 */
function updateGame(){
	updateWorld();
	updateFuel();
	
	if(!gameData.paused){
		if(defaultData.speed > 0){
			if(gameData.penalty){
				gameData.penalty = false;
				togglePenaltyTimer(false);
			}
			
			if(!gameData.accel){
				gameData.accel = true;
				instructionShadowTxt.visible = instructionTxt.visible = false;
				updateGameText('');
			}
		}
		
		//timeout
		if(defaultData.speed == 0 && gameData.accel && !gameData.penalty){
			gameData.penalty = true;
			togglePenaltyTimer(true);
		}
		
		playerData.score += Math.floor((5 * Math.round(defaultData.speed/500)) * .03);
		updateGameStatus();
	}
}

/*!
 * 
 * UPDATE FUEL - This is the function that runs to update game fuel
 * 
 */
function updateFuel(){
	// Re-enabled fuel system for quiz collection - but respect quiz pause
	if(defaultData.speed > 0 && !gameData.fuelUpdate && !gameData.paused && !quizModalActive){
		gameData.fuelUpdate = true;
		TweenMax.to(fuelData, fuelData.updateTime, {overwrite:true, onComplete:function(){
			// Double-check we're not paused before decreasing fuel
			if (!gameData.paused && !quizModalActive) {
				gameData.fuel -= fuelData.decrease;
				gameData.fuel = gameData.fuel < 0 ? 0 : gameData.fuel;
			}
			gameData.fuelUpdate = false;
			
			updateGameStatus();
		}});
	}
}

/*!
 * 
 * TOGGLE GAME PENALTY - This is the function that runs to toggle game penalty
 * 
 */
function togglePenaltyTimer(con){
	if(con){
		gameData.penaltyTime = 41;
		updatePenaltyTimer();
	}else{
		TweenMax.killTweensOf(gameContainer);
		updateGameText('');	
	}
}

function updatePenaltyTimer(){
	gameData.penaltyTime -= 1;
	
	var displayPenaltyTimer = false;
	if(gameData.penaltyTime < 31){
		displayPenaltyTimer = true;
	}
	
	if(String(gameData.penaltyTime*.1).indexOf(".") == -1 && displayPenaltyTimer){
		playSound('soundTick');	
	}
	
	if(gameData.penaltyTime <= 0){
		updateGameText(statusData.penalty.text.replace('[NUMBER]','0.00'), statusData.penalty.color, statusData.penalty.size, 0);
		playSound('soundTickOver');
		endGame();
	}else{
		if(displayPenaltyTimer){
			var curPenaltyTime = (String(gameData.penaltyTime*.1)+'000').substring(0,4);
			updateGameText(statusData.penalty.text.replace('[NUMBER]',curPenaltyTime), statusData.penalty.color, statusData.penalty.size, 0);
		}
		TweenMax.to(gameContainer, .1, {overwrite:true, onComplete:updatePenaltyTimer});
	}
}

/*!
 * 
 * UPDATE WORLD - This is the function that runs to update game world
 * 
 */
function updateWorld(){
	updateSprites();
	
	// Check if player reached the finish line
	checkFinishLine();
	
	renderWorld();	
}

/*!
 * 
 * CHECK T-JUNCTION TRIGGER - This function checks if player is approaching a T-junction
 * 
 */
function checkTJunctionTrigger(playerSegment) {
	// Debug: Log current position every 100 segments
	if (Math.floor(defaultData.position / defaultData.segmentLength) % 100 === 0) {
		console.log('Current position:', defaultData.position, 'Segment:', Math.floor(defaultData.position / defaultData.segmentLength));
	}
	
	// Look ahead for T-junction trigger segments (check multiple distances)
	for (var lookDistance = 1; lookDistance <= 5; lookDistance++) {
		var lookAheadDistance = defaultData.segmentLength * lookDistance;
		var lookAheadPosition = defaultData.position + lookAheadDistance;
		var lookAheadSegment = findSegment(lookAheadPosition);
		
		// Check if the upcoming segment is a T-junction trigger point
		if (lookAheadSegment && lookAheadSegment.tJunctionTrigger && !tJunctionModalTriggered && !gameData.paused) {
			console.log('T-junction trigger detected at distance', lookDistance, '! Showing modal...');
			tJunctionModalTriggered = true;
			// Pause the game and show modal
			gameData.paused = true;
			toggleTJunctionModal(true);
			break; // Stop checking once we find a trigger
		}
	}
	
	// Check if player reached the end without making a choice (force stop)
	if (playerSegment && playerSegment.tJunctionEnd && !tJunctionChoiceMade) {
		console.log('Player reached T-junction end! Forcing complete stop...');
		// Force complete stop immediately
		defaultData.speed = 0;
		
		// If modal failed to show, show a browser alert as backup
		if (!tJunctionModalTriggered) {
			console.log('Modal failed to trigger, using backup alert...');
			tJunctionModalTriggered = true;
			var choice = confirm('DEAD END! T-Junction ahead!\n\nClick OK to turn LEFT\nClick Cancel to turn RIGHT');
			if (choice) {
				tJunctionPendingDirection = 'left';
			} else {
				tJunctionPendingDirection = 'right';
			}
			applyTJunctionChoice();
		}
	}
	
	// Also slow down when approaching the junction (within 3 segments)
	for (var checkDistance = 1; checkDistance <= 3; checkDistance++) {
		var checkPosition = defaultData.position + (defaultData.segmentLength * checkDistance);
		var checkSegment = findSegment(checkPosition);
		if (checkSegment && checkSegment.tJunctionEnd && !tJunctionChoiceMade) {
			// Gradually slow down as we approach
			var slowdownFactor = 0.8 - (checkDistance * 0.1); // Closer = slower
			defaultData.speed = Math.max(defaultData.speed * slowdownFactor, defaultData.speed * 0.5);
			console.log('Approaching T-junction, slowing down. Distance:', checkDistance, 'Speed:', defaultData.speed);
			break;
		}
	}
	
	// Handle automatic turning when reaching the junction
	if (tJunctionAutoTurn && !tJunctionAutoTurn.active) {
		if (defaultData.position >= tJunctionAutoTurn.startPosition) {
			console.log('Starting automatic turn:', tJunctionAutoTurn.direction);
			tJunctionAutoTurn.active = true;
			tJunctionAutoTurn.startTime = Date.now();
			tJunctionAutoTurn.originalSpeed = defaultData.speed;
			// Slow down for the sharp turn
			defaultData.speed = defaultData.speed * 0.4;
			// Force the car to turn automatically
			if (tJunctionAutoTurn.direction === 'left') {
				keyData.left = true;
				keyData.right = false;
			} else {
				keyData.right = true;
				keyData.left = false;
			}
		}
	}
	
	// Handle ongoing automatic turn
	if (tJunctionAutoTurn && tJunctionAutoTurn.active) {
		var turnProgress = (Date.now() - tJunctionAutoTurn.startTime) / (tJunctionAutoTurn.duration * 1000);
		if (turnProgress >= 1.0) {
			console.log('Automatic turn completed');
			// Turn completed - restore speed and stop turning
			keyData.left = false;
			keyData.right = false;
			defaultData.speed = tJunctionAutoTurn.originalSpeed;
			tJunctionAutoTurn = null;
		} else {
			// During turn, keep forcing the direction
			if (tJunctionAutoTurn.direction === 'left') {
				keyData.left = true;
			} else {
				keyData.right = true;
			}
		}
	}
}

function updateSprites() {
  	var n, car, carW, sprite, spriteW;
	var dt = (1/60);
	var playerSegment = findSegment((defaultData.position+defaultData.playerZ));
	var playerW = playerCarData.straight.w * defaultData.scale;
	var speedPercent  = defaultData.speed/worldData.maxSpeed;
	var dx = dt * defaultData.turnSpeed * speedPercent;
	var startPosition = defaultData.position;
	
	// Check for T-junction trigger
	checkTJunctionTrigger(playerSegment);
	
	updateCars(dt, playerSegment, playerW);
	
	defaultData.position = getIncrease(defaultData.position, dt * defaultData.speed, defaultData.trackLength);
	
	if (keyData.left){
		defaultData.playerX = defaultData.playerX - dx;
	}else if (keyData.right){
		defaultData.playerX = defaultData.playerX + dx;
	}
	defaultData.playerX = defaultData.playerX - (dx * speedPercent * playerSegment.curve * defaultData.centrifugal);
	
	if (keyData.accelerate){
		defaultData.speed = getAccelerate(defaultData.speed, worldData.accel, dt);
	}else if (keyData.brake){
		defaultData.speed = getAccelerate(defaultData.speed, defaultData.breaking, dt);
	}else{
		defaultData.speed = getAccelerate(defaultData.speed, defaultData.decel, dt);
	}
	
	if ((defaultData.playerX < -1) || (defaultData.playerX > 1)) {
		if (defaultData.speed > defaultData.offRoadLimit)
			defaultData.speed = getAccelerate(defaultData.speed, defaultData.offRoadDecel, dt);
		
		for(n = 0 ; n < playerSegment.sprites.length ; n++) {
			sprite  = playerSegment.sprites[n];
			spriteW = sprite.source.w * defaultData.scale;
			if (getOverlap(defaultData.playerX, playerW, sprite.offset + spriteW/2 * (sprite.offset > 0 ? 1 : -1), spriteW)) {
				defaultData.speed = worldData.maxSpeed/5;
				defaultData.position = getIncrease(playerSegment.p1.world.z, -defaultData.playerZ, defaultData.trackLength);
				break;
			}
		}
	}
	
	//powers
	if(!gameData.paused){
		for(n = 0 ; n < playerSegment.sprites.length ; n++) {
			sprite  = playerSegment.sprites[n];
			if(sprite.active){
				spriteW = sprite.source.w * defaultData.scale;
				if(getOverlap(defaultData.playerX, playerW, sprite.offset + spriteW/2 * (sprite.offset > 0 ? 1 : -1), spriteW)) {
					if(sprite.source.id == 'COIN'){
						sprite.active = false;
						addScore();
					}else if(sprite.source.id == 'FUEL'){
						console.log('FUEL collision detected!'); // Debug log
						sprite.active = false;
						
						// Enable quiz system
						if (typeof triggerFuelQuiz === 'function') {
							triggerFuelQuiz();
						} else {
							// Fallback: add fuel directly
							gameData.fuel = Math.min(gameData.fuel + 50, fuelData.total);
							playSound('soundCollectFuel');
						}
					}
				}	
			}
		}
	}
	
	playCarSound();

	for(n = 0 ; n < playerSegment.cars.length ; n++) {
		car  = playerSegment.cars[n];
		carW = car.sprite.w * defaultData.scale;
		if (defaultData.speed > car.speed) {
			if (getOverlap(defaultData.playerX, playerW, car.offset, carW, 0.8)) {
				playSound('soundImpact');
				defaultData.speed    = car.speed * (car.speed/defaultData.speed);
				defaultData.position = getIncrease(car.z, -defaultData.playerZ, defaultData.trackLength);
				break;
			}
		}
	}

	defaultData.playerX = getLimit(defaultData.playerX, -2, 2);// dont ever let it go too far out of bound
	defaultData.speed = getLimit(defaultData.speed, 0, worldData.maxSpeed); // or exceed defaultData.maxSpeed
	
	defaultData.skyOffset  = getIncrease(defaultData.skyOffset,  defaultData.skySpeed  * playerSegment.curve * (defaultData.position-startPosition)/defaultData.segmentLength, 1);
	defaultData.hillOffset = getIncrease(defaultData.hillOffset, defaultData.hillSpeed * playerSegment.curve * (defaultData.position-startPosition)/defaultData.segmentLength, 1);
	defaultData.treeOffset = getIncrease(defaultData.treeOffset, defaultData.treeSpeed * playerSegment.curve * (defaultData.position-startPosition)/defaultData.segmentLength, 1);

	if (defaultData.position > defaultData.playerZ) {
		if (currentLapTime && (startPosition < defaultData.playerZ)) {
			resetCollectItems();
		}else {
          currentLapTime += dt;
        }
	}
}

function playCarSound(){
	gameData.brakeSound = false;
	if(keyData.left || keyData.right || keyData.brake){
		gameData.brakeSound = true;
	}
	
	if(keyData.accelerate){
		if(!gameData.accelSound){
			gameData.accelSound = true;
			playSoundID('soundSpeedUp', loopCarEngine);
			stopSoundID('soundSlowDown');
		}
	}else{
		if(gameData.accelSound){
			gameData.accelSound = false;
			stopSoundID('soundSpeedUp');
			playSoundID('soundSlowDown');
			stopSoundLoop('soundEngine');
		}
	}
	
	if(gameData.brakeSound && defaultData.speed > 0){
		playSoundLoop('soundBrake');
	}else{
		stopSoundLoop('soundBrake')	;
	}	
}

function loopCarEngine(){
	playSoundLoop('soundEngine');
}

function updateCars(dt, playerSegment, playerW) {
	var n, car, oldSegment, newSegment;
	for(n = 0 ; n < cars.length ; n++) {
		car         = cars[n];
		oldSegment  = findSegment(car.z);
		car.offset  = car.offset + updateCarOffset(car, oldSegment, playerSegment, playerW);
		car.z       = getIncrease(car.z, dt * car.speed, defaultData.trackLength);
		car.percent = percentRemaining(car.z, defaultData.segmentLength);
		newSegment  = findSegment(car.z);
		
		if (oldSegment != newSegment) {
			index = oldSegment.cars.indexOf(car);
			oldSegment.cars.splice(index, 1);
			newSegment.cars.push(car);
		}
	}
}

function updateCarOffset(car, carSegment, playerSegment, playerW) {
	var i, j, dir, segment, otherCar, otherCarW, lookahead = 20, carW = car.sprite.w * defaultData.scale;
	if ((carSegment.index - playerSegment.index) > defaultData.drawDistance)
		return 0;

	for(i = 1 ; i < lookahead ; i++) {
		segment = segments[(carSegment.index+i)%segments.length];

		if ((segment === playerSegment) && (car.speed > defaultData.speed) && (getOverlap(defaultData.playerX, playerW, car.offset, carW, 1.2))) {
			if (defaultData.playerX > 0.5)
				dir = -1;
			else if (defaultData.playerX < -0.5)
				dir = 1;
			else
				dir = (car.offset > defaultData.playerX) ? 1 : -1;
				return dir * 1/i * (car.speed-defaultData.speed)/worldData.maxSpeed;
		}

		for(j = 0 ; j < segment.cars.length ; j++) {
			otherCar  = segment.cars[j];
			otherCarW = otherCar.sprite.w * defaultData.scale;
			if ((car.speed > otherCar.speed) && getOverlap(car.offset, carW, otherCar.offset, otherCarW, 1.2)) {
				if (otherCar.offset > 0.5)
					dir = -1;
				else if (otherCar.offset < -0.5)
					dir = 1;
				else
					dir = (car.offset > otherCar.offset) ? 1 : -1;
					return dir * 1/i * (car.speed-otherCar.speed)/worldData.maxSpeed;
			}
		}
	}

	if (car.offset < -0.9)
		return 0.1;
	else if (car.offset > 0.9)
		return -0.1;
	else
		return 0;
}

/*!
 * 
 * RENDER WORLD - This is the function that runs to update render world
 * 
 */
function renderWorld() {
	var baseSegment   = findSegment(defaultData.position);
	var basePercent   = percentRemaining(defaultData.position, defaultData.segmentLength);
	var playerSegment = findSegment(defaultData.position+defaultData.playerZ);
	var playerPercent = percentRemaining(defaultData.position+defaultData.playerZ, defaultData.segmentLength);
	var playerY       = getInterpolate(playerSegment.p1.world.y, playerSegment.p2.world.y, playerPercent);
	var maxy          = defaultData.height+defaultData.extraHeight;
	
	var x  = 0;
	var dx = - (baseSegment.curve * basePercent);
	
	worldContainer.removeAllChildren();
	
	renderBackground(background, defaultData.width, defaultData.height, backgroundData.sky,   defaultData.skyOffset,  resolution * defaultData.skySpeed  * playerY);
	renderBackground(background, defaultData.width, defaultData.height, backgroundData.hills, defaultData.hillOffset, resolution * defaultData.hillSpeed * playerY);
	renderBackground(background, defaultData.width, defaultData.height, backgroundData.trees, defaultData.treeOffset, resolution * defaultData.treeSpeed * playerY);

  	var n, i, segment, car, sprite, spriteScale, spriteX, spriteY;
	
	for(n = 0 ; n < defaultData.drawDistance ; n++) {
		segment        = segments[(baseSegment.index + n) % segments.length];
		segment.looped = segment.index < baseSegment.index;
		segment.fog    = exponentialFog(n/defaultData.drawDistance, roadData.fogDensity);
		segment.clip   = maxy;
		
		getProject(segment.p1, (defaultData.playerX * roadData.width) - x,      playerY + worldData.cameraHeight, defaultData.position - (segment.looped ? defaultData.trackLength : 0), defaultData.cameraDepth, defaultData.width, defaultData.height, roadData.width);
		getProject(segment.p2, (defaultData.playerX * roadData.width) - x - dx, playerY + worldData.cameraHeight, defaultData.position - (segment.looped ? defaultData.trackLength : 0), defaultData.cameraDepth, defaultData.width, defaultData.height, roadData.width);
		
		x  = x + dx;
		dx = dx + segment.curve;
		
		if ((segment.p1.camera.z <= defaultData.cameraDepth)         || // behind us
			(segment.p2.screen.y >= segment.p1.screen.y) || // back face cull
			(segment.p2.screen.y >= maxy))                  // clip by (already rendered) hill
		  continue;
		
		defaultData.lastY = segment.p1.screen.y;
		renderSegment(defaultData.width, roadData.lanes,
					   segment.p1.screen.x,
					   segment.p1.screen.y,
					   segment.p1.screen.w,
					   segment.p2.screen.x,
					   segment.p2.screen.y,
					   segment.p2.screen.w,
					   segment.fog,
					   segment.color);
		
		maxy = segment.p1.screen.y;
	}
	
  	for(n = (defaultData.drawDistance-1) ; n > 0 ; n--) {
		segment = segments[(baseSegment.index + n) % segments.length];
		
		for(i = 0 ; i < segment.cars.length ; i++) {
			car         = segment.cars[i];
			sprite      = car.sprite;
			spriteScale = getInterpolate(segment.p1.screen.scale, segment.p2.screen.scale, car.percent);
			spriteX     = getInterpolate(segment.p1.screen.x,     segment.p2.screen.x,     car.percent) + (spriteScale * car.offset * roadData.width * defaultData.width/2);
			spriteY     = getInterpolate(segment.p1.screen.y,     segment.p2.screen.y,     car.percent);
			renderSprite(defaultData.width, defaultData.height, resolution, roadData.width, sprites, car.sprite, spriteScale, spriteX, spriteY, -0.5, -1, segment.clip);
		}
	
		for(i = 0 ; i < segment.sprites.length ; i++) {
			sprite      = segment.sprites[i];
			spriteScale = segment.p1.screen.scale;
			spriteX     = segment.p1.screen.x + (spriteScale * sprite.offset * roadData.width * defaultData.width/2);
			spriteY     = segment.p1.screen.y;
			
			if(sprite.active)
				renderSprite(defaultData.width, defaultData.height, resolution, roadData.width, sprites, sprite.source, spriteScale, spriteX, spriteY, (sprite.offset < 0 ? -1 : 0), -1, segment.clip);
		}

		if(segment == playerSegment) {
			renderPlayer(defaultData.width, defaultData.height, resolution, roadData.width, sprites, defaultData.speed/worldData.maxSpeed,
						defaultData.cameraDepth/defaultData.playerZ,
						defaultData.width/2,
						(defaultData.height/2) - (defaultData.cameraDepth/defaultData.playerZ * getInterpolate(playerSegment.p1.camera.y, playerSegment.p2.camera.y, playerPercent) * defaultData.height/2),
						defaultData.speed * (keyData.left ? -1 : keyData.right ? 1 : 0),
						playerSegment.p2.world.y - playerSegment.p1.world.y);
		}
  	}
}

function findSegment(z) {
	return segments[Math.floor(z/defaultData.segmentLength) % segments.length]; 
}


/*!
 * 
 * BUILD ROAD - This is the function that runs to build road
 * 
 */
function getLastY() {
	return (segments.length == 0) ? 0 : segments[segments.length-1].p2.world.y;
}

function addSegment(curve, y) {
  var n = segments.length;
  segments.push({
	  index: n,
		 p1: { world: { y: getLastY(), z:  n   *defaultData.segmentLength }, camera: {}, screen: {} },
		 p2: { world: { y: y,       z: (n+1)*defaultData.segmentLength }, camera: {}, screen: {} },
	  curve: curve,
	sprites: [],
	   cars: [],
	  color: Math.floor(n/roadData.rumbleLength)%2 ? roadData.dark : roadData.light
  });
}

function addSprite(n, sprite, offset) {
	segments[n].sprites.push({ source: sprite, offset: offset, active:true});
}

function addRoad(enter, hold, leave, curve, y) {
	var startY   = getLastY();
	var endY     = startY + (toInt(y, 0) * defaultData.segmentLength);
	var n, total = enter + hold + leave;
	for(n = 0 ; n < enter ; n++)
		addSegment(easeIn(0, curve, n/enter), easeInOut(startY, endY, n/total));
	for(n = 0 ; n < hold  ; n++)
		addSegment(curve, easeInOut(startY, endY, (enter+n)/total));
	for(n = 0 ; n < leave ; n++)
		addSegment(easeInOut(curve, 0, n/leave), easeInOut(startY, endY, (enter+hold+n)/total));
}

function addRoadType(type, num, height, curve){
	
	switch(type){
		case 'straight':
			num = num || roadLengthData.length.medium;
			addRoad(num, num, num, 0, 0);
		break;
		
		case 'hill':
			num    = num    || roadLengthData.length.medium;
  			height = height || roadLengthData.hill.medium;
			curve = 0;
			addRoad(num, num, num, 0, height);
		break;
		
		case 'curve':
			num    = num    || roadLengthData.length.medium;
			curve  = curve  || roadLengthData.curve.medium;
			height = height || roadLengthData.hill.none;
			addRoad(num, num, num, curve, height);
		break;
		
		case 'leftCurve':
			num    = num    || roadLengthData.length.medium;
			curve  = curve  || roadLengthData.curve.medium;
			height = height || roadLengthData.hill.none;
			addRoad(num, num, num, -Math.abs(curve), height);
		break;
		
		case 'rightCurve':
			num    = num    || roadLengthData.length.medium;
			curve  = curve  || roadLengthData.curve.medium;
			height = height || roadLengthData.hill.none;
			addRoad(num, num, num, Math.abs(curve), height);
		break;
		
		case 'sharpLeftCurve':
			num    = num    || roadLengthData.length.short;
			curve  = curve  || roadLengthData.curve.hard;
			height = height || roadLengthData.hill.none;
			addRoad(num, num, num, -Math.abs(curve), height);
		break;
		
		case 'sharpRightCurve':
			num    = num    || roadLengthData.length.short;
			curve  = curve  || roadLengthData.curve.hard;
			height = height || roadLengthData.hill.none;
			addRoad(num, num, num, Math.abs(curve), height);
		break;
		
		case 'extremeLeftCurve':
			num    = num    || roadLengthData.length.short;
			curve  = curve  || roadLengthData.curve.veryHard;
			height = height || roadLengthData.hill.none;
			addRoad(num, num, num, -Math.abs(curve), height);
		break;
		
		case 'extremeRightCurve':
			num    = num    || roadLengthData.length.short;
			curve  = curve  || roadLengthData.curve.veryHard;
			height = height || roadLengthData.hill.none;
			addRoad(num, num, num, Math.abs(curve), height);
		break;
		
		case 'lowRollingHills':
			num    = num    || roadLengthData.length.short;
			height = height || roadLengthData.hill.low;
			addRoad(num, num, num,  0,                height/2);
			addRoad(num, num, num,  0,               -height);
			addRoad(num, num, num,  roadLengthData.curve.easy,  height);
			addRoad(num, num, num,  0,                0);
			addRoad(num, num, num, -roadLengthData.curve.easy,  height/2);
			addRoad(num, num, num,  0,                0);
		break;
		
		case 'sCurves':
			addRoad(roadLengthData.length.medium, roadLengthData.length.medium, roadLengthData.length.medium,  -roadLengthData.curve.easy,    roadLengthData.hill.none);
			addRoad(roadLengthData.length.medium, roadLengthData.length.medium, roadLengthData.length.medium,   roadLengthData.curve.medium,  roadLengthData.hill.medium);
			addRoad(roadLengthData.length.medium, roadLengthData.length.medium, roadLengthData.length.medium,   roadLengthData.curve.easy,   -roadLengthData.hill.low);
			addRoad(roadLengthData.length.medium, roadLengthData.length.medium, roadLengthData.length.medium,  -roadLengthData.curve.easy,    roadLengthData.hill.medium);
			addRoad(roadLengthData.length.medium, roadLengthData.length.medium, roadLengthData.length.medium,  -roadLengthData.curve.medium, -roadLengthData.hill.medium);
		break;
		
		case 'leftSCurves':
			addRoad(roadLengthData.length.medium, roadLengthData.length.medium, roadLengthData.length.medium,  -roadLengthData.curve.medium,    roadLengthData.hill.none);
			addRoad(roadLengthData.length.medium, roadLengthData.length.medium, roadLengthData.length.medium,   roadLengthData.curve.easy,  roadLengthData.hill.low);
			addRoad(roadLengthData.length.medium, roadLengthData.length.medium, roadLengthData.length.medium,  -roadLengthData.curve.hard,   roadLengthData.hill.medium);
		break;
		
		case 'rightSCurves':
			addRoad(roadLengthData.length.medium, roadLengthData.length.medium, roadLengthData.length.medium,   roadLengthData.curve.medium,    roadLengthData.hill.none);
			addRoad(roadLengthData.length.medium, roadLengthData.length.medium, roadLengthData.length.medium,  -roadLengthData.curve.easy,  roadLengthData.hill.low);
			addRoad(roadLengthData.length.medium, roadLengthData.length.medium, roadLengthData.length.medium,   roadLengthData.curve.hard,   roadLengthData.hill.medium);
		break;
		
		case 'chicane':
			num    = num    || roadLengthData.length.short;
			addRoad(num, num, num, roadLengthData.curve.medium, 0);
			addRoad(num, num, num, -roadLengthData.curve.medium, 0);
			addRoad(num, num, num, roadLengthData.curve.medium, 0);
		break;
		
		case 'hardLeftTurn':
			// Sharp 90-degree left turn after straight section
			num = num || roadLengthData.length.short;
			addRoad(num*2, num*2, num*2, 0, 0); // Long straight approach
			addRoad(num/2, num, num*2, -roadLengthData.curve.ninety, 0); // Sharp left turn
		break;
		
		case 'hardRightTurn':
			// Sharp 90-degree right turn after straight section  
			num = num || roadLengthData.length.short;
			addRoad(num*2, num*2, num*2, 0, 0); // Long straight approach
			addRoad(num/2, num, num*2, roadLengthData.curve.ninety, 0); // Sharp right turn
		break;
		
		case 'tJunctionLeft':
			// T-junction forcing left turn
			num = num || roadLengthData.length.medium;
			addRoad(num*3, num*3, num*3, 0, 0); // Long straight approach
			addRoad(num/3, num/2, num, -roadLengthData.curve.extreme, 0); // Force left
		break;
		
		case 'tJunctionRight':
			// T-junction forcing right turn
			num = num || roadLengthData.length.medium;
			addRoad(num*3, num*3, num*3, 0, 0); // Long straight approach  
			addRoad(num/3, num/2, num, roadLengthData.curve.extreme, 0); // Force right
		break;
		
		case 'tJunctionChoice':
			// T-junction where player can choose left or right via modal
			console.log('Generating T-junction choice road');
			num = num || roadLengthData.length.medium;
			var approachLength = num*2;
			
			// Create approach road - normal width
			addRoad(approachLength, approachLength, approachLength, 0, 0); // Straight approach
			addRoad(num/2, num/2, num/2, 0, 0); // Warning section
			
			// Create narrowing section - road gets narrower to show it's ending
			addRoad(num/4, num/4, num/4, 0, 0); // Start narrowing
			addRoad(num/8, num/8, num/8, 0, 0); // More narrow
			
			// Mark the T-junction trigger point (before the actual junction)
			var triggerSegmentIndex = segments.length;
			addRoad(num/8, num/8, num/8, 0, 0); // Very narrow trigger segment
			segments[triggerSegmentIndex].tJunctionTrigger = true;
			console.log('Created T-junction trigger at segment', triggerSegmentIndex);
			
			// Create the actual T-junction end point - road completely blocked
			var junctionSegmentIndex = segments.length;
			addRoad(num/16, num/16, num/16, 0, 0); // Tiny final segment (dead end)
			segments[junctionSegmentIndex].tJunctionEnd = true;
			segments[junctionSegmentIndex].roadBlocked = true; // Mark as blocked
			console.log('Created T-junction end at segment', junctionSegmentIndex);
			
			// Add massive rock barriers across the entire road to create visual dead end
			addSprite(junctionSegmentIndex, spritesData.ROCK1, 0);      // Center barrier
			addSprite(junctionSegmentIndex, spritesData.ROCK2, 0.5);    // Right center
			addSprite(junctionSegmentIndex, spritesData.ROCK3, -0.5);   // Left center
			addSprite(junctionSegmentIndex, spritesData.ROCK1, 1.0);    // Right barrier
			addSprite(junctionSegmentIndex, spritesData.ROCK2, -1.0);   // Left barrier
			addSprite(junctionSegmentIndex, spritesData.ROCK3, 1.5);    // Far right
			addSprite(junctionSegmentIndex, spritesData.ROCK1, -1.5);   // Far left
			addSprite(junctionSegmentIndex, spritesData.ROCK2, 2.0);    // Extreme right
			addSprite(junctionSegmentIndex, spritesData.ROCK3, -2.0);   // Extreme left
			
			// Add warning barriers approaching the junction
			if (triggerSegmentIndex > 0) {
				addSprite(triggerSegmentIndex - 1, spritesData.ROCK1, 1.8);   // Warning barrier right
				addSprite(triggerSegmentIndex - 1, spritesData.ROCK2, -1.8);  // Warning barrier left
			}
			
			// Add trees to create visual corridor effect
			for (var i = 1; i <= 3; i++) {
				if (triggerSegmentIndex - i >= 0) {
					addSprite(triggerSegmentIndex - i, spritesData.TREE1, 2.5);   // Right trees
					addSprite(triggerSegmentIndex - i, spritesData.TREE2, -2.5);  // Left trees
				}
			}
			
			// Don't add any more road here - it will be added when player makes choice
			tJunctionChoiceMade = false;
			tJunctionModalTriggered = false;
		break;
		
		case 'forkInRoad':
			// More dramatic fork where player sees both paths
			num = num || roadLengthData.length.short;
			addRoad(num*3, num*3, num*3, 0, 0); // Long approach
			addRoad(num, num, num, roadLengthData.curve.easy, 0); // Slight right lean
			addRoad(num, num, num, -roadLengthData.curve.medium, 0); // Counter left
			addRoad(num/2, num, num*2, roadLengthData.curve.hard, 0); // Right path
			addRoad(num/2, num, num*2, -roadLengthData.curve.hard, 0); // Left path  
		break;
		
		case 'hairpinLeft':
			// Extreme hairpin left turn
			num = num || roadLengthData.length.short;
			addRoad(num, num, num, 0, 0); // Straight approach
			addRoad(num/4, num/2, num, -roadLengthData.curve.ninety, 0); // Hairpin left
			addRoad(num/4, num/2, num, -roadLengthData.curve.extreme, 0); // Continue left
		break;
		
		case 'hairpinRight':
			// Extreme hairpin right turn
			num = num || roadLengthData.length.short;
			addRoad(num, num, num, 0, 0); // Straight approach
			addRoad(num/4, num/2, num, roadLengthData.curve.ninety, 0); // Hairpin right
			addRoad(num/4, num/2, num, roadLengthData.curve.extreme, 0); // Continue right
		break;
		
		case 'bumps':
			addRoad(10, 10, 10, 0,  5);
			addRoad(10, 10, 10, 0, -2);
			addRoad(10, 10, 10, 0, -5);
			addRoad(10, 10, 10, 0,  8);
			addRoad(10, 10, 10, 0,  5);
			addRoad(10, 10, 10, 0, -7);
			addRoad(10, 10, 10, 0,  5);
			addRoad(10, 10, 10, 0, -2);
		break;
		
		case 'end':
			num = num || 200;
  			addRoad(num, num, num, -roadLengthData.curve.easy, -getLastY()/defaultData.segmentLength);
		break;
	}
}

/*!
 * 
 * RESET WORLD - This is the function that runs to reset game world
 * 
 */
function resetGame(){
	resetWorld();
	resetRoad();	
}

function resetWorld(){
	defaultData.maxSpeed = defaultData.segmentLength/(1/60);
	defaultData.accel          =  defaultData.maxSpeed/5;
	defaultData.breaking       = -defaultData.maxSpeed;
	defaultData.decel          = -defaultData.maxSpeed/5;
	defaultData.offRoadDecel   = -defaultData.maxSpeed/2;
	defaultData.offRoadLimit   =  defaultData.maxSpeed/4;
	
	defaultData.cameraDepth = 1 / Math.tan((defaultData.fieldOfView/2) * Math.PI/180);
	defaultData.playerZ = (defaultData.cameraHeight * defaultData.cameraDepth);
	resolution = defaultData.height/1024;
	  
	for(var key in defaultData) {
		worldData[key] = defaultData[key];
	}
}

function resetRoad() {
	segments = [];
	
	addRoadType('straight', roadLengthData.length.long);
	addRoadType('lowRollingHills');
	addRoadType('sCurves');
	addRoadType('bumps');
	addRoadType('lowRollingHills');
	addRoadType('curve', roadLengthData.length.long*2, roadLengthData.hill.medium, roadLengthData.curve.medium);
	
	addRoadType('straight', '');
	addRoadType('hill', roadLengthData.length.medium, roadLengthData.hill.hight);
	addRoadType('sCurves');
	addRoadType('curve', roadLengthData.length.long, roadLengthData.hill.none, -roadLengthData.curve.medium);
	addRoadType('bumps');
	addRoadType('hill', roadLengthData.length.long, -roadLengthData.hill.medium);
	
	addRoadType('straight', '');
	addRoadType('bumps');
	addRoadType('sCurves');
	
	for(var n = 0; n<14; n++){
		var roadTypeNum = Math.floor(Math.random()*24)+1;
		if(roadTypeNum == 1){
			addRoadType('lowRollingHills');	
		}else if(roadTypeNum == 2){
			addRoadType('sCurves');
		}else if(roadTypeNum == 3){
			addRoadType('bumps');
		}else if(roadTypeNum == 4){
			addRoadType('curve', roadLengthData.length.long*2, roadLengthData.hill.medium, roadLengthData.curve.medium);
		}else if(roadTypeNum == 5){
			addRoadType('curve', roadLengthData.length.long, roadLengthData.hill.none, roadLengthData.curve.medium);
		}else if(roadTypeNum == 6){
			addRoadType('straight', '');
		}else if(roadTypeNum == 7){
			addRoadType('hill', roadLengthData.length.medium, roadLengthData.hill.hight);
		}else if(roadTypeNum == 8){
			addRoadType('hill', roadLengthData.length.long, roadLengthData.hill.medium);
		}else if(roadTypeNum == 9){
			addRoadType('leftCurve', roadLengthData.length.medium, roadLengthData.hill.low, roadLengthData.curve.medium);
		}else if(roadTypeNum == 10){
			addRoadType('rightCurve', roadLengthData.length.medium, roadLengthData.hill.low, roadLengthData.curve.medium);
		}else if(roadTypeNum == 11){
			addRoadType('easyCurve', roadLengthData.length.medium, roadLengthData.hill.low, roadLengthData.curve.easy);
		}else if(roadTypeNum == 12){
			addRoadType('mediumCurve', roadLengthData.length.medium, roadLengthData.hill.low, roadLengthData.curve.medium);
		}else if(roadTypeNum == 13){
			addRoadType('hardCurve', roadLengthData.length.medium, roadLengthData.hill.low, roadLengthData.curve.hard);
		}else if(roadTypeNum == 14){
			addRoadType('veryHardCurve', roadLengthData.length.medium, roadLengthData.hill.low, roadLengthData.curve.veryHard);
		}else if(roadTypeNum == 15){
			addRoadType('extremeCurve', roadLengthData.length.medium, roadLengthData.hill.low, roadLengthData.curve.extreme);
		}else if(roadTypeNum == 16){
			addRoadType('hardLeftTurn');
		}else if(roadTypeNum == 17){
			addRoadType('hardRightTurn');
		}else if(roadTypeNum == 18){
			addRoadType('tJunctionLeft');
		}else if(roadTypeNum == 19){
			addRoadType('tJunctionLeft');
		}else if(roadTypeNum == 20){
			addRoadType('tJunctionRight');
		}else if(roadTypeNum == 21){
			addRoadType('hairpinLeft');
		}else if(roadTypeNum == 22){
			addRoadType('hairpinRight');
		}else if(roadTypeNum == 23){
			addRoadType('tJunctionChoice');
		}else if(roadTypeNum == 24){
			addRoadType('forkInRoad');
		}
	}
	
	// Add extra road segments to ensure finish line is reachable
	while (segments.length < finishLinePosition + 100) {
		addRoadType('straight', roadLengthData.length.long);
	}
	
	addRoadType('end');
	
	resetSprites();
	resetCars();
	
	defaultData.trackLength = segments.length * defaultData.segmentLength;
}

function resetSprites() {
	//city buildings and urban objects
	for(var n = 10 ; n < segments.length ; n += 3) {
		addSprite(n, randomChoice(spritesData.CITYSCAPE), randomChoice([1,-1]) * (1.2 + Math.random() * 5));
	}
	
	//billboards
	if(spritesData.BILLBOARDS.length > 0){
		for(var n = 100 ; n < segments.length ; n += (300 + Math.floor(Math.random()*100))) {
			addSprite(n, randomChoice(spritesData.BILLBOARDS), randomChoice([1,-1]) * (1.2));
		}
	}
	
	resetCollectItems();
}

function resetCollectItems(){
	for(var n=0; n<segments.length;n++){
		var curSegment = segments[n];
		for(var s = 0 ; s < curSegment.sprites.length ; s++) {
			var sprite  = curSegment.sprites[s];
			if(sprite.source.id == 'COIN' || sprite.source.id == 'FUEL'){
				curSegment.sprites.splice(s,1);
				s--;
			}
		}	
	}
	
	//fuel - Exactly 5 fuel items for quiz system
	var fuelPositions = [500, 1000, 1500, 2000, 2500]; // Strategic positions
	for(var i = 0; i < fuelPositions.length; i++) {
		if (fuelPositions[i] < segments.length) {
			addSprite(fuelPositions[i], spritesData.FUEL, randomChoice([1,-1]) * (0.1 + Math.random()*0.3));
		}
	}
	
	// Add finish line building at the end
	if (finishLinePosition < segments.length) {
		addSprite(finishLinePosition, spritesData.BILLBOARD01, 0); // Center finish line
		addSprite(finishLinePosition, spritesData.BILLBOARD02, -0.5); // Left side
		addSprite(finishLinePosition, spritesData.BILLBOARD03, 0.5); // Right side
	}
	
	//coin
	for(var n = randomInt(20, 50) ; n < segments.length ; n += (300 + Math.floor(Math.random()*50))) {
		addSprite(n,  spritesData.COIN, randomChoice([1,-1]) * (0.1 + Math.random()*0.3));
	}
}

function resetCars() {
	cars = [];
	var n, car, segment, offset, z, sprite, speed;
	for (var n = 0 ; n < defaultData.totalCars ; n++) {
		offset = Math.random() * randomChoice([-0.8, 0.8]);
		z      = Math.floor(Math.random() * segments.length) * defaultData.segmentLength;
		sprite = randomChoice(spritesData.CARS);
		speed  = worldData.maxSpeed/4 + Math.random() * worldData.maxSpeed/(sprite == spritesData.SEMI ? 4 : 2);
		car = { offset: offset, z: z, sprite: sprite, speed: speed };
		segment = findSegment(car.z);
		segment.cars.push(car);
		cars.push(car);
	}
}

/*!
 * 
 * RENDER MISC - This is the function that runs for render misc
 * 
 */
function renderPolygon(x1, y1, x2, y2, x3, y3, x4, y4, color){
	var shape = new createjs.Shape();
	shape.graphics.beginFill(color)
				.beginStroke()
				.moveTo(x1, y1)
				.lineTo(x2, y2)
				.lineTo(x3, y3)
				.lineTo(x4, y4)
				.endStroke();
	worldContainer.addChild(shape);
}

function renderSegment(width, lanes, x1, y1, w1, x2, y2, w2, fog, color){
	var r1 = rumbleWidth(w1, lanes),
        r2 = rumbleWidth(w2, lanes),
        l1 = laneMarkerWidth(w1, lanes),
        l2 = laneMarkerWidth(w2, lanes),
        lanew1, lanew2, lanex1, lanex2, lane;
	
	var shape = new createjs.Shape();
	shape.graphics.beginFill(color.grass).drawRect(0, y2, width, y1 - y2);
	worldContainer.addChild(shape);
    
    renderPolygon(x1-w1-r1, y1, x1-w1, y1, x2-w2, y2, x2-w2-r2, y2, color.rumble);
    renderPolygon(x1+w1+r1, y1, x1+w1, y1, x2+w2, y2, x2+w2+r2, y2, color.rumble);
    renderPolygon(x1-w1,    y1, x1+w1, y1, x2+w2, y2, x2-w2,    y2, color.road);
    
    if (color.lane) {
      lanew1 = w1*2/lanes;
      lanew2 = w2*2/lanes;
      lanex1 = x1 - w1 + lanew1;
      lanex2 = x2 - w2 + lanew2;
      for(lane = 1 ; lane < lanes ; lanex1 += lanew1, lanex2 += lanew2, lane++)
        renderPolygon(lanex1 - l1/2, y1, lanex1 + l1/2, y1, lanex2 + l2/2, y2, lanex2 - l2/2, y2, color.lane);
    }
    
    renderFog(0, y1, width, y2-y1, fog);
}

function renderBackground(background, width, height, layer, rotation, offset){
	var newBackground = $.background[layer.id].clone();
	var newBackgroundMirror = $.background[layer.id].clone();
    rotation = rotation || 0;
    offset   = offset   || 0;
	
	newBackground.x = rotation * layer.w;
	if(rotation > 0){
		newBackground.x = -(newBackground.x);	
	}else{
		newBackground.x = Math.abs(newBackground.x);	
	}
	
	var destY = (defaultData.lastY/defaultData.height) * 20;
	newBackground.y = destY+offset;
	
	worldContainer.addChild(newBackground, newBackgroundMirror);
	
	newBackgroundMirror.x = newBackground.x + layer.w;
	newBackgroundMirror.y = newBackground.y;
}

function renderSprite(width, height, resolution, roadWidth, sprites, sprite, scale, destX, destY, offsetX, offsetY, clipY){
	var newSprite = $.sprites[sprite.id].clone();
	
    var destW  = (newSprite.image.naturalWidth * scale * width/2) * (defaultData.scale * roadWidth);
    var destH  = (newSprite.image.naturalHeight * scale * width/2) * (defaultData.scale * roadWidth);

    destX = destX + (destW * (offsetX || 0));
    destY = destY + (destH * (offsetY || 0));
	
    var clipH = clipY ? Math.max(0, destY+destH-clipY) : 0;
    if (clipH < destH){
		newSprite.x = destX;
		newSprite.y = destY;
		newSprite.scaleX = destW/sprite.w;
		newSprite.scaleY = (destH - clipH)/sprite.h;
		
		worldContainer.addChild(newSprite);	
	}
}

function renderPlayer(width, height, resolution, roadWidth, sprites, speedPercent, scale, destX, destY, steer, updown){
	if(curPage == 'result'){
		return;	
	}
	
	var bounce = (1.5 * Math.random() * speedPercent * resolution) * randomChoice([-1,1]);
	var sprite;
	if (steer < 0)
	  sprite = (updown > 0) ? playerCarData.up_left : playerCarData.left;
	else if (steer > 0)
	  sprite = (updown > 0) ? playerCarData.up_right : playerCarData.right;
	else
	  sprite = (updown > 0) ? playerCarData.up_straight : playerCarData.straight;
	
	renderCar(width, height, resolution, roadWidth, sprites, sprite, scale, destX, destY + bounce, -0.5, -.8);
}

function renderCar(width, height, resolution, roadWidth, sprites, sprite, scale, destX, destY, offsetX, offsetY, clipY){
	var newSprite = $.sprites[sprite.id].clone();
    var destW  = (sprite.w * scale * width/2) * (defaultData.scale * roadWidth);
    var destH  = (sprite.h * scale * width/2) * (defaultData.scale * roadWidth);

    destX = destX + (destW * (offsetX || 0));
    destY = destY + (destH * (offsetY || 0));
	
    var clipH = clipY ? Math.max(0, destY+destH-clipY) : 0;
    if (clipH < destH){
		newSprite.x = destX;
		newSprite.y = destY;
		newSprite.scaleX = destW/sprite.w;
		newSprite.scaleY = (destH - clipH)/sprite.h;
		worldContainer.addChild(newSprite);
		
		//details
		var sPercent = destW/sprite.w;
		var leftSmoke = false;
		var rightSmoke = false;
		var extraTop = 0;
		if(sprite.id.substring(0,3) == 'up_'){
			extraTop = 25;	
		}
		
		if (defaultData.playerX < -1.2){
			leftSmoke = rightSmoke = true;
		}else if (defaultData.playerX < -.9){
			leftSmoke = true;
		}else if (defaultData.playerX > 1.2){
			leftSmoke = rightSmoke = true;
		}else if (defaultData.playerX > .9){
			rightSmoke = true;
		}
		
		if(leftSmoke && defaultData.speed > 0){
			var smokeSpriteL = smokeAnimate.clone();
			smokeSpriteL.x = newSprite.x + (0 * sPercent);
			smokeSpriteL.y = newSprite.y + ((90 + extraTop) * sPercent);
			smokeSpriteL.scaleX = newSprite.scaleX;
			smokeSpriteL.scaleY = newSprite.scaleY;
			worldContainer.addChild(smokeSpriteL);
		}
		
		if(rightSmoke && defaultData.speed > 0){
			var smokeSpriteR = smokeAnimate.clone();
			smokeSpriteR.x = newSprite.x + (180 * sPercent);
			smokeSpriteR.y = newSprite.y + ((90 + extraTop) * sPercent);
			smokeSpriteR.scaleX = newSprite.scaleX;
			smokeSpriteR.scaleY = newSprite.scaleY;
			worldContainer.addChild(smokeSpriteR);
		}
	}
}

function renderFog(x, y, width, height, fog){
	if (fog < 1) {
		var shape = new createjs.Shape();
		shape.graphics.beginFill(roadData.fog).drawRect(x, y, width, height);
		shape.alpha = (1-fog);
		worldContainer.addChild(shape);
    }
}


/*!
 * 
 * ROAD BUILD MISC - This is the function that runs for road build misc
 * 
 */
function rumbleWidth(projectedRoadWidth, lanes){
	return projectedRoadWidth/Math.max(6,  2*lanes);	
}

function laneMarkerWidth(projectedRoadWidth, lanes){
	return projectedRoadWidth/Math.max(32, 8*lanes);
}


/*!
 * 
 * COLLECT ITEMS - This is the function that runs for collect items
 * 
 */
function updateCamera(){
	defaultData.playerZ = (worldData.cameraHeight * defaultData.cameraDepth);
}

function addScore(){
	playSound('soundCollectCoin');
	playerData.score += scoreData.coin;
	updateGameText(statusData.score.text.replace('[NUMBER]', scoreData.coin), statusData.score.color, statusData.score.size, 1);
}

function addFuel(){
	playSound('soundCollectFuel');
	gameData.fuel += fuelData.add;	
	gameData.fuel = gameData.fuel > fuelData.total ? fuelData.total : gameData.fuel;
	updateGameText(statusData.fuel.text, statusData.fuel.color, statusData.fuel.size, 1);
}

/*!
 * 
 * GAME STATUS - This is the function that runs for game status
 * 
 */
function updateGameStatus(){
	//score
	scoreTxt.text = scoreShadowTxt.text = scoreData.text.replace('[NUMBER]', addCommas(playerData.score));
	
	// Add quiz progress indicator
	if (typeof quizzesCompleted !== 'undefined') {
		var progressText = "Quizzes: " + quizzesCompleted + "/" + totalQuizzes;
		if (gameStatusTxt) {
			gameStatusTxt.text = gameStatusShadowTxt.text = progressText;
		}
	}
	
	//fuel - Show actual fuel level
	var fuelPercent = (gameData.fuel / fuelData.total) * (fuelData.bar.width - (fuelData.bar.space*2));
	fuelBarFill.graphics.clear();
	fuelBarFill.graphics.beginFill(fuelData.bar.fillColor).drawRect(0, 0, fuelPercent, fuelData.bar.height - (fuelData.bar.space * 4));
	
	// Re-enabled fuel warnings and game over
	if(gameData.fuel < (fuelData.total/100 * 25) && !gameData.penalty){
		updateGameText(statusData.lowFuel.text, statusData.lowFuel.color, statusData.lowFuel.size, 0);
	}
	
	//game over - fuel check re-enabled
	if(!gameData.paused && gameData.fuel <= 0){
		updateGameText(statusData.noFuel.text, statusData.noFuel.color, statusData.noFuel.size, 0);	
		endGame();	
	}
}

function updateGameText(text, color, size, delay){
	gameStatusContainer.visible = true;
	
	gameStatusTxt.font = size+"px dimitriregular";
	gameStatusShadowTxt.font = size+"px dimitri_swankregular";
	gameStatusTxt.color = color;
	gameStatusTxt.text = text;
	gameStatusShadowTxt.text = text;
	
	if(delay > 0){
		TweenMax.to(gameStatusContainer, delay, {overwrite:true, onComplete:function(){
			gameStatusContainer.visible = false;
		}});
	}
}

function endGame(){
	if(!gameData.ended){
		gameData.paused = true;
		gameData.ended = true;
		
		keyData.left = keyData.right = keyData.accelerate = keyData.brake = false;
		TweenMax.to(resultContainer, 1, {overwrite:true, onComplete:function(){
			goPage('result');
		}});
	}
}

/*!
 * 
 * OPTIONS - This is the function that runs to mute and fullscreen
 * 
 */
function toggleSoundMute(con){
	buttonSoundOff.visible = false;
	buttonSoundOn.visible = false;
	toggleSoundInMute(con);
	if(con){
		buttonSoundOn.visible = true;
	}else{
		buttonSoundOff.visible = true;	
	}
}

function toggleMusicMute(con){
	buttonMusicOff.visible = false;
	buttonMusicOn.visible = false;
	toggleMusicInMute(con);
	if(con){
		buttonMusicOn.visible = true;
	}else{
		buttonMusicOff.visible = true;	
	}
}

function toggleFullScreen() {
  if (!document.fullscreenElement &&    // alternative standard method
      !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement ) {  // current working methods
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
    } else if (document.documentElement.msRequestFullscreen) {
      document.documentElement.msRequestFullscreen();
    } else if (document.documentElement.mozRequestFullScreen) {
      document.documentElement.mozRequestFullScreen();
    } else if (document.documentElement.webkitRequestFullscreen) {
      document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    }
  }
}

/*!
 * 
 * OPTIONS - This is the function that runs to toggle options
 * 
 */

function toggleOptions(con){
	if(optionsContainer.visible){
		optionsContainer.visible = false;
	}else{
		optionsContainer.visible = true;
	}
	if(con!=undefined){
		optionsContainer.visible = con;
	}
}


/*!
 * 
 * SHARE - This is the function that runs to open share url
 * 
 */
function shareLinks(action, shareScore){
	if(shareSettings.gtag){
		gtag('event','click',{'event_category':'share','event_label':action});
	}

	var gameURL = location.href;
	gameURL = encodeURIComponent(gameURL.substring(0,gameURL.lastIndexOf("/") + 1));

	var shareTitle = shareSettings.shareTitle.replace("[SCORE]", shareScore);
	var shareText = shareSettings.shareText.replace("[SCORE]", shareScore);

	var shareURL = '';
	if( action == 'facebook' ){
		if(shareSettings.customScore){
			gameURL = decodeURIComponent(gameURL);
			shareURL = `https://www.facebook.com/sharer/sharer.php?u=`+encodeURIComponent(`${gameURL}share.php?title=${shareTitle}&url=${gameURL}&thumb=${gameURL}share.jpg`);
		}else{
			shareURL = `https://www.facebook.com/sharer/sharer.php?u=${gameURL}`;
		}
	}else if( action == 'twitter' ){
		shareURL = `https://twitter.com/intent/tweet?text=${shareText}&url=${gameURL}`;
	}else if( action == 'whatsapp' ){
		shareURL = `https://api.whatsapp.com/send?text=${shareText}%20${gameURL}`;
	}else if( action == 'telegram' ){
		shareURL = `https://t.me/share/url?url=${gameURL}&text=${shareText}`;
	}else if( action == 'reddit' ){
		shareURL = `https://www.reddit.com/submit?url=${gameURL}&title=${shareText}`;
	}else if( action == 'linkedin' ){
		shareURL = `https://www.linkedin.com/sharing/share-offsite/?url=${gameURL}`;
	}

	window.open(shareURL);
}