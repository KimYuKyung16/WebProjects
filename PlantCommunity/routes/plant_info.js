const express = require('express');
const router = express.Router();
var fs = require('fs');
const ejs = require("ejs");

const mysql = require('mysql'); // mysql 모듈
const dbconfig = require('../config/plant_db.js'); // db 모듈 불러오기
const connection = mysql.createConnection(dbconfig); // db 연결

const session = require("express-session"); //세션
const MySQLStore = require('express-mysql-session')(session); //mysql 세션

const options = require('../config/session_db.js'); // session_db 모듈 불러오기
var sessionStore = new MySQLStore(options);

router.use(express.json()); 


var request = require('request');
const parser = require('xml2json');
// const cookieParser = require('cookie-parser');

var url = 'http://openapi.nature.go.kr/openapi/service/rest/PlantService/plntIlstrSearch';
var queryParams = '?' + encodeURIComponent('serviceKey') + '=UV5m4ySwHIUkRftLMpcP4ESCQpWdR1g2vSHzYb4pN6ACCSW16gsVTRYKRdSUEf%2BDUwxR0BzFh4I9jZu%2BWM9vjg%3D%3D'; /* Service Key*/
queryParams += '&' + encodeURIComponent('st') + '=' + encodeURIComponent('1'); /* */
queryParams += '&' + encodeURIComponent('sw') + '=' + encodeURIComponent('난'); /* */
queryParams += '&' + encodeURIComponent('dateGbn') + '=' + encodeURIComponent(''); /* */
queryParams += '&' + encodeURIComponent('dateFrom') + '=' + encodeURIComponent(''); /* */
queryParams += '&' + encodeURIComponent('dateTo') + '=' + encodeURIComponent(''); /* */
queryParams += '&' + encodeURIComponent('numOfRows') + '=' + encodeURIComponent('10'); /* */
queryParams += '&' + encodeURIComponent('pageNo') + '=' + encodeURIComponent('1'); /* */

var jsontest;
var body2;
var i=0;

request({
    url: url + queryParams,
    method: 'GET'
}, function (error, response, body) {
    // console.log('Status', response.statusCode);
    // console.log('Headers', JSON.stringify(response.headers));
    // console.log('Reponse received', body);
    body2 = body;
    // jsontest = parser.toJson(body2); // xml -> json
    // jsontest = JSON.parse(jsontest); // json -> js객체
    // jsontest = jsontest.response.body.items.item[i].plantGnrlNm;
});


router.get('/', function(req, res){ 
  jsontest = parser.toJson(body2); // xml -> json
  jsontest = JSON.parse(jsontest); // json -> js객체
  count = jsontest.response.body.totalCount;

  jsontest = jsontest.response.body.items.item[i];
  console.log(jsontest)
  i = i<count-1 ? i+1 : 0 //아래 주석처리된 거랑 같은 내용의 코드
  /* if (i<count-1) {
    i++;
  }
  else {
    i = 0;
  } */
  // console.log(i);
  res.json(jsontest); //()안에 있는 데이터들을 자동으로 json 형식으로 바꾸어 보낸다. : express에서 사용, 현재 ()안에 들어있는 값은 js객체
})


/* css적용을 위해 추가 : public 폴더에서 파일 찾기 */
router.use(express.static('public'));


module.exports = router // 모듈로 리턴