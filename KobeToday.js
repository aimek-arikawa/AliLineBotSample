
function getEvent(http){

	var startDate = new Date();
	var toDate = new Date(new Date().setMonth(startDate.getMonth() + 1));

	var datestStr = startDate.toISOString().replace(/[.][0-9][0-9][0-9][Z]/g,"");
	var dateToStr = toDate.toISOString().replace(/[.][0-9][0-9][0-9][Z]/g,"");

	var querystr = 'PREFIX ic: <http://imi.go.jp/ns/core/rdf#>';
	querystr = querystr + ' PREFIX schema: <http://schema.org/>' ;
	querystr = querystr + ' select distinct ?name ?datef ?datet ?timef ?timet ?place ?url where {';
	querystr = querystr + ' ?s ic:名称/ic:表記 ?name .';
	querystr = querystr + ' ?s ic:期間 [ ic:開始日 ?datef; ic:終了日 ?datet; ic:開始時間 ?timef; ic:終了時間 ?timet ] .';
	querystr = querystr + ' ?s ic:開催場所/ic:名称/ic:表記 ?place .';
	querystr = querystr + ' ?s schema:url ?url .';
	querystr = querystr + ' ?s schema:inLanguage ?lang .';
	querystr = querystr + ' ?s schema:image ?image .';
	querystr = querystr + ' FILTER (xsd:dateTime("' + datestStr + '") <= xsd:dateTime(?datet) && xsd:dateTime(?datet) < xsd:dateTime("' + dateToStr + '")&& ?lang="日本語" )';
	querystr = querystr + ' }';
	querystr = querystr + ' ORDER BY ?datet';
	querystr = querystr + ' LIMIT 5';

	var url = 'https://data.city.kobe.lg.jp/sparql?query=' + encodeURIComponent(querystr);
	
	var ret;
	
	http.get(url, (res) => {
 		let body = '';
		res.setEncoding('utf8');

		res.on('data', (chunk) => {
			body += chunk;
			});

		res.on('end', (res) => {
			ret = JSON.parse(body);
		});
	}).on('error', (e) => {
  		console.log(e.message); //エラー時
	});
	
	return ret;
};