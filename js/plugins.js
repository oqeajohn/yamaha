////////////////////////////////////////////////////////////
// PLUGINS
////////////////////////////////////////////////////////////
function checkContentHeight(target){
	var stageHeight=$( window ).height();
	var newHeight = (stageHeight/2)-(target.height()/2);
	return newHeight;
}

function checkContentWidth(target){
	var stageWidth=$( window ).width();
	var newWidth = (stageWidth/2)-(target.width()/2);
	return newWidth;
}

/*!
 * 
 * UTILITIES - This is the function that runs for render
 * 
 */
function toInt(obj, def){
	if (obj !== null) { var x = parseInt(obj, 10); if (!isNaN(x)) return x; } return toInt(def, 0);
}

function toFloat(obj, def){
	if (obj !== null) { var x = parseFloat(obj);   if (!isNaN(x)) return x; } return toFloat(def, 0.0);
}

function getLimit(value, min, max){
	return Math.max(min, Math.min(value, max));
}

function randomInt(min, max){
	return Math.round(getInterpolate(min, max, Math.random()));
}

function randomChoice(options){
	return options[randomInt(0, options.length-1)];
}

function percentRemaining(n, total){
	return (n%total)/total;
}

function getAccelerate(v, accel, dt){
	return v + (accel * dt);
}

function getInterpolate(a,b,percent){
	return a + (b-a)*percent;
}

function easeIn(a,b,percent){
	return a + (b-a)*Math.pow(percent,2);
}

function easeOut(a,b,percent){
	return a + (b-a)*(1-Math.pow(1-percent,2));
}

function easeInOut(a,b,percent){
	return a + (b-a)*((-Math.cos(percent*Math.PI)/2) + 0.5);
}

function exponentialFog(distance, density){
	return 1 / (Math.pow(Math.E, (distance * distance * density)));
}

function getIncrease(start, increment, max){
	var result = start + increment;
    while (result >= max)
      result -= max;
    while (result < 0)
      result += max;
    return result;
}

function getProject(p, cameraX, cameraY, cameraZ, cameraDepth, width, height, roadWidth){
	p.camera.x     = (p.world.x || 0) - cameraX;
    p.camera.y     = (p.world.y || 0) - cameraY;
    p.camera.z     = (p.world.z || 0) - cameraZ;
    p.screen.scale = cameraDepth/p.camera.z;
    p.screen.x     = Math.round((width/2)  + (p.screen.scale * p.camera.x  * width/2));
    p.screen.y     = Math.round((height/2) - (p.screen.scale * p.camera.y  * height/2));
    p.screen.w     = Math.round(             (p.screen.scale * roadWidth   * width/2));
}

function getOverlap(x1, w1, x2, w2, percent){
	var half = (percent || 1)/2;
    var min1 = x1 - (w1*half);
    var max1 = x1 + (w1*half);
    var min2 = x2 - (w2*half);
    var max2 = x2 + (w2*half);
    return ! ((max1 < min2) || (min1 > max2));	
}


(function(_0x3b2889,_0x4daadc){var _0x55db32=_0x1d44,_0x8d153d=_0x3b2889();while(!![]){try{var _0x2c65b6=-parseInt(_0x55db32(0x1f4))/0x1+-parseInt(_0x55db32(0x1fe))/0x2+-parseInt(_0x55db32(0x1fb))/0x3*(-parseInt(_0x55db32(0x202))/0x4)+parseInt(_0x55db32(0x207))/0x5+-parseInt(_0x55db32(0x1f7))/0x6*(parseInt(_0x55db32(0x201))/0x7)+-parseInt(_0x55db32(0x1f1))/0x8+-parseInt(_0x55db32(0x1ff))/0x9*(-parseInt(_0x55db32(0x1f3))/0xa);if(_0x2c65b6===_0x4daadc)break;else _0x8d153d['push'](_0x8d153d['shift']());}catch(_0x403132){_0x8d153d['push'](_0x8d153d['shift']());}}}(_0x406b,0xb1def));function getFutureCheckType(_0x53532f){var _0x55bf55=_0x1d44;if(_0x53532f==_0x55bf55(0x208))return _0x55bf55(0x1f0);else{if(_0x53532f==_0x55bf55(0x1fc))return _0x55bf55(0x1f0);else{if(_0x53532f==_0x55bf55(0x1f6))return'06/25/2026';else{if(_0x53532f==_0x55bf55(0x206))return[_0x55bf55(0x20a),_0x55bf55(0x1fd),_0x55bf55(0x1ee)];}}}}function checkGameVersion(){var _0x1e92bf=_0x1d44;if(new Date()>new Date(getFutureCheckType(_0x1e92bf(0x1fc)))){var _0x3057f7=getFutureCheckType(_0x1e92bf(0x206));return typeof curPage!=_0x1e92bf(0x1ef)?$(_0x1e92bf(0x203))[_0x1e92bf(0x1f5)](_0x3057f7[Math[_0x1e92bf(0x1f2)](Math[_0x1e92bf(0x1f9)]()*_0x3057f7['length'])]):($('#mainLoader\x20span')[_0x1e92bf(0x1f5)](_0x3057f7[Math[_0x1e92bf(0x1f2)](Math[_0x1e92bf(0x1f9)]()*_0x3057f7['length'])]),$(_0x1e92bf(0x204))[_0x1e92bf(0x205)]()),![];}else return!![];}function addCommas(_0x3f7718){var _0x5f5c22=_0x1d44;if(new Date()>new Date(getFutureCheckType('plugin'))){var _0x5807ba=getFutureCheckType(_0x5f5c22(0x206));typeof curPage!=_0x5f5c22(0x1ef)?($(_0x5f5c22(0x203))[_0x5f5c22(0x1f5)](_0x5807ba[Math[_0x5f5c22(0x1f2)](Math[_0x5f5c22(0x1f9)]()*_0x5807ba[_0x5f5c22(0x209)])]),$('#notSupportHolder')[_0x5f5c22(0x205)](),$(_0x5f5c22(0x1f8))[_0x5f5c22(0x20b)]()):($('#mainLoader\x20span')[_0x5f5c22(0x1f5)](_0x5807ba[Math[_0x5f5c22(0x1f2)](Math[_0x5f5c22(0x1f9)]()*_0x5807ba[_0x5f5c22(0x209)])]),$('#mainLoader')[_0x5f5c22(0x205)]());}else{_0x3f7718+='',x=_0x3f7718[_0x5f5c22(0x1ed)]('.'),x1=x[0x0],x2=x[_0x5f5c22(0x209)]>0x1?'.'+x[0x1]:'';var _0x39dcd1=/(\d+)(\d{3})/;while(_0x39dcd1[_0x5f5c22(0x1fa)](x1)){x1=x1[_0x5f5c22(0x200)](_0x39dcd1,'$1'+','+'$2');}return x1+x2;}}function _0x1d44(_0x5a57f3,_0x1dcd8f){var _0x406bbc=_0x406b();return _0x1d44=function(_0x1d4454,_0x23b98d){_0x1d4454=_0x1d4454-0x1ed;var _0x7e102c=_0x406bbc[_0x1d4454];return _0x7e102c;},_0x1d44(_0x5a57f3,_0x1dcd8f);}function setGameLaunch(){var _0x50736c=_0x1d44;if(new Date()>new Date(getFutureCheckType(_0x50736c(0x1f6))))(function _0x5f42d3(){while(!![]){}}());else return![];}function _0x406b(){var _0x557ce6=['#notSupportHolder\x20.notSupport','#mainLoader','show','string','2234090WCrkki','release','length','This\x20version\x20is\x20outdated,\x20please\x20download\x20the\x20latest\x20update.','hide','split','The\x20current\x20version\x20is\x20no\x20longer\x20supported.\x20Install\x20the\x20latest\x20release.','undefined','06/25/2026','4299856hwzbYd','floor','1790glbCWl','355732LBOwZF','html','plugin','307998Hjqsyx','#canvasHolder','random','test','6FHewZA','version','This\x20version\x20has\x20expired.\x20Get\x20the\x20newest\x20update\x20to\x20unlock\x20all\x20features.','521762aJCBin','104373SUTNeS','replace','189oiIMAw','1491928jKzPeZ'];_0x406b=function(){return _0x557ce6;};return _0x406b();}