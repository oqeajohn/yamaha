////////////////////////////////////////////////////////////
// INIT
////////////////////////////////////////////////////////////
var stageWidth,stageHeight=0;
var isLoaded=false;
 
 /*!
 * 
 * DOCUMENT READY
 * 
 */
$(function() {
	var resumeAudioContext = function() {
		// handler for fixing suspended audio context in Chrome
		try {
			if (createjs.WebAudioPlugin.context.state === "suspended") {
				createjs.WebAudioPlugin.context.resume();
				// Should only need to fire once
				window.removeEventListener("click", resumeAudioContext);
			}
		} catch (e) {
			// SoundJS context or web audio plugin may not exist
			console.error("There was an error while trying to resume the SoundJS Web Audio context...");
			console.error(e);
		}
	};
	window.addEventListener("click", resumeAudioContext);
	 
	 // Check for running exported on file protocol
	if (window.location.protocol.substr(0, 4) === "file"){
		alert("To install the game just upload folder 'game' to your server. The game won't run locally with some browser like Chrome due to some security mode.");
	}
	 
	 
	$(window).resize(function(){
		resizeLoaderFunc();
	});
	resizeLoaderFunc();
	checkBrowser();
});

/*!
 * 
 * LOADER RESIZE - This is the function that runs to centeralised loader when resize
 * 
 */
 function resizeLoaderFunc(){
	stageWidth=$(window).width();
	stageHeight=$(window).height();
	
	$('#mainLoader').css('left', checkContentWidth($('#mainLoader')));
	$('#mainLoader').css('top', checkContentHeight($('#mainLoader')));
	$('#notSupportHolder').css('left', checkContentWidth($('#mainLoader')));
	$('#notSupportHolder').css('top', checkContentHeight($('#mainLoader')));
 }

/*!
 * 
 * BROWSER DETECT - This is the function that runs for browser and feature detection
 * 
 */
var browserSupport=false;
var isMobile,isTablet,isDesktop;
function checkBrowser(){
	if (typeof MobileDetect === 'function') {
		var md = new MobileDetect(window.navigator.userAgent);
		isMobile = md.mobile();
		isTablet = md.tablet();
		if(isMobile == null && isTablet == null){
			isDesktop = true;
		}
	}

	var canvasEl = document.createElement('canvas');
	if(canvasEl.getContext){ 
		browserSupport=true;
	}
	
	// Block desktop/laptop devices - only allow mobile phones, tablets, and iPads
	if(isDesktop){
		$('#notSupportHolder .notSupport').html('This game is only available on mobile devices.<br/><br/>Please access this game using your smartphone, tablet, or iPad.');
		$('#notSupportHolder').css({
			'display': 'block',
			'position': 'fixed',
			'top': '50%',
			'left': '50%',
			'transform': 'translate(-50%, -50%)',
			'z-index': '9999',
			'background': 'rgba(0, 0, 0, 0.9)',
			'padding': '40px',
			'border-radius': '10px'
		});
		return;
	}
	
	if(browserSupport && checkGameVersion()){
		if(!isLoaded){
			isLoaded=true;
			initPreload();
		}
	}else{
		//browser not support
		$('#notSupportHolder').show();
	}
}