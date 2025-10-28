////////////////////////////////////////////////////////////
// GAME v1.8
////////////////////////////////////////////////////////////

/*!
 * 
 * GAME SETTING CUSTOMIZATION START
 * 
 * MANILA RUSH SYSTEM: Philippine urban racing experience
 * - Navigate through EDSA and city highways
 * - Race between Makati and BGC skyscrapers
 * - Modern cityscape with glass towers and urban architecture
 * - Authentic Philippine city atmosphere
 * - Optimized for modernized city background images
 * 
 */
 
//background assets - Philippine city theme with tropical lighting
// Use smaller images on mobile for better performance
var isMobileDevice = isMobileDevice || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
const backgroundSuffix = (typeof isMobileDevice !== 'undefined' && isMobileDevice) ? '_mobile' : '';

const backgroundData = {
	hills: { src: 'assets/background_hills' + backgroundSuffix + '.png'}, // Manila/Makati/BGC skyline silhouette
	sky:   { src: 'assets/background_sky' + backgroundSuffix + '.png'},   // Bright tropical Philippine sky with golden hour lighting
	trees: { src: 'assets/background_trees' + backgroundSuffix + '.png'} // Foreground Filipino high-rise buildings and condominiums
};

//road assets - Philippine metropolitan highway with realistic cement/concrete road colors
const roadData = {
	width:1800,
	rumbleLength:2,
	lanes:3,
	fogDensity:2, // Reduced fog for better skyline visibility
	fog:'#B0C4DE', // Light steel blue for urban atmospheric haze
	light:{road:'#C0C0C0', grass:'#008eb3', rumble:'#FFD700', lane:'#FFFFFF'}, // Uniform cement gray road, pale green urban areas, gold lane markers, white lines
	dark:{road:'#C0C0C0', grass:'#008eb3', rumble:'#FF8C00'} // Same uniform cement gray road - no more zebra stripes, light green areas, dark orange construction markers
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
	up_left: { src:'assets/car_left.png'},
	up_right:   { src:'assets/car_right.png'},
	up_straight: { src:'assets/car_straight.png'}
};

//world assets - Philippine city environment with tropical architecture
const spritesData = {
	BILLBOARD01:{src:'assets/billboard_01.png'}, // Jollibee, SM, Globe telecommunications billboard
	BILLBOARD02:{src:'assets/billboard_02.png'}, // Philippine brands advertisement (Ayala, BDO, etc.)
	BILLBOARD03:{src:'assets/billboard_03.png'}, // Local business digital signage
	BILLBOARD04:{src:'assets/billboard_04.png'}, // Local business digital signage
	BILLBOARD05:{src:'assets/billboard_04.png'}, // Local business digital signage
	BUILDING1:{src:'assets/bulding1.png'}, // Manila building 1
	BUILDING2A:{src:'assets/building2a.png'}, // Manila building 2a
	BUILDING2B:{src:'assets/Building2b.png'}, // Manila building 2b
	BUILDING3A:{src:'assets/building3a.png'}, // Manila building 3a
	BUILDING3B:{src:'assets/building3b.png'}, // Manila building 3b
	BUILDING4A:{src:'assets/building4a.png'}, // Manila building 4a
	BUILDING4B:{src:'assets/buildng4b.png'}, // Manila building 4b
	TRUCK01:{src:'assets/truck_01.png'}, // Filipino delivery truck (Isuzu style)
	TRUCK02:{src:'assets/truck_02.png'}, // Philippine commercial vehicle
	TRUCK03:{src:'assets/truck_03.png'}, // Philippine commercial vehicle
	JEEP01:{src:'assets/jeep_01.png'}, // Traditional Filipino jeepney
	CAR04:{src:'assets/car_04.png'}, // Toyota Vios (popular Philippine sedan)
	CAR03:{src:'assets/car_03.png'}, // Honda City (compact Philippine car)
	CAR02:{src:'assets/car_02.png'}, // Sports car for Filipino roads
	CAR01:{src:'assets/car_01.png'}, // Luxury vehicle (BMW/Mercedes in PH)
	COIN:{src:'assets/item_power_coin.png'}, // Philippine peso coin (+500 score)
	COIN2:{src:'assets/item_power_coin_2.png'}, // Second peso coin (+500 score)
	COIN_KAMOTE1:{src:'assets/item_power_coin_kamote.png'}, // Kamote coin (-700 score)
	COIN_KAMOTE2:{src:'assets/item_power_coin_kamote2.png'}, // Kamote coin (-700 score)
	COIN_KAMOTE3:{src:'assets/item_power_coin_kamote3.png'}, // Kamote coin (-700 score)
	COIN_KAMOTE4:{src:'assets/item_power_coin_kamote4.png'}, // Kamote coin (-700 score)
	COIN_KAMOTE5:{src:'assets/item_power_coin_kamote5.png'}, // Kamote coin (-700 score)
	COIN_KAMOTE6:{src:'assets/item_power_coin_kamote6.png'}, // Kamote coin (-700 score)
	KAMOTE_POPUP:{src:'assets/kamote_pop_up.png'}, // Kamote popup image when hitting kamote coins
	QUESTION_BACKGROUND:{src:'assets/question_background.png'}, // Background image for quiz questions
	FUEL:{src:'assets/truss.png'},  // Road tunnel/arc that triggers quiz when player drives through it
	FINISH_LINE:{src:'assets/finish.png'}  // Finish line checkpoint with Manila skyline background
};

// Sprite collections - grouped arrays for random selection during gameplay
spritesData.CITYSCAPE = [spritesData.BUILDING1, spritesData.BUILDING2A, spritesData.BUILDING2B, spritesData.BUILDING3A, spritesData.BUILDING3B, spritesData.BUILDING4A, spritesData.BUILDING4B]; // All building types for urban skyline
spritesData.CARS = [spritesData.CAR01, spritesData.CAR02, spritesData.CAR03, spritesData.CAR04, spritesData.JEEP01, spritesData.TRUCK01, spritesData.TRUCK02, spritesData.TRUCK03]; // Traffic vehicles (cars, jeepneys, trucks)
spritesData.BILLBOARDS = [spritesData.BILLBOARD01, spritesData.BILLBOARD02, spritesData.BILLBOARD03, spritesData.BILLBOARD04, spritesData.BILLBOARD05]; // Advertisement billboards
spritesData.KAMOTE_COINS = [spritesData.COIN_KAMOTE1, spritesData.COIN_KAMOTE2, spritesData.COIN_KAMOTE3, spritesData.COIN_KAMOTE4, spritesData.COIN_KAMOTE5, spritesData.COIN_KAMOTE6]; // Penalty coins that subtract score

const intructionDisplayText = 'Press W,A,S,D\n to navigate'; //instruction display text

//keyboard keycode
const keyboard_arr = {left:[65,37],
					right:[68,39],
					up:[87,38],
					down:[83,40]};

//powers
const scoreData = {text:'SCORE: [NUMBER]',//score display text
				coin:500} //collect coin score
				
const fuelData = {text:'TIME:', //fuel display text
				total:100, //total fuel
				add:20, //collect fuel total
				updateTime:1, //fuel update timer
				decrease:2, //fuel decrease
				bar:{width:200, height:28, backgroundColor:'#2f2f2fff', blankColor:'#fff', fillColor:'#25bf1d', space:3} //fuel bar
				};
				
//game status (text, color and font size)				
const statusData = {
				start:{text:'READY?', color:'#071c27', size:120},
				fuel:{text:'+TIME', color:'#25bf1d', size:70},
				score:{text:'+[NUMBER] SCORE', color:'#fcdb05', size:70},
				penalty:{text:'TIME OUT:\n[NUMBER]', color:'#ec3e34', size:70},
				lowFuel:{text:'LOW TIME', color:'#ff7f00', size:70},
				noFuel:{text:'OUT OF TIME', color:'#ec3e34', size:70},
				};
				
const exitMessage = 'Are you sure\nyou want to quit?'; //go to main page message
const resultTitleText = 'GOOD JOB\nTHO!';  //result text display
const resultScoreText = 'SENSIBLE METER\nSCORE:';  //result text display

//Social share, [SCORE] will replace with game score
const shareText = 'SHARE YOUR SENSIBLE METER SCORE'; //social share message
const shareSettings = {
	enable:false,
	options:['facebook','twitter','whatsapp','telegram','reddit','linkedin'],
	shareTitle:'My Sensible Meter highscore is [SCORE] PESOS!',
	shareText:'Just scored [SCORE] PESOS racing through Manila in Sensible Meter! Try this Philippine city racing game now!',
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
	skySpeed:0.0003, // Very slow for distant city horizon - creates deep perspective
	hillSpeed:0.002, // Medium speed for mid-distance buildings - layered depth
	buildingSpeed:0.006, // Faster for close buildings - strong 3D parallax effect
	skyOffset:0,
	hillOffset:0,
	buildingOffset:0,
	segmentLength:200,
	trackLength:null,
	fieldOfView:110, // Wider field of view for better 3D city immersion
	cameraHeight:700, // Lower camera for more street-level perspective
	cameraDepth:null,
	drawDistance:300, // Increased to see more of the city canyon ahead
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

// Mobile detection is done in canvas.js (isMobileDevice variable)
// Apply moderate optimizations for mobile devices
var DISABLE_ROADSIDE_SPRITES = false; // Buildings now use sprite pooling - no longer need to disable!

if (typeof isMobileDevice !== 'undefined' && isMobileDevice) {
	defaultData.drawDistance = 120;
	defaultData.totalCars = 60;
	defaultData.fieldOfView = 100;
	roadData.fogDensity = 2.5;
} else {
	// Desktop uses default settings
}
				
var worldData = {};
var segments = [];
var cars = [];
var background = null;
var sprites = null;
var resolution = null;
var currentLapTime = 0;

// Pre-create background sprites to avoid cloning every frame (major performance optimization)
var bgSky = null;
var bgSkyMirror = null;
var bgHills = null;
var bgHillsMirror = null;
var bgTrees = null;
var bgTreesMirror = null;

// Sprite pool for reusing sprites instead of cloning (MASSIVE performance improvement)
var spritePool = {};
var spritePoolSize = 50; // Number of pre-created sprites per type

const roadLengthData = {length:{none:0, short:25, medium:50, long:100},
					  hill:{none:0, low:20, medium:40, high:60},
					  curve:{none:0, easy:0.8, medium:1.3, hard:1.8, veryHard:2.2, extreme:2.8, ninety:3.5}};

const playerData = {score:0, displayScore:0};
const gameData = {paused:true, fuel:0, fuelUpdate:false, accel:false, penalty:false, penaltyTime:0, brakeSound:false, accelSound:false, stopSound:false, ended:false, waitingAtTunnel:false};
const keyData = {left:false, right:false, accelerate:false, brake:false};

// Quiz Timer Variables
var quizTimeLimit = 5; // 5 seconds to answer
var quizTimeRemaining = 0;
var quizTimerActive = false;
var quizTimerInterval = null;

// Player Email System Variables
var currentPlayer = null; // {email, registered_at, sessions, has_redirected}
var playerEmail = null; // Stored email
var emailModalActive = false; // Track if email modal is showing
var currentSessionId = null; // Current game session ID for tracking
const API_URL = '/api';

// T-Junction Modal System Variables
var tJunctionPendingDirection = null; // 'left', 'right', or null
var tJunctionForcedDirection = 0; // Curve value to apply
var tJunctionTriggerDistance = 0; // Distance to trigger modal
var tJunctionModalTriggered = false; // Prevent multiple triggers
var tJunctionAutoTurn = null; // Automatic turning object
var tJunctionChoiceMade = false; // Track if player has made a choice

// Quiz System Variables
var quizQuestions = []; // Array to store quiz questions from JSON
var currentQuizQuestion = null; // Current quiz question object
var questionsAnswered = 0; // Number of questions answered (regardless of correct/wrong)
var correctAnswers = 0; // Number of correct answers
var maxQuestionsPerGame = 5; // 5 questions per game
var selectedQuestions = []; // Randomized questions for this game session
var finishAfterLastQuestion = false; // Flag to trigger finish line after last question
var distanceToFinish = 200; // Distance to run after last question before finishing
var showingFinishLine = false; // Flag to show finish line image
var finishLineDelay = 5000; // Time to run after 5th question (5 seconds)
var finishLineOverlay = null; // Finish line overlay container

// Kamote Popup System
var kamotePopupContainer = null; // Kamote popup image container

// Legacy finish line variables (for old system compatibility)
var totalQuizzes = 5;
var quizzesCompleted = 0;
var finishLinePosition = 3000;
var gameWon = false;
var gamePaused = false;

/*!
 * FINISH LINE SYSTEM
 */

// Check if player reached the finish line
function checkFinishLine() {
	if (gameWon || gamePaused) return;
	
	var currentSegment = Math.floor(defaultData.position / defaultData.segmentLength);
	
	// Check if player reached the finish line and completed all quizzes
	if (currentSegment >= finishLinePosition && quizzesCompleted >= totalQuizzes) {
		console.log('VICTORY! Player reached finish line with all quizzes completed:', quizzesCompleted + '/' + totalQuizzes);
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
		console.log('FAILURE! Player reached finish line but missing quizzes:', quizzesCompleted + '/' + totalQuizzes);
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
	// Hide the status container (TIME/fuel display)
	statusContainer.visible = false;
	
	// Stop penalty timer and hide penalty messages
	gameData.penalty = false;
	gameData.penaltyTime = 0;
	
	// Clear any existing game text and show victory message immediately
	gameStatusContainer.visible = false;
	
	// End backend session tracking
	endGameSession(playerData.score, gameData.fuel, true);
	
	// Record session for player
	if (playerEmail) {
		var sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
		recordPlayerSession(sessionId, playerData.score);
	}
	
	updateGameText("THANK YOU\n FOR PLAYING!", "#071c27", 80, 0);	
	setTimeout(function() {
		// Show final score
		updateGameText("Final Score: \n" + addCommas(playerData.score), "#008cb1", 80, 0);
		
		// Show victory buttons after score is displayed
		setTimeout(function() {
			showVictoryButtons();
		}, 500);
	}, 2000);
}

/**
 * Show victory buttons (Claim Prize and Play Again)
 */
function showVictoryButtons() {
	// Create container for victory buttons
	var victoryButtonsContainer = new createjs.Container();
	victoryButtonsContainer.name = "victoryButtonsContainer";
	
	// Calculate button positions - place below Final Score text
	var buttonWidth = 400;
	var buttonHeight = 80;
	var buttonSpacing = 40;
	var startY = canvasH / 2 + 100; // Position below the Final Score text
	
	// Check if player has already been redirected
	var showClaimPrize = !currentPlayer || !currentPlayer.has_redirected;
	
	var yPosition = startY;
	
	// CLAIM PRIZE button - only show if player hasn't been redirected
	var claimPrizeButton = null;
	var countdown = 5;
	var countdownInterval = null;
	
	if (showClaimPrize) {
		claimPrizeButton = new createjs.Container();
		
		// Button background with gradient (left to right: #01cdee to #018bb0)
		var claimPrizeBg = new createjs.Shape();
		var gradient = claimPrizeBg.graphics.beginLinearGradientFill(
			["#01cdee", "#018bb0"], 
			[0, 1], 
			0, 0, 
			buttonWidth, 0
		);
		
		// Draw main button shape with gradient (no rounded corners)
		claimPrizeBg.graphics.drawRect(0, 0, buttonWidth, buttonHeight);
		
		// Draw border as a rectangle outline with variable thickness
		var claimPrizeBorder = new createjs.Shape();
		
		// Top and side borders - thicker (8px)
		claimPrizeBorder.graphics.setStrokeStyle(8, "square", "miter").beginStroke("#2f302f");
		claimPrizeBorder.graphics.drawRect(0, 0, buttonWidth, buttonHeight - 4);
		
		// Bottom border - 3 times thicker (24px)
		claimPrizeBorder.graphics.setStrokeStyle(24, "butt").beginStroke("#2f302f");
		claimPrizeBorder.graphics.moveTo(0, buttonHeight).lineTo(buttonWidth, buttonHeight);
		
		var claimPrizeText = new createjs.Text("CLAIM PRIZE", "bold 32px Mont Heavy DEMO", "#FFFFFF");
		claimPrizeText.textAlign = "left";
		claimPrizeText.textBaseline = "middle";
		claimPrizeText.x = 30;
		claimPrizeText.y = buttonHeight / 2;
		
		// Countdown timer positioned to the right of text
		var claimPrizeTimer = new createjs.Text("(5)", "bold 28px Mont Heavy DEMO", "#FFFFFF");
		claimPrizeTimer.textAlign = "right";
		claimPrizeTimer.textBaseline = "middle";
		claimPrizeTimer.x = buttonWidth - 30;
		claimPrizeTimer.y = buttonHeight / 2;
		
		claimPrizeButton.addChild(claimPrizeBg, claimPrizeBorder, claimPrizeText, claimPrizeTimer);
		claimPrizeButton.x = (canvasW - buttonWidth) / 2;
		claimPrizeButton.y = yPosition;
		claimPrizeButton.cursor = "pointer";
		
		// Add click handler
		claimPrizeButton.addEventListener("click", function() {
			playSound('soundClick');
			clearInterval(countdownInterval);
			
			// Mark player as redirected
			if (currentPlayer && currentPlayer.email) {
				markPlayerAsRedirected(currentPlayer.email);
			}
			
			window.location.href = "https://www.yamaha-motor.com.ph/motorcycles/personal-commuter/mio-series/mio-gravis?utm_source=mio_gravis_lrt_activation&utm_medium=qr_code&utm_campaign=052025_miogravis&utm_content=the_sensible_choice";
		});
		
		victoryButtonsContainer.addChild(claimPrizeButton);
		yPosition += buttonHeight + buttonSpacing;
	}
	
	// PLAY AGAIN button
	var playAgainButton = new createjs.Container();
	
	// Button background with gradient (left to right: #01cdee to #018bb0)
	var playAgainBg = new createjs.Shape();
	playAgainBg.graphics.beginLinearGradientFill(
		["#01cdee", "#018bb0"], 
		[0, 1], 
		0, 0, 
		buttonWidth, 0
	).drawRect(0, 0, buttonWidth, buttonHeight);
	
	// Draw border as a rectangle outline with variable thickness
	var playAgainBorder = new createjs.Shape();
	
	// Top and side borders - thicker (8px)
	playAgainBorder.graphics.setStrokeStyle(8, "square", "miter").beginStroke("#2f302f");
	playAgainBorder.graphics.drawRect(0, 0, buttonWidth, buttonHeight - 4);
	
	// Bottom border - 3 times thicker (24px)
	playAgainBorder.graphics.setStrokeStyle(24, "butt").beginStroke("#2f302f");
	playAgainBorder.graphics.moveTo(0, buttonHeight).lineTo(buttonWidth, buttonHeight);
	
	var playAgainText = new createjs.Text("PLAY AGAIN", "bold 32px Mont Heavy DEMO", "#FFFFFF");
	playAgainText.textAlign = "center";
	playAgainText.textBaseline = "middle";
	playAgainText.x = buttonWidth / 2;
	playAgainText.y = buttonHeight / 2;
	
	playAgainButton.addChild(playAgainBg, playAgainBorder, playAgainText);
	playAgainButton.x = (canvasW - buttonWidth) / 2;
	playAgainButton.y = yPosition;
	playAgainButton.cursor = "pointer";
	
	playAgainButton.addEventListener("click", function() {
		playSound('soundClick');
		if (countdownInterval) clearInterval(countdownInterval);
		location.reload();
	});
	
	// Add buttons to container
	victoryButtonsContainer.addChild(playAgainButton);
	victoryButtonsContainer.alpha = 0;
	gameContainer.addChild(victoryButtonsContainer);
	
	// Fade in buttons
	TweenMax.to(victoryButtonsContainer, 0.5, {alpha: 1});
	
	// Start countdown timer for Claim Prize button (if shown)
	if (showClaimPrize && claimPrizeButton) {
		countdownInterval = setInterval(function() {
			countdown--;
			claimPrizeTimer.text = "(" + countdown + ")";
			if (countdown <= 0) {
				clearInterval(countdownInterval);
				
				// Mark player as redirected
				if (currentPlayer && currentPlayer.email) {
					markPlayerAsRedirected(currentPlayer.email);
				}
				
				// Auto redirect after countdown
				window.location.href = "https://www.yamaha-motor.com.ph/motorcycles/personal-commuter/mio-series/mio-gravis?utm_source=mio_gravis_lrt_activation&utm_medium=qr_code&utm_campaign=052025_miogravis&utm_content=the_sensible_choice";
			}
		}, 1000);
	}
}

// Mark player as redirected in backend
function markPlayerAsRedirected(email) {
	fetch(`${API_URL}/players/${encodeURIComponent(email)}/redirect`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		}
	}).then(response => response.json())
	.then(data => {
		console.log('Player marked as redirected:', data);
		// Update local currentPlayer object
		if (currentPlayer) {
			currentPlayer.has_redirected = true;
			currentPlayer.redirected_at = new Date().toISOString();
		}
	})
	.catch(error => {
		console.error('Error marking player as redirected:', error);
	});
}

/*!
 * QUIZ SYSTEM FUNCTIONS
 */

// Load quiz questions from JSON
function loadQuizQuestions() {
	console.log('Loading quiz questions from Node.js API...'); // Debug log
	
	// Try loading from Node.js API first
	$.getJSON('/api/game/questions', function(data) {
		if (data && data.success && data.questions) {
			quizQuestions = data.questions;
			console.log('Quiz questions loaded successfully from Node.js API:', quizQuestions.length);
			console.log('Questions:', quizQuestions);
		} else {
			console.warn('Invalid response from API, trying fallback...');
			tryFallbackSources();
		}
	}).fail(function(jqXHR, textStatus, errorThrown) {
		console.warn('Failed to load from Node.js API, trying fallback sources...');
		console.error('Error details:', textStatus, errorThrown);
		tryFallbackSources();
	});
}

// Fallback loading chain
function tryFallbackSources() {
	// Try loading from admin/data/questions.json as fallback
	$.getJSON('admin/data/questions.json', function(data) {
		// Transform admin format to game format
		var activeQuestions = data.questions.filter(function(q) {
			return q.active === 1;
		});
		
		quizQuestions = activeQuestions.map(function(q) {
			return {
				id: q.id,
				section: q.section,
				question: q.question,
				options: [q.option_a, q.option_b],
				correct: q.correct_answer,
				explanation: q.explanation || ''
			};
		});
		
		console.log('Quiz questions loaded from admin/data/questions.json:', quizQuestions.length);
	}).fail(function() {
		console.warn('Failed to load from admin/data/questions.json, trying quiz-questions.json...');
		
		// Try loading from quiz-questions.json as final fallback
		$.getJSON('quiz-questions.json', function(data) {
			quizQuestions = data.questions;
			console.log('Quiz questions loaded from quiz-questions.json:', quizQuestions.length);
		}).fail(function() {
			console.error('All sources failed, using hardcoded fallback');
			// Hardcoded fallback questions if all sources fail
			quizQuestions = [
				{
					"id": 1,
					"section": "Safety",
					"question": "Should you follow traffic rules?",
					"options": ["Yes", "No"],
					"correct": 0,
					"explanation": "Always follow traffic rules for your safety!"
				}
			];
			console.log('Using hardcoded fallback questions:', quizQuestions.length);
		});
	});
}

// Trigger fuel quiz when player collects fuel
function triggerFuelQuiz() {
	console.log('=== triggerFuelQuiz called! ==='); // Debug log
	console.log('quizQuestions array:', quizQuestions);
	console.log('quizQuestions length:', quizQuestions.length);
	console.log('Quiz questions available:', quizQuestions.length); // Debug log
	
	try {
		if (quizQuestions.length === 0) {
			console.warn('No quiz questions available, using fallback question');
			// Create a fallback question instead of returning
			quizQuestions = [{
				"id": 1,
				"section": "Fuel",
				"question": "You need fuel to continue. Ready to refuel?",
				"options": ["Yes, let's go!", "I'm ready!"],
				"correct": 0,
				"explanation": "Great! You've refueled and can continue your Manila adventure!"
			}];
		}
		
		// Completely pause game - stop fuel consumption and car movement
		console.log('Completely pausing game for quiz'); // Debug log
		gamePaused = true;
		gameData.paused = true; // Additional pause flag
		
		// Stop car movement by setting speed to 0
		var savedSpeed = defaultData.speed;
		defaultData.speed = 0;
		
		// Stop all engine sounds immediately
		stopSoundLoop('soundEngine');
		stopSoundID('soundSpeedUp');
		stopSoundID('soundSlowDown');
		stopSoundLoop('soundBrake');
		gameData.accelSound = false;
		gameData.brakeSound = false;
		
		// Reset acceleration keys to prevent movement
		keyData.accelerate = false;
		keyData.brake = false;
		
		// Store current speed for restoration
		if (!currentQuiz) {
			currentQuiz = {savedSpeed: savedSpeed};
		} else {
			currentQuiz.savedSpeed = savedSpeed;
		}
		
		// Select next unused question to ensure all questions appear
		var availableQuestions = quizQuestions.filter(function(q) {
			return usedQuestionIds.indexOf(q.id) === -1;
		});
		
		var selectedQuestion;
		if (availableQuestions.length > 0) {
			// Pick randomly from unused questions
			var randomIndex = Math.floor(Math.random() * availableQuestions.length);
			selectedQuestion = availableQuestions[randomIndex];
			usedQuestionIds.push(selectedQuestion.id);
		} else {
			// All questions used, pick any (shouldn't happen with proper fuel placement)
			selectedQuestion = quizQuestions[0];
		}
		
		// Merge question data with saved speed
		currentQuiz = Object.assign({}, selectedQuestion, {savedSpeed: savedSpeed});
		console.log('Selected quiz:', currentQuiz); // Debug log
		console.log('Used question IDs:', usedQuestionIds); // Debug log
		
	
	// Display HTML quiz modal
	displayHTMLQuizModal();
	
} catch (error) {
	console.error('Error in triggerFuelQuiz:', error);
	// Fallback: just add fuel and continue
	gameData.fuel = Math.min(gameData.fuel + 50, fuelData.total);
	playSound('soundCollectFuel');
	gameData.paused = false;
	// Restore speed if it was saved
	if (currentQuiz && currentQuiz.savedSpeed !== undefined) {
		defaultData.speed = currentQuiz.savedSpeed;
	}
}
}// LEGACY: Old quiz functions removed - now using HTML modal system

// LEGACY: showQuizResult function removed - now handled in HTML modal

// LEGACY: handleQuizContinue function removed - now handled in HTML modal

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
			// Clean up HTML buttons when hiding modal
			var htmlButtons = document.querySelectorAll('.quiz-html-button');
			htmlButtons.forEach(function(btn) { btn.remove(); });
			
			TweenMax.to(quizContainer, 0.5, {alpha: 0, onComplete: function() {
				quizContainer.visible = false;
				// Show PNG buttons again for next time
				buttonQuizA.visible = true;
				buttonQuizB.visible = true;
			}});
		}
	} catch (error) {
		console.error('Error in toggleQuizModal:', error);
	}
}

// Display HTML Quiz Modal
function displayHTMLQuizModal() {
	console.log('=== displayHTMLQuizModal called! ==='); // Debug log
	
	// Simple test to show modal exists
	console.log('DOM ready state:', document.readyState);
	console.log('All elements in DOM:', document.querySelectorAll('*').length);
	
	// Get HTML elements
	var quizModal = document.getElementById('quizModal');
	var quizTitle = document.getElementById('quizTitle');
	var quizQuestion = document.getElementById('quizQuestion');
	var optionA = document.getElementById('quizOptionA');
	var optionB = document.getElementById('quizOptionB');
	var continueBtn = document.getElementById('quizContinue');
	
	console.log('Quiz elements found:', {
		quizModal: !!quizModal,
		quizTitle: !!quizTitle,
		quizQuestion: !!quizQuestion,
		optionA: !!optionA,
		optionB: !!optionB,
		continueBtn: !!continueBtn,
		currentQuiz: !!currentQuiz
	});
	
	if (!quizModal || !currentQuiz) {
		console.error('Quiz modal elements or currentQuiz not found');
		console.error('quizModal:', quizModal);
		console.error('currentQuiz:', currentQuiz);
		return;
	}
	
	// Set content
	quizTitle.textContent = "SCENARIO: " + currentQuiz.section.toUpperCase();
	quizQuestion.textContent = currentQuiz.question;
	optionA.textContent = "A) " + currentQuiz.options[0];
	optionB.textContent = "B) " + currentQuiz.options[1];
	
	// Hide continue button initially
	continueBtn.style.display = 'none';
	
	// Show option buttons
	optionA.style.display = 'flex';
	optionB.style.display = 'flex';
	
	// Remove previous event listeners and classes
	optionA.className = 'quiz-option';
	optionB.className = 'quiz-option';
	optionA.onclick = null;
	optionB.onclick = null;
	continueBtn.onclick = null;
	
	// Add click event listeners
	optionA.onclick = function() { handleHTMLQuizAnswer(0); };
	optionB.onclick = function() { handleHTMLQuizAnswer(1); };
	continueBtn.onclick = function() { hideHTMLQuizModal(); };
	
	// Show modal - ensure it's visible by setting styles
	quizModal.style.display = 'flex';
	quizModal.style.visibility = 'visible';
	quizModal.classList.add('show');
	quizModalActive = true;
}

// Handle HTML Quiz Answer
function handleHTMLQuizAnswer(optionIndex) {
	console.log('Quiz answer selected:', optionIndex); // Debug log
	
	var optionA = document.getElementById('quizOptionA');
	var optionB = document.getElementById('quizOptionB');
	var continueBtn = document.getElementById('quizContinue');
	var quizQuestion = document.getElementById('quizQuestion');
	
	if (!currentQuiz) {
		console.error('No current quiz found');
		return;
	}
	
	var isCorrect = (optionIndex === currentQuiz.correct);
	
	// Style the selected option
	if (optionIndex === 0) {
		optionA.className = isCorrect ? 'quiz-option correct' : 'quiz-option incorrect';
	} else {
		optionB.className = isCorrect ? 'quiz-option correct' : 'quiz-option incorrect';
	}
	
	// Show correct answer if wrong option was selected
	if (!isCorrect) {
		if (currentQuiz.correct === 0) {
			optionA.className = 'quiz-option correct';
		} else {
			optionB.className = 'quiz-option correct';
		}
	}
	
	// Disable option buttons
	optionA.onclick = null;
	optionB.onclick = null;
	optionA.style.cursor = 'default';
	optionB.style.cursor = 'default';
	
	// Increment questions answered counter (regardless of correct/incorrect)
	questionsAnswered++;
	
	// Update question with result
	var resultText = currentQuiz.explanation;
	
	if (isCorrect) {
		// Correct answer: Add 500 points
		playerData.score += 500;
		console.log('Correct answer! Added 500 points. New score:', playerData.score);
		
		// Add fuel and increment completed questions
		quizzesCompleted++;
		correctAnswers++;
		console.log('Quiz completed! Progress:', quizzesCompleted + '/' + totalQuizzes); // Debug log
		gameData.fuel = Math.min(gameData.fuel + 50, fuelData.total);
		playSound('soundCollectFuel');
		
		var remaining = totalQuizzes - questionsAnswered;
		if (remaining <= 0) {
			resultText += "\n\n+500 POINTS! All scenarios completed! Head to the finish line!";
			console.log('ALL QUIZZES ANSWERED! Player can now finish the game.'); // Debug log
		} else {
			resultText += "\n\n+500 POINTS! " + remaining + " more scenarios to go!";
		}
	} else {
		// Incorrect answer: Add 250 points
		playerData.score += 250;
		console.log('Incorrect answer! Added 250 points. New score:', playerData.score);
		
		// Still increment quizzesCompleted so player can finish even with wrong answers
		quizzesCompleted++;
		
		var remaining = totalQuizzes - questionsAnswered;
		if (remaining <= 0) {
			resultText += "\n\n+250 POINTS. Wrong answer! But all scenarios completed - head to the finish line!";
		} else {
			resultText += "\n\n+250 POINTS. Wrong answer! Your time is running low... " + remaining + " more scenarios to go!";
		}
		console.log('Wrong answer given. Quiz count still progresses:', quizzesCompleted + '/' + totalQuizzes); // Debug log
	}
	
	quizQuestion.innerHTML = resultText.replace(/\n/g, '<br>');
	
	// Show continue button
	continueBtn.style.display = 'block';
	
	// Hide option buttons
	optionA.style.display = 'none';
	optionB.style.display = 'none';
}

// Hide HTML Quiz Modal
function hideHTMLQuizModal() {
	console.log('Hiding HTML quiz modal'); // Debug log
	
	var quizModal = document.getElementById('quizModal');
	if (quizModal) {
		quizModal.classList.remove('show');
		quizModal.style.display = 'none';
		quizModal.style.visibility = 'hidden';
	}
	
	// Resume game but keep car stopped
	quizModalActive = false;
	gamePaused = false;
	gameData.paused = false;
	
	// Do NOT restore speed automatically - keep car stopped
	// The player must press accelerate key again to start moving
	defaultData.speed = 0;
	
	// Clear the saved speed data
	if (currentQuiz && currentQuiz.savedSpeed !== undefined) {
		currentQuiz = null; // Clear current quiz
	}
	
	console.log('Game resumed, car stopped - player must accelerate to continue'); // Debug log
}

// Initialize quiz modal - ensure it's hidden on game start
function initializeQuizModal() {
	var quizModal = document.getElementById('quizModal');
	if (quizModal) {
		quizModal.classList.remove('show');
		console.log('Quiz modal initialized and hidden');
	}
}

// Test function for debugging HTML quiz modal
function testHTMLQuizModal() {
	console.log('Testing HTML Quiz Modal...');
	
	// Set up a test quiz
	currentQuiz = {
		section: "Test",
		question: "This is a test question. Can you see this modal?",
		options: ["Yes, I can see it!", "No, it's not working"],
		correct: 0,
		explanation: "Great! The HTML modal is working correctly."
	};
	
	displayHTMLQuizModal();
}

// Simple force show modal function for testing
function forceShowModal() {
	console.log('Force showing modal...');
	var modal = document.getElementById('quizModal');
	if (modal) {
		modal.classList.add('show');
		console.log('Modal should now be visible');
	} else {
		console.error('Modal element not found!');
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
	});		itemTouchDown.addEventListener("pressup", function(evt) {
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
	});		itemTouchRight.addEventListener("pressup", function(evt) {
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
		checkEmailBeforeStart();
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
	
	// Continue button for quiz results
	buttonQuizContinue.cursor = "pointer";
	buttonQuizContinue.addEventListener("click", function(evt) {
		playSound('soundClick');
		handleQuizContinue();
	});
	
	// Removed buttonQuizC and buttonQuizD event handlers - only 2 choices now
	
	// Quiz Yes/No Button Events (no overlay)
	buttonYes.cursor = "pointer";
	buttonYes.addEventListener("click", function(evt) {
		clickQuizYes();
	});
	
	buttonNo.cursor = "pointer";
	buttonNo.addEventListener("click", function(evt) {
		clickQuizNo();
	});
	
	buttonRestart.cursor = "pointer";
	buttonRestart.addEventListener("click", function(evt) {
		playSound('soundClick');
		resetGame();
		goPage('game');
	});

	preventScrolling();
	
	// Load quiz questions early so they're ready when game starts
	loadQuizQuestions();
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
 * EMAIL MODAL HANDLING - Check and capture player email before game starts
 * 
 */

// Check if email exists in session, otherwise show modal
function checkEmailBeforeStart() {
	// Check sessionStorage first
	var storedEmail = sessionStorage.getItem('playerEmail');
	
	if (storedEmail) {
		// Email exists in session, load player data and start game
		playerEmail = storedEmail;
		loadPlayerData(storedEmail, function() {
			goPage('game');
		});
	} else {
		// No email in session, show email modal
		showEmailModal();
	}
}

// Show email modal
function showEmailModal() {
	var emailModal = document.getElementById('emailModal');
	if (emailModal) {
		emailModal.style.display = 'flex';
		emailModalActive = true;
		
		// Set up form submission
		var emailForm = document.getElementById('emailForm');
		if (emailForm) {
			emailForm.onsubmit = handleEmailSubmit;
		}
	}
}

// Hide email modal
function hideEmailModal() {
	var emailModal = document.getElementById('emailModal');
	if (emailModal) {
		emailModal.style.display = 'none';
		emailModalActive = false;
	}
}

// Handle email form submission
function handleEmailSubmit(e) {
	e.preventDefault();
	
	var emailInput = document.getElementById('playerEmail');
	var errorDiv = document.getElementById('emailError');
	var submitBtn = document.getElementById('emailSubmitBtn');
	
	var email = emailInput.value.trim();
	
	// Basic email validation
	if (!email || !email.includes('@')) {
		errorDiv.textContent = 'Please enter a valid email address';
		errorDiv.style.display = 'block';
		return;
	}
	
	// Disable button while processing
	submitBtn.disabled = true;
	submitBtn.textContent = 'Loading...';
	errorDiv.style.display = 'none';
	
	// Register or get player
	fetch(`${API_URL}/players/register`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ email: email })
	})
	.then(response => response.json())
	.then(data => {
		if (data.success) {
			// Store email in sessionStorage
			sessionStorage.setItem('playerEmail', email);
			playerEmail = email;
			currentPlayer = data.player;
			
			console.log('Player registered:', data.message);
			
			// Hide modal and start game
			hideEmailModal();
			goPage('game');
		} else {
			errorDiv.textContent = data.message || 'Registration failed';
			errorDiv.style.display = 'block';
			submitBtn.disabled = false;
			submitBtn.textContent = 'Start Playing';
		}
	})
	.catch(error => {
		console.error('Error registering player:', error);
		errorDiv.textContent = 'Connection error. Make sure server is running.';
		errorDiv.style.display = 'block';
		submitBtn.disabled = false;
		submitBtn.textContent = 'Start Playing';
	});
}

// Load player data from backend
function loadPlayerData(email, callback) {
	fetch(`${API_URL}/players/${encodeURIComponent(email)}`)
	.then(response => response.json())
	.then(data => {
		if (data.success) {
			currentPlayer = data.player;
			console.log('Player data loaded:', currentPlayer);
		}
		if (callback) callback();
	})
	.catch(error => {
		console.error('Error loading player data:', error);
		if (callback) callback();
	});
}

// Record session for player
function recordPlayerSession(sessionId, score) {
	if (!playerEmail) return;
	
	fetch(`${API_URL}/players/${encodeURIComponent(playerEmail)}/sessions`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			session_id: sessionId,
			score: score
		})
	})
	.then(response => response.json())
	.then(data => {
		console.log('Session recorded for player:', data);
	})
	.catch(error => {
		console.error('Error recording player session:', error);
	});
}

// Start new game session with backend tracking
function startGameSession() {
	if (!playerEmail) {
		console.warn('Cannot start session without player email');
		return;
	}
	
	fetch(`${API_URL}/sessions/start`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			email: playerEmail
		})
	})
	.then(response => response.json())
	.then(data => {
		if (data.success) {
			currentSessionId = data.session_id;
			console.log('Game session started:', currentSessionId);
		}
	})
	.catch(error => {
		console.error('Error starting game session:', error);
	});
}

// Record answer to backend
function recordAnswer(questionId, selectedAnswer, isCorrect) {
	if (!currentSessionId || !playerEmail) {
		console.warn('Cannot record answer without session ID or email');
		return;
	}
	
	fetch(`${API_URL}/sessions/answer`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			session_id: currentSessionId,
			email: playerEmail,
			question_id: questionId,
			selected_answer: selectedAnswer,
			is_correct: isCorrect
		})
	})
	.then(response => response.json())
	.then(data => {
		console.log('Answer recorded:', data);
	})
	.catch(error => {
		console.error('Error recording answer:', error);
	});
}

// End game session with final results
function endGameSession(finalScore, fuelRemaining, completed) {
	if (!currentSessionId || !playerEmail) {
		console.warn('Cannot end session without session ID or email');
		return;
	}
	
	fetch(`${API_URL}/sessions/end`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			session_id: currentSessionId,
			email: playerEmail,
			final_score: finalScore,
			fuel_remaining: fuelRemaining,
			completed: completed
		})
	})
	.then(response => response.json())
	.then(data => {
		console.log('Game session ended:', data);
	})
	.catch(error => {
		console.error('Error ending game session:', error);
	});
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
		addRoad(defaultData.segmentLength, defaultData.segmentLength, 0, roadLengthData.curve.hard, 0); // Moderate left turn
		addRoad(defaultData.segmentLength, defaultData.segmentLength, 0, roadLengthData.curve.hard, 0); // Continue left
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
		addRoad(defaultData.segmentLength, defaultData.segmentLength, 0, -roadLengthData.curve.hard, 0); // Moderate right turn
		addRoad(defaultData.segmentLength, defaultData.segmentLength, 0, -roadLengthData.curve.hard, 0); // Continue right
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
	
	// Start backend session tracking
	startGameSession();
	
	// Initialize and hide quiz modal
	initializeQuizModal();
	
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
			
		// Reset quiz progress for new game
		questionsAnswered = 0;
		correctAnswers = 0;
		currentQuizQuestion = null;
		finishAfterLastQuestion = false;
		showingFinishLine = false;
		gameData.waitingAtTunnel = false;
		
		// Randomize and select 3 questions for this game
		if (quizQuestions.length > 0) {
			// Shuffle using Fisher-Yates algorithm for better randomization
			const shuffled = [...quizQuestions];
			for (let i = shuffled.length - 1; i > 0; i--) {
				const j = Math.floor(Math.random() * (i + 1));
				[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
			}
			selectedQuestions = shuffled.slice(0, maxQuestionsPerGame);
			console.log('Selected questions for this game:', selectedQuestions.map(q => q.id));
		} else {
			console.warn('No quiz questions available, using fallback');
			selectedQuestions = [
				{
					id: 1,
					question: "Should you wear a helmet when riding?",
					options: ["Yes", "No"],
					correct: 0
				},
				{
					id: 2,
					question: "Should you follow traffic rules?",
					options: ["Yes", "No"],
					correct: 0
				},
				{
					id: 3,
					question: "Is safe riding important?",
					options: ["Yes", "No"],
					correct: 0
				}
			];
		}
			
		console.log('Quiz system initialized successfully');
		} else {
			console.warn('Quiz container not ready, skipping quiz initialization');
		}
	} catch (error) {
		console.error('Error initializing quiz system:', error);
		// Set fallback to prevent game from breaking
		quizQuestions = [];
		questionsAnswered = 0;
		correctAnswers = 0;
		selectedQuestions = [];
		currentQuizQuestion = null;
	}
	
	defaultData.playerX = 0;
	defaultData.speed = 0;
	
	// Initialize background sprites once (avoid cloning every frame for performance)
	if (!bgSky) {
		bgSky = $.background[backgroundData.sky.id].clone();
		bgSkyMirror = $.background[backgroundData.sky.id].clone();
		bgHills = $.background[backgroundData.hills.id].clone();
		bgHillsMirror = $.background[backgroundData.hills.id].clone();
		bgTrees = $.background[backgroundData.trees.id].clone();
		bgTreesMirror = $.background[backgroundData.trees.id].clone();
	}
	
	// Initialize sprite pool once (avoid cloning sprites every frame - HUGE performance boost)
	if (Object.keys(spritePool).length === 0) {
		var poolCount = 0;
		for (var spriteKey in spritesData) {
			if (spritesData[spriteKey].id) {
				spritePool[spritesData[spriteKey].id] = [];
				// Pre-create pool of sprites for each type
				var poolSize = isMobileDevice ? 20 : 30; // Smaller pool on mobile
				for (var i = 0; i < poolSize; i++) {
					var sprite = $.sprites[spritesData[spriteKey].id].clone();
					sprite.visible = false; // Hidden by default
					spritePool[spritesData[spriteKey].id].push(sprite);
					poolCount++;
				}
			}
		}
	}
	
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
		
		// Score is now only awarded from quiz answers (500 for correct, 250 for incorrect)
		// Removed: playerData.score += Math.floor((5 * Math.round(defaultData.speed/500)) * .03);
		updateGameStatus();
	}
}

/*!
 * 
 * UPDATE FUEL - This is the function that runs to update game fuel
 * 
 */
function updateFuel(){
	// Fuel is now unlimited - fuel bar will remain full
	// Timer only applies to quiz questions (5 seconds to answer)
	/*
	if(defaultData.speed > 0 && !gameData.fuelUpdate && !gameData.paused){
		gameData.fuelUpdate = true;
		TweenMax.to(fuelData, fuelData.updateTime, {overwrite:true, onComplete:function(){
			if (!gameData.paused) {
				gameData.fuel -= fuelData.decrease;
				gameData.fuel = gameData.fuel < 0 ? 0 : gameData.fuel;
			}
			gameData.fuelUpdate = false;
			
			updateGameStatus();
		}});
	}
	*/
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
	// Stop penalty timer if game ended or penalty disabled
	if(gameData.ended || !gameData.penalty || gameData.penaltyTime <= 0){
		return;
	}
	
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
	// checkTJunctionTrigger(playerSegment);
	
	updateCars(dt, playerSegment, playerW);
	
	defaultData.position = getIncrease(defaultData.position, dt * defaultData.speed, defaultData.trackLength);
	
	// Only allow steering if not waiting at tunnel
	if (!gameData.waitingAtTunnel) {
		if (keyData.left){
			defaultData.playerX = defaultData.playerX - dx;
		}else if (keyData.right){
			defaultData.playerX = defaultData.playerX + dx;
		}
	}
	
	// Only apply centrifugal force from curves if not waiting at tunnel and not paused
	if (!gameData.waitingAtTunnel && !gameData.paused) {
		defaultData.playerX = defaultData.playerX - (dx * speedPercent * playerSegment.curve * defaultData.centrifugal);
	}
	
	// Only allow acceleration/braking if not waiting at tunnel
	if (!gameData.waitingAtTunnel) {
		if (keyData.accelerate){
			defaultData.speed = getAccelerate(defaultData.speed, worldData.accel, dt);
		}else if (keyData.brake){
			defaultData.speed = getAccelerate(defaultData.speed, defaultData.breaking, dt);
		}else{
			defaultData.speed = getAccelerate(defaultData.speed, defaultData.decel, dt);
		}
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
	
	// TUNNEL DETECTION - Always check for upcoming tunnels (even when paused)
	// This prevents getting stuck if paused near a tunnel
	if(!gameData.waitingAtTunnel){
		var lookAheadDistance = 100;
		var lookAheadSegment = findSegment(defaultData.position + defaultData.playerZ + lookAheadDistance);
		
		if(lookAheadSegment && lookAheadSegment.sprites){
			for(n = 0; n < lookAheadSegment.sprites.length; n++){
				sprite = lookAheadSegment.sprites[n];
				
				// Check for quiz tunnels (FUEL sprite)
				if(sprite.source.id == 'FUEL' && sprite.active){
					sprite.active = false; // Deactivate so we don't trigger again
					console.log('Quiz tunnel approaching! Stopping car and showing quiz...');
					gameData.waitingAtTunnel = true; // Flag to stop the car
					defaultData.speed = 0; // Stop the car immediately
					gameData.paused = false; // Unpause if paused by something else
					showQuizButtons();
					break; // Only trigger once
				}
				
				// Check for finish line checkpoint (FINISH_LINE sprite)
				if(sprite.source.id == 'FINISH_LINE' && sprite.active){
					sprite.active = false; // Deactivate so we don't trigger again
					console.log('Finish line checkpoint reached! Questions:', questionsAnswered, 'Correct:', correctAnswers);
					
					// Check if player answered all questions (regardless of correct/incorrect)
					if(questionsAnswered >= maxQuestionsPerGame){
						// Stop the car at finish line
						gameData.waitingAtTunnel = true;
						defaultData.speed = 0;
						
						// Show finish line and trigger victory
						console.log('Player answered all questions! Showing finish line and victory!');
						showFinishLine();
					} else {
						console.log('Player did not answer all questions. Continue to run out of fuel.');
						// Player will naturally run out of fuel - do nothing (just pass through)
					}
					break; // Only trigger once
				}
			}
		}
	}
	
	// COLLECTIBLE ITEM COLLISION DETECTION - Check for player collision with sprites (only when game not paused)
	if(!gameData.paused && !gameData.waitingAtTunnel){
		// Regular collision detection for other items
		for(n = 0 ; n < playerSegment.sprites.length ; n++) {
			sprite  = playerSegment.sprites[n];
			if(sprite.active){
				spriteW = sprite.source.w * defaultData.scale;
				// Check if player overlaps with sprite
				if(getOverlap(defaultData.playerX, playerW, sprite.offset + spriteW/2 * (sprite.offset > 0 ? 1 : -1), spriteW)) {
					
					// GOOD COIN (COIN) - Add 500 points
					if(sprite.source.id == 'COIN'){
						sprite.active = false;
						addScore();
					}
					// GOOD COIN (COIN2) - Add 500 points
					else if(sprite.source.id == 'COIN2'){
						sprite.active = false;
						addScore2();
					}
					// KAMOTE COINS - Show educational message (no score deduction)
					else if(sprite.source.id == 'COIN_KAMOTE1' || sprite.source.id == 'COIN_KAMOTE2' || 
					         sprite.source.id == 'COIN_KAMOTE3' || sprite.source.id == 'COIN_KAMOTE4' || 
					         sprite.source.id == 'COIN_KAMOTE5' || sprite.source.id == 'COIN_KAMOTE6'){
						console.log('KAMOTE coin collision detected! Showing message...');
						sprite.active = false;
						showKamoteMessage(); // Show random message from admin panel
						console.log('Kamote message displayed');
					}
					// Note: FUEL/tunnel collision removed - now handled by look-ahead code above
				}	
			}
		}
	}
	
	// If waiting at tunnel, force speed to 0
	if(gameData.waitingAtTunnel){
		defaultData.speed = 0;
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
	defaultData.buildingOffset = getIncrease(defaultData.buildingOffset, defaultData.buildingSpeed * playerSegment.curve * (defaultData.position-startPosition)/defaultData.segmentLength, 1);

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
	renderBackground(background, defaultData.width, defaultData.height, backgroundData.trees, defaultData.buildingOffset, resolution * defaultData.buildingSpeed * playerY);

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
	}		if(segment == playerSegment) {
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
			addRoad(num/2, num, num*2, -roadLengthData.curve.veryHard, 0); // Challenging left turn
		break;
		
		case 'hardRightTurn':
			// Sharp 90-degree right turn after straight section  
			num = num || roadLengthData.length.short;
			addRoad(num*2, num*2, num*2, 0, 0); // Long straight approach
			addRoad(num/2, num, num*2, roadLengthData.curve.veryHard, 0); // Challenging right turn
		break;
		
		case 'tJunctionLeft':
			// T-junction forcing left turn
			num = num || roadLengthData.length.medium;
			addRoad(num*3, num*3, num*3, 0, 0); // Long straight approach
			addRoad(num/3, num/2, num, -roadLengthData.curve.veryHard, 0); // Force left
		break;
		
		case 'tJunctionRight':
			// T-junction forcing right turn
			num = num || roadLengthData.length.medium;
			addRoad(num*3, num*3, num*3, 0, 0); // Long straight approach  
			addRoad(num/3, num/2, num, roadLengthData.curve.veryHard, 0); // Force right
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
			

			// Add buildings to create visual corridor effect
			for (var i = 1; i <= 3; i++) {
				if (triggerSegmentIndex - i >= 0) {
					addSprite(triggerSegmentIndex - i, spritesData.BUILDING1, 2.5);   // Right buildings
					addSprite(triggerSegmentIndex - i, spritesData.BUILDING2A, -2.5);  // Left buildings
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
			addRoad(num/4, num/2, num, -roadLengthData.curve.veryHard, 0); // Challenging hairpin left
			addRoad(num/4, num/2, num, -roadLengthData.curve.veryHard, 0); // Continue left
		break;
		
		case 'hairpinRight':
			// Extreme hairpin right turn
			num = num || roadLengthData.length.short;
			addRoad(num, num, num, 0, 0); // Straight approach
			addRoad(num/4, num/2, num, roadLengthData.curve.veryHard, 0); // Challenging hairpin right
			addRoad(num/4, num/2, num, roadLengthData.curve.veryHard, 0); // Continue right
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
	// Hide and reset finish line overlay
	if (finishLineOverlay) {
		finishLineOverlay.visible = false;
		finishLineOverlay.alpha = 0;
	}
	
	// Hide quiz buttons if visible
	if (quizButtonContainer && quizButtonContainer.visible) {
		quizButtonContainer.visible = false;
		quizButtonContainer.alpha = 0;
		if (quizButtonQuestionTxt) quizButtonQuestionTxt.text = "";
		if (quizButtonQuestionShadowTxt) quizButtonQuestionShadowTxt.text = "";
		if (quizButtonBackground) quizButtonBackground.visible = false;
	}
	
	// Show game status container (score)
	if (gameStatusContainer) {
		gameStatusContainer.visible = true;
	}
	
	// Reset game state
	showingFinishLine = false;
	gameData.ended = false;
	gameData.waitingAtTunnel = false;
	gameData.paused = true; // Will be unpaused by startGame()
	
	// Reset quiz/question state
	questionsAnswered = 0;
	correctAnswers = 0;
	currentQuizQuestion = null;
	finishAfterLastQuestion = false;
	
	// Reset quiz timer
	quizTimerActive = false;
	quizTimeRemaining = 0;
	if (quizTimerInterval) {
		clearInterval(quizTimerInterval);
		quizTimerInterval = null;
	}
	
	// Reset player score
	playerData.score = 0;
	playerData.displayScore = 0;
	
	// Reset player position to start
	defaultData.position = 0;
	defaultData.speed = 0;
	defaultData.playerX = 0;
	
	// Reset legacy quiz variables
	quizzesCompleted = 0;
	gameWon = false;
	
	resetWorld();
	resetRoad();	
	startGame();
}

function resetWorld(){
	defaultData.maxSpeed = (defaultData.segmentLength/(1/60)) * 0.5; // 50% slower speed
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

/**
 * Force straight road sections at specific segment positions
 * Used to ensure tunnels and finish line are on straight roads without curves
 * @param {Array} positions - Array of segment indices to make straight
 */
function forceStraightSections(positions) {
	if (!segments || segments.length === 0) {
		console.error('Cannot force straight sections: segments array is empty');
		return;
	}
	
	var straightRange = 10; // Number of segments before and after to make straight
	
	for (var i = 0; i < positions.length; i++) {
		var centerPos = positions[i];
		
		if (centerPos >= segments.length) {
			console.warn('Position', centerPos, 'is beyond segments length', segments.length);
			continue;
		}
		
		var startPos = Math.max(0, centerPos - straightRange);
		var endPos = Math.min(segments.length - 1, centerPos + straightRange);
		
		// Set curve to 0 for all segments in this range
		for (var j = startPos; j <= endPos; j++) {
			if (segments[j]) {
				segments[j].curve = 0;
			}
		}
		console.log('Forced straight section at segments', startPos, 'to', endPos, 'for position', centerPos);
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
	var targetLength = (typeof finishLinePosition !== 'undefined' ? finishLinePosition : 3000) + 100;
	while (segments.length < targetLength) {
		addRoadType('straight', roadLengthData.length.long);
	}
	
	addRoadType('end');
	
	// Force straight road sections at tunnel and finish line positions to prevent centrifugal force
	forceStraightSections([400, 900, 1400, 1900]);
	
	resetSprites();
	resetCars();
	
	defaultData.trackLength = segments.length * defaultData.segmentLength;
}

/*!
 * 
 * RESET SPRITES - Initialize and place all environmental sprites along the track
 * Creates the dense highway cityscape with buildings and billboards
 * 
 */
function resetSprites() {
	// Dense highway cityscape - tall buildings lined up on both sides creating urban canyon effect
	var lastBillboardPos = -1000; // Track last billboard position to avoid duplicates
	
	for(var n = 3 ; n < segments.length ; n += 2) { // Place sprites every 2 segments for continuous highway feel
		var hasLeftBillboard = false;
		var hasRightBillboard = false;
		
		// BILLBOARDS - Place billboards at consistent intervals, alternating left and right
		// Billboards are placed closer to road and render in front of buildings
		if (spritesData.BILLBOARDS && spritesData.BILLBOARDS.length > 0) {
			var billboardInterval = 100; // Constant distance between billboards
			
			// Check if this segment is close to a billboard position (within 2 segments)
			var nearestBillboardPos = Math.round(n / billboardInterval) * billboardInterval;
			if (Math.abs(n - nearestBillboardPos) <= 2 && nearestBillboardPos !== lastBillboardPos) {
				// Determine which side based on billboard count (alternating)
				var billboardCount = Math.floor(nearestBillboardPos / billboardInterval);
				var isLeftSide = (billboardCount % 2 === 0); // Even = left, odd = right
				
				if (isLeftSide) {
					// Left side billboard
					var leftBBOffset = -0.8; // Position between road center and left buildings
					addSprite(n, randomChoice([spritesData.BILLBOARD01, spritesData.BILLBOARD03]), leftBBOffset);
					hasLeftBillboard = true; // Flag to prevent building spawn on this side
				} else {
					// Right side billboard
					var rightBBOffset = 0.8; // Position between road center and right buildings
					addSprite(n, randomChoice([spritesData.BILLBOARD02, spritesData.BILLBOARD04, spritesData.BILLBOARD05]), rightBBOffset);
					hasRightBillboard = true; // Flag to prevent building spawn on this side
				}
				
				// Mark this billboard position as used
				lastBillboardPos = nearestBillboardPos;
			}
		}
		
		// BUILDINGS - Only spawn if no billboard on that side
		// Buildings are positioned further from road, appearing behind billboards when both exist
		if (!hasLeftBillboard) {
			var leftDistance = -1.5; // Further left creates highway corridor effect
			addSprite(n, randomChoice([spritesData.BUILDING1, spritesData.BUILDING2A, spritesData.BUILDING3B, spritesData.BUILDING4A]), leftDistance);
		}
		
		if (!hasRightBillboard) {
			var rightDistance = 1.5; // Further right creates highway corridor effect
			addSprite(n, randomChoice([spritesData.BUILDING1, spritesData.BUILDING2B, spritesData.BUILDING3A, spritesData.BUILDING3B, spritesData.BUILDING4B]), rightDistance);
		}
	}
	
	resetCollectItems(); // Place coins, fuel, and finish line
}

/*!
 * 
 * RESET COLLECT ITEMS - Place collectible items along the track
 * Includes fuel canisters, coins (kamote), and finish line markers
 * 
 */
function resetCollectItems(){
	// Clear existing collectible sprites from all segments
	for(var n=0; n<segments.length;n++){
		var curSegment = segments[n];
		for(var s = 0 ; s < curSegment.sprites.length ; s++) {
			var sprite  = curSegment.sprites[s];
			// Remove all coin types, tunnel/arc items, and finish line
			if(sprite.source.id == 'COIN' || sprite.source.id == 'COIN2' || 
			   sprite.source.id == 'COIN_KAMOTE1' || sprite.source.id == 'COIN_KAMOTE2' || 
			   sprite.source.id == 'COIN_KAMOTE3' || sprite.source.id == 'COIN_KAMOTE4' || 
			   sprite.source.id == 'COIN_KAMOTE5' || sprite.source.id == 'COIN_KAMOTE6' || 
			   sprite.source.id == 'FUEL' || sprite.source.id == 'FINISH_LINE'){
				curSegment.sprites.splice(s,1);
				s--;
			}
		}	
	}
	
	// ROAD TUNNELS - Place tunnel/arc sprites that trigger quiz when player drives through
	// Positioned at intervals along the highway like real tunnel checkpoints
	// 5 tunnels for 5 questions, then a finish line checkpoint at the 6th position
	var tunnelPositions = [400, 900, 1400, 1900, 2400]; // 5 quiz tunnels
	for(var i = 0; i < tunnelPositions.length; i++) {
		if (tunnelPositions[i] < segments.length) {
			// Place tunnel arc centered on road (offset 0) so player drives through it
			addSprite(tunnelPositions[i], spritesData.FUEL, 0);
		}
	}
	
	// FINISH LINE CHECKPOINT - 6th checkpoint with background_hills.png (same spacing as tunnels)
	var finishCheckpoint = 2900; // Same interval after 5th tunnel
	if (finishCheckpoint < segments.length) {
		// Place finish line checkpoint centered on road
		addSprite(finishCheckpoint, spritesData.FINISH_LINE, 0);
	}
	
	// FINISH LINE - Add victory billboards at the finish line position
	var finishPos = (typeof finishLinePosition !== 'undefined' ? finishLinePosition : 3000);
	if (finishPos < segments.length) {
		addSprite(finishPos, spritesData.BILLBOARD01, 0); // Center victory display
		addSprite(finishPos, spritesData.BILLBOARD02, -0.7); // Left finish marker
		addSprite(finishPos, spritesData.BILLBOARD03, 0.7); // Right finish marker
	}
	
	// KAMOTE COINS - Spawn penalty coins along the track (100% kamote, no good coins)
	// Players must avoid these to prevent score reduction (-700 points each)
	for(var n = randomInt(20, 50) ; n < segments.length ; n += (200 + Math.floor(Math.random()*30))) {
		// Randomly select one of 6 kamote coin variants
		var coinType = randomChoice(spritesData.KAMOTE_COINS);
		console.log('Spawning KAMOTE coin at segment:', n, 'Type:', coinType.id); // Debug log
		
		// Place coin at random offset from road center (±0.1 to ±0.4)
		addSprite(n, coinType, randomChoice([1,-1]) * (0.1 + Math.random()*0.3));
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
	// Use pre-created background sprites instead of cloning every frame (HUGE performance gain)
	var newBackground, newBackgroundMirror;
	
	if (layer.id === backgroundData.sky.id) {
		newBackground = bgSky;
		newBackgroundMirror = bgSkyMirror;
	} else if (layer.id === backgroundData.hills.id) {
		newBackground = bgHills;
		newBackgroundMirror = bgHillsMirror;
	} else if (layer.id === backgroundData.trees.id) {
		newBackground = bgTrees;
		newBackgroundMirror = bgTreesMirror;
	} else {
		// Fallback to cloning for any unknown backgrounds
		newBackground = $.background[layer.id].clone();
		newBackgroundMirror = $.background[layer.id].clone();
	}
	
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

/*!
 * 
 * GET SPRITE FROM POOL - Reuse pre-created sprites instead of cloning (massive performance gain)
 * 
 */
var spritePoolIndex = {}; // Track which sprite to use next from each pool

function getSpriteFromPool(spriteId) {
	if (!spritePool[spriteId] || spritePool[spriteId].length === 0) {
		// Fallback to cloning if pool doesn't exist
		return $.sprites[spriteId].clone();
	}
	
	// Initialize index for this sprite type if needed
	if (!spritePoolIndex[spriteId]) {
		spritePoolIndex[spriteId] = 0;
	}
	
	// Get next sprite from pool (circular buffer)
	var sprite = spritePool[spriteId][spritePoolIndex[spriteId]];
	spritePoolIndex[spriteId] = (spritePoolIndex[spriteId] + 1) % spritePool[spriteId].length;
	
	// Reset sprite properties
	sprite.visible = true;
	sprite.alpha = 1;
	sprite.scaleX = sprite.scaleY = 1;
	sprite.rotation = 0;
	
	return sprite;
}

/*!
 * 
 * RENDER SPRITE - Draw individual sprite (building, car, billboard, coin, etc.) on the canvas
 * Handles scaling, positioning, and height multipliers for 3D effect
 * 
 * @param {number} width - Canvas width
 * @param {number} height - Canvas height
 * @param {number} resolution - Rendering resolution
 * @param {number} roadWidth - Width of the road for scaling
 * @param {object} sprites - Sprite collection
 * @param {object} sprite - Individual sprite to render
 * @param {number} scale - Scale factor based on distance from camera
 * @param {number} destX - X position on canvas
 * @param {number} destY - Y position on canvas
 * @param {number} offsetX - X offset adjustment
 * @param {number} offsetY - Y offset adjustment
 * @param {number} clipY - Y clipping for horizon effect
 */
function renderSprite(width, height, resolution, roadWidth, sprites, sprite, scale, destX, destY, offsetX, offsetY, clipY){
	// Use sprite pool instead of cloning - MAJOR performance improvement
	var newSprite = getSpriteFromPool(sprite.id);
	
	// BUILDING HEIGHT MULTIPLIER - Make buildings appear taller for highway skyline effect
	// Buildings are rendered 2.5x their actual height to create towering cityscape
	var heightMultiplier = 1.0; // Default: normal height for all sprites
	var widthMultiplier = 1.0; // Default: normal width for all sprites
	
	if(sprite.id.indexOf('BUILDING') === 0) {
		heightMultiplier = 2.5; // Buildings: 2.5x taller for dramatic urban effect
	}
	
	// TUNNEL WIDTH MULTIPLIER - Make tunnel/arc span the entire road width
	// Tunnel appears as a full-width overhead arc that player drives through
	if(sprite.id === 'FUEL') {
		widthMultiplier = 2.8; // Tunnel: 3x wider to cover full road width
		heightMultiplier = 1.5; // Tunnel: 1.5x taller for proper arc proportions
	}
	
	// FINISH LINE MULTIPLIER - Make finish line checkpoint large and visible
	// Displays Manila skyline background as a prominent checkpoint marker
	if(sprite.id === 'FINISH_LINE') {
		widthMultiplier = 3.5; // Finish line: extra wide to span across road
		heightMultiplier = 2.0; // Finish line: tall to be prominent
	}
	
	// Calculate destination width and height with scaling
    var destW  = (newSprite.image.naturalWidth * scale * width/2) * (defaultData.scale * roadWidth) * widthMultiplier;
    var destH  = (newSprite.image.naturalHeight * scale * width/2) * (defaultData.scale * roadWidth) * heightMultiplier;

	// Apply position offsets
    destX = destX + (destW * (offsetX || 0));
    destY = destY + (destH * (offsetY || 0));
    
    // CENTER TUNNEL - Adjust X position to perfectly center wide tunnel on road
    // The sprite expands from its anchor point, so we need to shift it to true center
    if(sprite.id === 'FUEL' || sprite.id === 'FINISH_LINE') {
    	var originalW = (newSprite.image.naturalWidth * scale * width/2) * (defaultData.scale * roadWidth);
    	// Shift left by half the extra width to center perfectly
    	destX = destX - ((destW - originalW) * 0.75); // 0.5 = half, centers sprite with equal margins
    }
	
	// Calculate clipping height for horizon line (sprites disappear over horizon)
    var clipH = clipY ? Math.max(0, destY+destH-clipY) : 0;
    
    // Only render sprite if it's visible (not completely clipped)
    if (clipH < destH){
		newSprite.x = destX;
		newSprite.y = destY;
		newSprite.scaleX = destW/sprite.w; // Scale width
		newSprite.scaleY = (destH - clipH)/sprite.h; // Scale height with clipping
		
		worldContainer.addChild(newSprite); // Add to render container
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
			smokeSpriteL.x = newSprite.x + (-20 * sPercent);
			smokeSpriteL.y = newSprite.y + ((140 + extraTop) * sPercent);
			smokeSpriteL.scaleX = newSprite.scaleX;
			smokeSpriteL.scaleY = newSprite.scaleY;
			worldContainer.addChild(smokeSpriteL);
		}
		
		if(rightSmoke && defaultData.speed > 0){
			var smokeSpriteR = smokeAnimate.clone();
			smokeSpriteR.x = newSprite.x + (70 * sPercent);
			smokeSpriteR.y = newSprite.y + ((140 + extraTop) * sPercent);
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
 * COLLECT ITEMS - Scoring and camera functions for collectible items
 * 
 */

/**
 * Update camera position based on player Z position
 */
function updateCamera(){
	defaultData.playerZ = (worldData.cameraHeight * defaultData.cameraDepth);
}

/**
 * Add score for collecting COIN (+500 points)
 * Plays coin collection sound and displays score text
 */
function addScore(){
	playSound('soundCollectCoin');
	playerData.score += scoreData.coin; // Add 500 points
	updateGameText(statusData.score.text.replace('[NUMBER]', scoreData.coin), statusData.score.color, statusData.score.size, 1);
}

/**
 * Add score for collecting COIN2 (+500 points)
 * Same behavior as regular coin
 */
function addScore2(){
	playSound('soundCollectCoin');
	playerData.score += scoreData.coin; // Add 500 points (same as COIN)
	updateGameText(statusData.score.text.replace('[NUMBER]', scoreData.coin), statusData.score.color, statusData.score.size, 1);
}

/**
 * Subtract score for collecting KAMOTE coin (-700 points penalty)
 * Plays hit sound and displays red negative score text
 * Prevents score from going below zero
 * DEPRECATED: Now replaced by showKamoteMessage() which displays thought bubble instead
 */
function subtractScore(){
	console.log('subtractScore called! Score before:', playerData.score);
	playSound('soundHit'); // Hit sound for penalty
	playerData.score -= 100; // Subtract 100 points penalty
	
	if (playerData.score < 0) {
		console.log('Score was negative, setting to 0');
		playerData.score = 0;
	}
	console.log('Final score:', playerData.score);
	// Display red text showing score penalty
	updateGameText('-100 SCORE', '#ff0000', 70, 1);
}

/**
 * Show random kamote message when hitting kamote coin
 * Displays dynamic message from admin panel as a thought bubble
 * Does NOT deduct score - just shows educational message
 */
function showKamoteMessage(){
	console.log('showKamoteMessage called - displaying kamote popup image');
	console.log('Loader result for KAMOTE_POPUP:', loader.getResult('KAMOTE_POPUP'));
	console.log('canvasContainer:', canvasContainer);
	
	// Play sound effect
	playSound('soundHit');
	
	// Create popup container if it doesn't exist
	if (!kamotePopupContainer) {
		console.log('Creating new kamotePopupContainer');
		kamotePopupContainer = new createjs.Container();
		kamotePopupContainer.visible = false;
		kamotePopupContainer.alpha = 0;
		
		// Create kamote popup image
		var kamoteImage = loader.getResult('KAMOTE_POPUP');
		console.log('Kamote image loaded:', kamoteImage);
		
		if (!kamoteImage) {
			console.error('KAMOTE_POPUP image not found in loader!');
			return;
		}
		
		var kamotePopup = new createjs.Bitmap(kamoteImage);
		kamotePopup.x = canvasW / 2;
		kamotePopup.y = canvasH * 0.3; // 30% from top (10% margin + image space)
		centerReg(kamotePopup);
		
		// Scale image to fit nicely on screen (responsive)
		var targetWidth = Math.min(canvasW * 0.5, 400); // 50% of screen width, max 400px
		var scale = targetWidth / kamotePopup.image.width;
		kamotePopup.scaleX = kamotePopup.scaleY = scale;
		
		console.log('Kamote popup created at position:', kamotePopup.x, kamotePopup.y, 'scale:', scale);
		
		kamotePopupContainer.addChild(kamotePopup);
		
		// Add to canvasContainer (top level) so it appears above everything
		canvasContainer.addChild(kamotePopupContainer);
		console.log('Kamote popup container added to canvasContainer');
	}
	
	console.log('Showing kamote popup...');
	// Show popup with fade in animation
	kamotePopupContainer.visible = true;
	TweenMax.killTweensOf(kamotePopupContainer);
	TweenMax.to(kamotePopupContainer, 0.3, {alpha: 1, onComplete: function() {
		console.log('Kamote popup fade in complete, alpha:', kamotePopupContainer.alpha);
	}});
	
	// Hide after 1.5 seconds with fade out
	TweenMax.to(kamotePopupContainer, 0.3, {alpha: 0, delay: 1.5, onComplete: function() {
		kamotePopupContainer.visible = false;
		console.log('Kamote popup hidden');
	}});
}

/**
 * Add fuel/time when collecting fuel canister
 * Increases time remaining, capped at maximum
 */
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
	
	//fuel - Keep fuel bar full (unlimited fuel)
	var fuelPercent = fuelData.bar.width - (fuelData.bar.space*2); // Always full
	fuelBarFill.graphics.clear();
	fuelBarFill.graphics.beginFill(fuelData.bar.fillColor).drawRect(0, 0, fuelPercent, fuelData.bar.height - (fuelData.bar.space * 4));
	
	// Fuel warnings and game over disabled - fuel is unlimited
	// Timer only applies to quiz questions
	/*
	if(gameData.fuel < (fuelData.total/100 * 25) && !gameData.penalty){
		updateGameText(statusData.lowFuel.text, statusData.lowFuel.color, statusData.lowFuel.size, 0);
	}
	
	if(!gameData.paused && gameData.fuel <= 0){
		updateGameText(statusData.noFuel.text, statusData.noFuel.color, statusData.noFuel.size, 0);	
		endGame();	
	}
	*/
}

function updateGameText(text, color, size, delay, showBackground){
	gameStatusContainer.visible = true;
	
	// Calculate responsive max width with margins (80% of screen width with min 300px and max 600px)
	var maxWidth = Math.min(Math.max(canvasW * 0.8, 300), 600);
	
	// Set font first to measure text correctly
	gameStatusTxt.font = size+"px Mont Heavy DEMO";
	gameStatusShadowTxt.font = size+"px Mont Heavy DEMO";
	gameStatusTxt.color = color;
	
	// Set initial text to measure
	gameStatusTxt.text = text;
	var textWidth = gameStatusTxt.getMeasuredWidth();
	
	// If text is too wide, wrap it
	if (textWidth > maxWidth) {
		var words = text.split(' ');
		var lines = [];
		var currentLine = '';
		
		for (var i = 0; i < words.length; i++) {
			var testLine = currentLine + (currentLine ? ' ' : '') + words[i];
			gameStatusTxt.text = testLine;
			var testWidth = gameStatusTxt.getMeasuredWidth();
			
			if (testWidth > maxWidth && currentLine !== '') {
				lines.push(currentLine);
				currentLine = words[i];
			} else {
				currentLine = testLine;
			}
		}
		if (currentLine) {
			lines.push(currentLine);
		}
		
		text = lines.join('\n');
	}
	
	// Set final wrapped text
	gameStatusTxt.text = text;
	gameStatusShadowTxt.text = text;
	
	// Only show background for kamote messages and questions (when showBackground is true)
	if (showBackground) {
		// Measure final text dimensions for background box
		var textBounds = gameStatusTxt.getBounds();
		if (!textBounds) {
			// If bounds not available, estimate from text metrics
			var measuredWidth = gameStatusTxt.getMeasuredWidth();
			var lineCount = text.split('\n').length;
			var lineHeight = gameStatusTxt.getMeasuredLineHeight();
			textBounds = {
				width: measuredWidth,
				height: lineHeight * lineCount,
				x: -measuredWidth / 2, // Center aligned text
				y: -lineHeight * lineCount // Alphabetic baseline
			};
		}
		
		// Draw responsive text box background with equal padding
		var padding = 25; // Padding around text
		var boxWidth = textBounds.width + (padding * 2);
		var boxHeight = textBounds.height + (padding * 2);
		
		// Calculate position relative to text position (canvasH/100 * 30)
		// textBounds.y is negative (above baseline), textBounds.height is total height
		var textCenterY = (canvasH / 100 * 30) + textBounds.y + (textBounds.height / 2);
		
		var boxX = (canvasW / 2) - (boxWidth / 2);
		var boxY = textCenterY - (boxHeight / 2);
		
		gameStatusBackground.graphics.clear();
		gameStatusBackground.visible = true;
		
		// Draw rounded rectangle with semi-transparent white background
		gameStatusBackground.graphics
			.beginFill('rgba(255, 255, 255, 0.5)') // White with 95% opacity - more opaque for better readability
			.drawRoundRect(boxX, boxY, boxWidth, boxHeight, 15); // 15px rounded corners
		
		// Draw border/outline for game-like text box effect
		gameStatusBackground.graphics
			.setStrokeStyle(3)
			.beginStroke('rgba(45, 72, 80, 0.4)') // Yamaha blue tinted border with opacity
			.drawRoundRect(boxX, boxY, boxWidth, boxHeight, 15);
	} else {
		// Hide background for other messages (score, fuel, etc.)
		gameStatusBackground.visible = false;
	}
	
	if(delay > 0){
		TweenMax.to(gameStatusContainer, delay, {overwrite:true, onComplete:function(){
			gameStatusContainer.visible = false;
			gameStatusBackground.visible = false;
		}});
	}
}

function endGame(){
	if(!gameData.ended){
		gameData.paused = true;
		gameData.ended = true;
		
		// End backend session tracking (game over - not completed successfully)
		endGameSession(playerData.score, gameData.fuel, false);
		
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
 * UTILITY FUNCTIONS - Essential helper functions for game functionality
 * 
 */
function randomChoice(array) {
	return array[Math.floor(Math.random() * array.length)];
}

function randomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function addCommas(nStr) {
	nStr += '';
	var x = nStr.split('.');
	var x1 = x[0];
	var x2 = x.length > 1 ? '.' + x[1] : '';
	var rgx = /(\d+)(\d{3})/;
	while (rgx.test(x1)) {
		x1 = x1.replace(rgx, '$1' + ',' + '$2');
	}
	return x1 + x2;
}

function toInt(obj, def) {
	if (obj !== null) {
		var x = parseInt(obj, 10);
		return (isNaN(x)) ? def : x;
	}
	return def;
}

// Additional utility functions for game mechanics
function getIncrease(start, increment, max) {
	var result = start + increment;
	while (result >= max) result -= max;
	while (result < 0) result += max;
	return result;
}

function getAccelerate(v, accel, dt) {
	return v + (accel * dt);
}

function getLimit(value, min, max) {
	return (value < min) ? min : (value > max) ? max : value;
}

function getOverlap(x1, w1, x2, w2, percent) {
	var half = (percent || 1) / 2;
	var min1 = x1 - (w1 * half);
	var max1 = x1 + (w1 * half);
	var min2 = x2 - (w2 * half);
	var max2 = x2 + (w2 * half);
	return !((max1 < min2) || (min1 > max2));
}

function percentRemaining(n, total) {
	return (n % total) / total;
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

/**
 * Show Quiz Buttons (Yes/No) without overlay
 * Displays buttons on screen when player hits tunnel
 */
function showQuizButtons() {
	console.log('showQuizButtons called');
	console.log('questionsAnswered:', questionsAnswered, 'maxQuestionsPerGame:', maxQuestionsPerGame);
	
	// Check if all questions have been answered
	if (questionsAnswered >= maxQuestionsPerGame) {
		console.log('All questions answered, skipping quiz');
		return;
	}
	
	// Ensure we have selected questions
	if (!selectedQuestions || selectedQuestions.length === 0) {
		console.warn('No selected questions, using fallback');
		selectedQuestions = [{
			id: 1,
			question: "Should you wear a helmet when riding?",
			options: ["Yes", "No"],
			correct: 0
		}];
	}
	
	// Get the next question from selected questions
	// Make sure we have a question for this index
	if (questionsAnswered >= selectedQuestions.length) {
		console.error('No more questions available! questionsAnswered:', questionsAnswered, 'selectedQuestions.length:', selectedQuestions.length);
		// Add a fallback question
		currentQuizQuestion = {
			id: questionsAnswered + 1,
			question: "Should you always follow traffic rules?",
			options: ["Yes", "No"],
			correct: 0
		};
	} else {
		currentQuizQuestion = selectedQuestions[questionsAnswered];
	}
	
	console.log('Quiz question selected:', currentQuizQuestion, 'Question number:', questionsAnswered + 1);
	
	// Safety check: ensure currentQuizQuestion is valid
	if (!currentQuizQuestion || !currentQuizQuestion.question) {
		console.error('Invalid question object!', currentQuizQuestion);
		currentQuizQuestion = {
			id: 1,
			question: "Is safety important when riding?",
			options: ["Yes", "No"],
			correct: 0
		};
	}
	
	// Set the question text
	if (quizButtonQuestionTxt && quizButtonQuestionShadowTxt) {
		// Set question text (without timer - timer is separate now)
		quizButtonQuestionTxt.text = currentQuizQuestion.question;
		quizButtonQuestionShadowTxt.text = currentQuizQuestion.question;
		console.log('Question text set to:', currentQuizQuestion.question);
		
		// Position and scale the background image
		if (quizButtonBackground) {
			// Calculate responsive scaling with proper margins
			var maxWidth = Math.min(canvasW * 0.8, 800); // Max 80% width (10% margin each side) or 800px
			var maxHeight = canvasH * 0.4; // Max 40% of screen height
			
			var imageWidth = quizButtonBackground.image.width;
			var imageHeight = quizButtonBackground.image.height;
			
			// Scale to fit within constraints while maintaining aspect ratio
			var scale = Math.min(maxWidth / imageWidth, maxHeight / imageHeight, 1);
			quizButtonBackground.scaleX = quizButtonBackground.scaleY = scale;
			
			// Position background in upper portion of screen
			quizButtonBackground.x = canvasW / 2;
			quizButtonBackground.y = canvasH * 0.25; // 25% from top
			quizButtonBackground.visible = true;
			
			// Get scaled dimensions
			var scaledWidth = imageWidth * scale;
			var scaledHeight = imageHeight * scale;
			
			// Define text area within the background (maximize available space)
			var textMaxWidth = scaledWidth * 0.85; // 85% of background width for text
			var textMaxHeight = scaledHeight * 0.8; // 80% of background height for text
			
			// Smart font sizing - start with a larger base size and adjust
			var baseFontSize = Math.min(scaledHeight * 0.12, 60); // Base on image size, max 60px
			var fontSize = baseFontSize;
			var textFits = false;
			
			// Try decreasing font sizes until text fits
			for (var testSize = fontSize; testSize >= 24; testSize -= 2) {
				quizButtonQuestionTxt.font = 'bold ' + testSize + 'px Mont Heavy DEMO';
				quizButtonQuestionShadowTxt.font = 'bold ' + testSize + 'px Mont Heavy DEMO';
				quizButtonQuestionTxt.lineWidth = textMaxWidth;
				quizButtonQuestionShadowTxt.lineWidth = textMaxWidth;
				
				// Measure text bounds
				var textBounds = quizButtonQuestionTxt.getBounds();
				if (!textBounds) {
					textBounds = {
						height: quizButtonQuestionTxt.getMeasuredLineHeight() * (currentQuizQuestion.question.split('\n').length || 1)
					};
				}
				
				// Check if text fits within available height
				if (textBounds.height <= textMaxHeight) {
					fontSize = testSize;
					textFits = true;
					break;
				}
			}
			
			// If still doesn't fit, use minimum size
			if (!textFits) {
				fontSize = 24;
				quizButtonQuestionTxt.font = 'bold ' + fontSize + 'px Mont Heavy DEMO';
				quizButtonQuestionShadowTxt.font = 'bold ' + fontSize + 'px Mont Heavy DEMO';
			}
			
			console.log('Question font size:', fontSize, 'Text area:', textMaxWidth, 'x', textMaxHeight);
			
			// Position question text inside the background image (centered)
			quizButtonQuestionTxt.lineWidth = textMaxWidth;
			quizButtonQuestionShadowTxt.lineWidth = textMaxWidth;
			quizButtonQuestionTxt.x = canvasW / 2;
			quizButtonQuestionShadowTxt.x = canvasW / 2;
			quizButtonQuestionTxt.y = quizButtonBackground.y;
			quizButtonQuestionShadowTxt.y = quizButtonBackground.y;
			
			// Position buttons below the background image
			var buttonY = quizButtonBackground.y + (scaledHeight / 2) + 80; // 80px below image
			if (buttonYes) buttonYes.y = buttonY;
			if (buttonNo) buttonNo.y = buttonY;
			
			// Position timer bar above the background image
			if (quizTimerBarBackground && quizTimerBarEmpty && quizTimerBarFill) {
				var timerY = quizButtonBackground.y - (scaledHeight / 2) - 30; // Above image
				quizTimerBarBackground.x = canvasW / 2 - 150; // Center (300px / 2)
				quizTimerBarBackground.y = timerY;
				quizTimerBarEmpty.x = quizTimerBarBackground.x + 2;
				quizTimerBarEmpty.y = quizTimerBarBackground.y + 2;
				quizTimerBarFill.x = quizTimerBarBackground.x + 2;
				quizTimerBarFill.y = quizTimerBarBackground.y + 2;
				// Draw initial full bar (green)
				quizTimerBarFill.graphics.clear();
				quizTimerBarFill.graphics.beginFill('#00ff00').drawRect(0, 0, 296, 16);
			}
		}
	} else {
		console.error('Question text elements not found!');
		console.log('quizButtonQuestionTxt:', quizButtonQuestionTxt);
		console.log('quizButtonQuestionShadowTxt:', quizButtonQuestionShadowTxt);
	}
	
	// Pause the game
	gameData.paused = true;
	console.log('Game paused for quiz');
	
	// Start 5-second quiz timer
	quizTimeRemaining = quizTimeLimit;
	quizTimerActive = true;
	
	// Clear any existing timer
	if (quizTimerInterval) {
		clearInterval(quizTimerInterval);
	}
	
	// Start countdown timer (updates every 100ms for smooth display)
	quizTimerInterval = setInterval(function() {
		if (quizTimerActive && quizTimerBarFill) {
			quizTimeRemaining -= 0.1;
			
			// Update timer bar fill (green to red gradient)
			var timePercent = quizTimeRemaining / quizTimeLimit;
			var barWidth = 296 * timePercent; // Max width is 296
			
			// Color transition: green -> yellow -> red
			var barColor = '#00ff00'; // Green
			if (timePercent < 0.5) {
				barColor = '#ffff00'; // Yellow
			}
			if (timePercent < 0.25) {
				barColor = '#ff0000'; // Red
			}
			
			quizTimerBarFill.graphics.clear();
			quizTimerBarFill.graphics.beginFill(barColor).drawRect(0, 0, barWidth, 16);
			
			// Time's up!
			if (quizTimeRemaining <= 0) {
				clearInterval(quizTimerInterval);
				quizTimerActive = false;
				
				// Auto-fail: select the wrong answer (opposite of correct answer)
				// If correct is 0, select 1; if correct is 1, select 0
				var wrongAnswer = currentQuizQuestion.correct === 0 ? 1 : 0;
				console.log('Time\'s up! Auto-failing quiz question with wrong answer:', wrongAnswer);
				handleQuizAnswer(wrongAnswer);
			}
		}
	}, 100);
	
	// Show buttons
	if (quizButtonContainer) {
		quizButtonContainer.visible = true;
		quizButtonContainer.alpha = 0;
		TweenMax.to(quizButtonContainer, 0.3, {alpha: 1});
		console.log('Quiz buttons container shown and animating');
	} else {
		console.error('quizButtonContainer not found!');
	}
}

/**
 * Hide Quiz Buttons
 */
function hideQuizButtons() {
	if (quizButtonContainer) {
		TweenMax.to(quizButtonContainer, 0.3, {alpha: 0, onComplete: function() {
			quizButtonContainer.visible = false;
			// Clear question text
			if (quizButtonQuestionTxt && quizButtonQuestionShadowTxt) {
				quizButtonQuestionTxt.text = "";
				quizButtonQuestionShadowTxt.text = "";
				// Reset positions to original
				quizButtonQuestionTxt.y = canvasH/100 * 50;
				quizButtonQuestionShadowTxt.y = canvasH/100 * 50;
			}
			// Clear timer bar
			if (quizTimerBarFill) {
				quizTimerBarFill.graphics.clear();
			}
			// Reset button positions
			if (buttonYes) buttonYes.y = canvasH/100 * 70;
			if (buttonNo) buttonNo.y = canvasH/100 * 70;
			// Hide background
			if (quizButtonBackground) {
				quizButtonBackground.visible = false;
			}
		}});
	}
}

/**
 * Show Finish Line - Display background_hills.png and trigger victory
 */
function showFinishLine() {
	console.log('=== FINISH LINE REACHED! ===');
	
	// Set flag to hide tunnel sprites
	showingFinishLine = true;
	
	// Stop penalty timer and clear any penalty display
	gameData.penalty = false;
	gameData.penaltyTime = 0;
	gameData.ended = true; // Mark game as ended to stop all timers
	TweenMax.killTweensOf(gameContainer);
	
	// Hide game status container immediately
	gameStatusContainer.visible = false;
	
	// Create finish line overlay with background_hills.png
	if (!finishLineOverlay) {
		finishLineOverlay = new createjs.Container();
		
		// Create semi-transparent black background
		var overlayBg = new createjs.Shape();
		overlayBg.graphics.beginFill("rgba(0,0,0,0.7)").drawRect(0, 0, canvasW, canvasH);
		
		// Create finish line image (background_hills.png)
		var finishImage = new createjs.Bitmap(loader.getResult('hills'));
		finishImage.x = canvasW / 2;
		finishImage.y = canvasH / 2;
		centerReg(finishImage);
		
		// Scale image to fit screen nicely
		var scale = Math.min(canvasW / finishImage.image.width, canvasH / finishImage.image.height) * 0.8;
		finishImage.scaleX = finishImage.scaleY = scale;
		
		finishLineOverlay.addChild(overlayBg, finishImage);
		finishLineOverlay.alpha = 0;
		mainContainer.addChild(finishLineOverlay);
	}
	
	// Fade in the finish line overlay
	finishLineOverlay.visible = true;
	TweenMax.to(finishLineOverlay, 0.5, {alpha: 1, onComplete: function() {
		// Show victory message after finish line
		showVictoryMessage();
	}});
}

/**
 * Handle Yes Button Click
 */
function clickQuizYes() {
	playSound('soundClick');
	handleQuizAnswer(0); // "Yes" is option index 0
}

/**
 * Handle No Button Click
 */
function clickQuizNo() {
	playSound('soundClick');
	handleQuizAnswer(1); // "No" is option index 1
}

/**
 * Process quiz answer
 */
function handleQuizAnswer(selectedIndex) {
	if (!currentQuizQuestion) {
		console.error('No current quiz question');
		hideQuizButtons();
		gameData.paused = false; // Resume game
		return;
	}
	
	// Stop the quiz timer
	quizTimerActive = false;
	if (quizTimerInterval) {
		clearInterval(quizTimerInterval);
		quizTimerInterval = null;
	}
	
	const isCorrect = selectedIndex === currentQuizQuestion.correct;
	console.log('Answer selected:', selectedIndex, 'Correct:', currentQuizQuestion.correct, 'Is correct:', isCorrect);
	
	// Record answer to backend
	recordAnswer(currentQuizQuestion.id, selectedIndex, isCorrect);
	
	if (isCorrect) {
		// Correct answer - add 500 points
		playerData.score += 500;
		correctAnswers++;
		console.log('Correct answer! Added 500 points. New score:', playerData.score, 'Correct answers:', correctAnswers);
		
		// No fuel bonus needed (fuel is unlimited)
		playSound('soundCollectFuel');
		updateGameText('+500 POINTS', '#029202ff', 60, 1.5, false);
	} else {
		// Incorrect answer - add 250 points
		playerData.score += 250;
		console.log('Incorrect answer! Added 250 points. New score:', playerData.score, 'Correct answers:', correctAnswers);
		
		playSound('soundHit');
		updateGameText('+250 POINTS', '#ff0000', 60, 1.5, false);
	}
	
	// Increment questions answered count
	questionsAnswered++;
	console.log('Questions answered:', questionsAnswered, '/', maxQuestionsPerGame, 'Correct:', correctAnswers);
	
	// After answering, player continues driving
	// The next tunnel will check if all questions are answered and trigger finish line
	
	// Hide buttons and resume game
	hideQuizButtons();
	defaultData.playerX = 0; // Reset player to center of road to prevent centrifugal drift
	gameData.paused = false; // Resume game
	gameData.waitingAtTunnel = false; // Allow car to move again
	console.log('Game resumed, car centered and can move to next tunnel');
	currentQuizQuestion = null;
}