/*eslint-env node*/

//------------------------------------------------------------------------------
// node.js starter application for Bluemix
//------------------------------------------------------------------------------

// This application uses express as its web server
// for more info, see: http://expressjs.com
var express = require('express');

// cfenv provides access to your Cloud Foundry environment
// for more info, see: https://www.npmjs.com/package/cfenv
var cfenv = require('cfenv');

// create a new express server
var app = express();

// ----------ここから----------
var KOBEToday = require('./KobeToday.js');
var faceAPI = require('./FaceAPI.js');

var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

var request = require('request');

app.post('/api', function(req, res) {
  // イベント取得
//  var eventJson = KOBEToday.getEvent(https);

  var replyText = "現在神戸市内で開催中のイベント情報を知りたい場合は「イベント」と話しかけてください。";
//  var contentURL = "";
  if("イベント" === req.body.events[0].message.text){
  	replyText = KOBEToday.getEvent();
  }
  else if("image" === req.body.events[0].message.type){
  	var contentURL = "https://api.line.me/v2/bot/message/" + req.body.events[0].message.id + "/content?messageId="+ req.body.events[0].message.id;
  	replyText = faceAPI.recognition(contentURL);
  }

  var options = {
    method: 'POST',
    uri: 'https://api.line.me/v2/bot/message/reply',
    body: {
      replyToken: req.body.events[0].replyToken,
      messages: [{
        type: "text",
        text: replyText
      }]
    },
    auth: {
      bearer: 'AdoAFugvaB8t14QfIKkl53N5LTnZlQwa8swiqq3k5dm2HupyX6e4Mg5pRLfNLZMIWz3Dz3NduhoUUhMtcj25WtuvoIdGVHpii+o5fLMBlmwmyfZhQaeWCxBAln8veuDgi47w7B6ry/pavxmYV5JZLAdB04t89/1O/w1cDnyilFU='
    },
    json: true
  };
  request(options, function(err, res, body) {
    console.log(JSON.stringify(res));
  });
  res.send('OK');
});
// --------ここまで追加--------


// serve the files out of ./public as our main files
app.use(express.static(__dirname + '/public'));

// get the app environment from Cloud Foundry
var appEnv = cfenv.getAppEnv();

// start server on the specified port and binding host
app.listen(appEnv.port, '0.0.0.0', function() {
  // print a message when the server starts listening
  console.log("server starting on " + appEnv.url);
});
