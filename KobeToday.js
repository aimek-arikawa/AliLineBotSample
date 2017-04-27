
exports.getEvent = function (){

	var moment = require("moment-timezone");

	var fromDate = moment().tz("Asia/Tokyo").format("YYYY-MM-DDTHH:MM:ss");
	var toDate = moment().tz("Asia/Tokyo").add(1,'days').format("YYYY-MM-DDTHH:MM:ss");

	var querystr = 'PREFIX ic: <http://imi.go.jp/ns/core/rdf#>';
	querystr = querystr + ' PREFIX schema: <http://schema.org/>' ;
	querystr = querystr + ' select distinct ?name ?datef ?datet ?timef ?timet ?place ?url where {';
	querystr = querystr + ' ?s ic:名称/ic:表記 ?name .';
	querystr = querystr + ' ?s ic:期間 [ ic:開始日 ?datef; ic:終了日 ?datet; ic:開始時間 ?timef; ic:終了時間 ?timet ] .';
	querystr = querystr + ' ?s ic:開催場所/ic:名称/ic:表記 ?place .';
	querystr = querystr + ' ?s schema:url ?url .';
	querystr = querystr + ' ?s schema:inLanguage ?lang .';
	querystr = querystr + ' ?s schema:image ?image .';
	querystr = querystr + ' FILTER (xsd:dateTime("' + fromDate + '") >= xsd:dateTime(?datef) && xsd:dateTime(?datet) > xsd:dateTime("' + fromDate + '")&& ?lang="日本語" )';
	querystr = querystr + ' }';
	querystr = querystr + ' ORDER BY ?datet';
	querystr = querystr + ' LIMIT 100';

	var urlStr = 'https://data.city.kobe.lg.jp/sparql?query=' + encodeURIComponent(querystr);
	
	var options = {
		'headers':{
			'accept': 'application/sparql-results+json'
		}
	};
	
	var request = require('sync-request');
	var response = request('GET', urlStr,options);
	
	
	var eventJSON = JSON.parse(response.getBody('utf8'));
	
	var bindings = eventJSON["results"]["bindings"];
  	var len = bindings.length;
	var returnMsg = '現在開催中のイベントはありません。';
	
	if(0 === len) return returnMsg;
	var targetIdx = Math.floor( Math.random() * len ) ;

	returnMsg = bindings[targetIdx].name.value + "\n\n"
				+ "[開催期間]\n" + getRangeString(bindings[targetIdx].datef.value,bindings[targetIdx].datet.value,bindings[targetIdx].timef.value,bindings[targetIdx].timet.value)+ "\n\n"
				+ "[URL]\n" + bindings[targetIdx].url.value;

	return returnMsg;
};

function getRangeString(datef,datet,timef,timet){
  var ret = datef;
  if(datef !== datet){
    ret = ret + '～' + datet;
  }

  ret = ret + '\n' + timef.substring(0,5) + '～' + timet.substring(0,5);

  return ret;
}
