////////////////////////////////////////////////////////////
// MAIN
////////////////////////////////////////////////////////////
var stageW=768;
var stageH=1024;
var contentW = 576;
var contentH = 900;

/*!
 * 
 * START BUILD GAME - This is the function that runs build game
 * 
 */
function initMain(){
	if(isDesktop){
		$('#canvasHolder').show();	
	}
	
	initGameCanvas(stageW,stageH);
	buildGameCanvas();
	buildGameButton();
	if ( typeof buildScoreBoardCanvas == 'function' ) { 
		buildScoreBoardCanvas();
	}
	
	playMusicLoop('musicGame');
	setSoundLoopVolume('soundEngine', 0);
	
	// Check if we're in test mode for the end screen
	var urlParams = new URLSearchParams(window.location.search);
	if (urlParams.get('testEndScreen') === 'true') {
		// Show game container and trigger victory screen for testing
		goPage('game');
		setTimeout(function() {
			// Set a test score
			playerData.score = 12500;
			showVictoryMessage();
		}, 500);
	} else {
		goPage('main');
	}
	
	resizeCanvas();
}

var windowW=windowH=0;
var scalePercent=0;
const dpr = window.devicePixelRatio || 1;
const offset = {x:0,y:0,left:0,top:0};

/*!
 * 
 * GAME RESIZE - This is the function that runs to resize and centralize the game
 * 
 */
function resizeGameFunc(){
	setTimeout(function() {
		$('.mobileRotate').css('left', checkContentWidth($('.mobileRotate')));
		$('.mobileRotate').css('top', checkContentHeight($('.mobileRotate')));
		
		windowW = window.innerWidth;
		windowH = window.innerHeight;
		scalePercent = Math.min(windowW/contentW,windowH/contentH);
		scalePercent = scalePercent > 1 ? 1 : scalePercent;
		
		if(windowW > stageW && windowH > stageH){
			if(windowW > stageW){
				scalePercent = windowW/stageW;
				if((stageH*scalePercent)>windowH){
					scalePercent = windowH/stageH;
				}	
			}
		}
		
		const cssWidth = stageW * scalePercent;
		const cssHeight = stageH * scalePercent;
		
		offset.left = 0;
		offset.top = 0;
		
		if(cssWidth > windowW){
			offset.left = -((cssWidth) - windowW);
		}else{
			offset.left = windowW - (cssWidth);
		}
		
		if(cssHeight > windowH){
			offset.top = -((cssHeight) - windowH);
		}else{
			offset.top = windowH - (cssHeight);	
		}
		
		offset.x = 0;
		offset.y = 0;
		
		if(offset.left < 0){
			offset.x = Math.abs((offset.left/scalePercent)/2);
		}
		if(offset.top < 0){
			offset.y = Math.abs((offset.top/scalePercent)/2);
		}
		
		$(window).scrollTop(0);
		
		resizeCanvas();
		if ( typeof resizeScore == 'function' ) { 
			resizeScore();
		}
	}, 100);	
}