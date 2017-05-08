
var request = require('sync-request');

exports.recognition = function (contentURL){

	// Get line contents
	var imageBin = getLineImage(contentURL);

	// exec visual recog api
	
	
	return imageBin;
};

function getLineImage(contentURL){
	
	var response = request('GET', contentURL);
	
	return response;
	
}