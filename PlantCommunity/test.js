const express = require('express');
var fs = require('fs');
const app = express();
const cors = require('cors');


// app.use(cors());
app.use(cors({
  origin: 'http://localhost:5000',
 // credential: ?
}));

app.all('/*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});

const login = require('./routes/login.js');
// const signup = require('./routes/signup');


var request = require('request');

var url = 'http://openapi.nature.go.kr/openapi/service/rest/PlantService/plntIlstrSearch';
var queryParams = '?' + encodeURIComponent('serviceKey') + '=UV5m4ySwHIUkRftLMpcP4ESCQpWdR1g2vSHzYb4pN6ACCSW16gsVTRYKRdSUEf%2BDUwxR0BzFh4I9jZu%2BWM9vjg%3D%3D'; /* Service Key*/
queryParams += '&' + encodeURIComponent('st') + '=' + encodeURIComponent('1'); /* */
queryParams += '&' + encodeURIComponent('sw') + '=' + encodeURIComponent('장미'); /* */
queryParams += '&' + encodeURIComponent('dateGbn') + '=' + encodeURIComponent(''); /* */
queryParams += '&' + encodeURIComponent('dateFrom') + '=' + encodeURIComponent(''); /* */
queryParams += '&' + encodeURIComponent('dateTo') + '=' + encodeURIComponent(''); /* */
queryParams += '&' + encodeURIComponent('numOfRows') + '=' + encodeURIComponent('10'); /* */
queryParams += '&' + encodeURIComponent('pageNo') + '=' + encodeURIComponent('1'); /* */

request({
    url: url + queryParams,
    method: 'GET'
}, function (error, response, body) {
    console.log('Status', response.statusCode);
    console.log('Headers', JSON.stringify(response.headers));
    console.log('Reponse received', body);
});



// use() 메서드를 이용하여 미들 웨어를 추가했다.
app.use('/login', login);
// app.use('/signup', signup);



//===== 데이터베이스 연결 =====//

var MongoClient = require('mongodb').MongoClient;

//데이터베이스 객체를 위한 변수 선언
var database;

//데이터베이스에 연결
function connectDB() {
	
	var databaseUrl = 'mongodb://localhost:27017/plantdb';
	
	MongoClient.connect(databaseUrl, function(err, db) {
		if (err) throw err;
		
		console.log('데이터베이스에 연결되었습니다. : ' + databaseUrl);
		
		// database 변수에 할당
		database = db;
		
		//database.collection is not a function 오류나서 추가해봄
		database = db.db('DB');
    database.createCollection("plant", function(err, res) {
      if (err) throw err;
      console.log("Collection created!");
      db.close();
    });

	});
}


app.listen(5000, function(){
  console.log('5000번 포트 대기')
  connectDB();
});