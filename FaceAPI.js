

var fs = require('fs');

exports.recognition = function (contentURL){

	// Get line contents
	var imageBin = getLineImage(contentURL);

//	fs.writeFileSync(process.cwd() + "/public/images/tmp.jpg",imageBin,'base64');

	// exec visual recog api
	var urlStr = 'https://gateway-a.watsonplatform.net/visual-recognition/api/v3/detect_faces?api_key=4bda595c673ffa3178e7031eb2b67a3b6d7cbb69&version=2016-05-20';

	var params = {
		haders : {
	        'Content-Type': 'multipart/form-data',
			'Accept-Encoding': 'multipart/form-data'
		},
		body : {
			images_file : new Buffer(imageBin, 'binary')
		},
		json : true
	};
	
	var request = require('sync-request');
	var response = request('POST', urlStr,params);
	console.log("vrResultCode:" + response.statusCode);
	var respJSON = JSON.parse(response.getBody('utf8'));
	var face = respJSON.images[0].faces[0];
	var bindings = face.age.min + "〜" + face.age.max + " : " + face.gender.gender;
	
	return bindings;
};

function getLineImage(contentURL){
	
//	var reqOption = {
//		headers : {
//		'Authorization': {
//			'Bearer' :'AdoAFugvaB8t14QfIKkl53N5LTnZlQwa8swiqq3k5dm2HupyX6e4Mg5pRLfNLZMIWz3Dz3NduhoUUhMtcj25WtuvoIdGVHpii+o5fLMBlmwmyfZhQaeWCxBAln8veuDgi47w7B6ry/pavxmYV5JZLAdB04t89/1O/w1cDnyilFU='
//      	}
//      	},
//      	json: true
//    };
	var reqOption = {
		headers : {
		'Authorization': 
			'Bearer AdoAFugvaB8t14QfIKkl53N5LTnZlQwa8swiqq3k5dm2HupyX6e4Mg5pRLfNLZMIWz3Dz3NduhoUUhMtcj25WtuvoIdGVHpii+o5fLMBlmwmyfZhQaeWCxBAln8veuDgi47w7B6ry/pavxmYV5JZLAdB04t89/1O/w1cDnyilFU='
      	
      	},
      	json: true
    };
    
    var request = require('sync-request');
	var response = request('GET', contentURL,reqOption);
	console.log("response-code:" + response.statusCode );
	return response.getBody();
	
}