const express = require('express');
var fs = require('fs');
const app = express();
const cors = require('cors');
const ejs = require("ejs");



const cookieParser = require('cookie-parser');

app.use(cookieParser());

app.use(cors({
  origin: 'http://localhost:3001',
  credentials: true
})); // cors 에러 해결 위해 추가

const session = require("express-session"); //세션
const MySQLStore = require('express-mysql-session')(session); //mysql 세션

const options = require('./config/session_db.js'); // session_db 모듈 불러오기
var sessionStore = new MySQLStore(options);

const mysql = require('mysql'); // mysql 모듈
const session_connection = mysql.createConnection(options);

/* 세션 관련 미들웨어 */
app.use( 
  session({
    key: "user_cookie",
    secret: "session_cookie_secret", //쿠키를 임의로 변조하는 것을 방지하기 위한 값
    store: sessionStore,
    resave: false, //세션에 변경사항이 없어도 항상 저장할 지 설정하는 값
    saveUninitialized: false,
    // cookie: { maxAge: 24000 * 60 * 1},
  })
);


const http = require('http').createServer(app);
// const io = require('socket.io')(http)
const io = require('socket.io')(http, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// io.on('connection', socket => {
//   socket.on('message', ({name, message}) => {
//     io.emit('message', {name, message})
//   })
// })

//////////////////////

/* 채팅 기능 구현 */
app.get('/chat_namespace', function(req, res){
  if (req.headers.cookies) { // 쿠키가 있다면 : 로그인 상태라면
    console.log(req.headers.cookies)
    let content_num = req.query.content_num;
    let current_user_id = req.query.user_id;
    console.log(typeof(content_num))
    console.log(current_user_id)

    sql = "SELECT * FROM sessions WHERE session_id = ?";

    session_connection.query(sql, req.headers.cookies, function(error, rows) {
      if (error) throw error;
      let session_obj = JSON.parse(rows[0].data);
      let user_id = session_obj.user_id; // 현재 로그인되어있는 회원의 아이디 추출
      console.log(user_id);



      if (user_id) {
        const userNamespace = io.of("/" + content_num);
  
        userNamespace.on("connection", (socket) => { // 네임스페이스로 나누고
          socket.join(current_user_id) // 네임스페이스 안에서 룸으로 또 나눔.

          // const room = socket.to(user_id);

          socket.on(current_user_id, ({nickname, message}) => {
            socket.to(current_user_id).emit(user_id, {nickname, message})
          });

          // socket.on("message", ({nickname, message}) => {
          //   userNamespace.emit('message', {nickname, message})
          // });

          socket.on("disconnetion", () => {
            console.log("연결이 끊겼습니다.")
          })


        });

        res.send({namespace: user_id});
      }
    })
    
  } else { // 인증된 사용자가 아니라면(세션X)
    console.log('로그인이 되어있지 않습니다.')
    res.send('false');
  }
})





// const userNamespace = io.of("/users");

// userNamespace.on("connection", (socket) => {
//   socket.join("room1"); // room1
//   userNamespace.to("room1").emit("holà");
// });





















/* 라우터 설정 */
const login = require('./routes/login.js'); // 로그인 메뉴
const logout = require('./routes/logout.js'); // 로그아웃 메뉴
const signup = require('./routes/signup.js'); // 회원가입 메뉴
const user_info = require('./routes/user_info.js'); // 내 정보

const test = require('./routes/plant_info_share.js'); // 식물 정보 공유 메뉴
const board = require('./routes/board.js'); // 게시판 메뉴
const write = require('./routes/write.js'); // 글쓰기 페이지

const plant_info = require('./routes/plant_info.js'); // 식물 기본 정보
const plant_album = require('./routes/plant_album.js'); // 내 식물 앨범
const chat = require('./routes/chat.js'); // 글쓰기 페이지




/* ejs 사용을 위해 추가 */
app.set('view engine', 'ejs') 
app.set('views', './views');

// app.get('/', function(req, res){
//     fs.readFile('./views/index.ejs', "utf-8", function(error, data){
//       res.writeHead(200, {'Content-Type': 'text/html' });
//       // res.end(ejs.render(data));
//     })

//     // res.cookie('user_cookie', userid);  // 응답 객체에 쿠키를 생성한다.
// })

/* css적용을 위해 추가 : public, views 폴더에서 파일을 찾는다. */
app.use(express.static('public'));
app.use('/uploads',express.static(__dirname + '/uploads'));
app.use(express.static('views'));

// use() 메서드를 이용하여 미들 웨어를 추가했다.
app.use('/test', test);
// app.use('/login', login);
// app.use('/logout', logout);
// app.use('/signup', signup);
// app.use('/user_info', user_info);
// app.use('/contents', write);
app.use('/board', board);
app.use('/login', login);
app.use('/logout', logout);
app.use('/signup', signup);
app.use('/user_info', user_info);
app.use('/write', write);
app.use('/plant_info', plant_info);
app.use('/plant_album', plant_album);

app.use('/chat', chat);


// var request = require('request');
// const parser = require('xml2json');
// const router = require('./routes/signup.js');
// // const cookieParser = require('cookie-parser');

// var url = 'http://openapi.nature.go.kr/openapi/service/rest/PlantService/plntIlstrSearch';
// var queryParams = '?' + encodeURIComponent('serviceKey') + '=UV5m4ySwHIUkRftLMpcP4ESCQpWdR1g2vSHzYb4pN6ACCSW16gsVTRYKRdSUEf%2BDUwxR0BzFh4I9jZu%2BWM9vjg%3D%3D'; /* Service Key*/
// queryParams += '&' + encodeURIComponent('st') + '=' + encodeURIComponent('1'); /* */
// queryParams += '&' + encodeURIComponent('sw') + '=' + encodeURIComponent('장미'); /* */
// queryParams += '&' + encodeURIComponent('dateGbn') + '=' + encodeURIComponent(''); /* */
// queryParams += '&' + encodeURIComponent('dateFrom') + '=' + encodeURIComponent(''); /* */
// queryParams += '&' + encodeURIComponent('dateTo') + '=' + encodeURIComponent(''); /* */
// queryParams += '&' + encodeURIComponent('numOfRows') + '=' + encodeURIComponent('10'); /* */
// queryParams += '&' + encodeURIComponent('pageNo') + '=' + encodeURIComponent('1'); /* */

// var jsontest;
// var body2;
// var i=0;

// request({
//     url: url + queryParams,
//     method: 'GET'
// }, function (error, response, body) {
//     // console.log('Status', response.statusCode);
//     // console.log('Headers', JSON.stringify(response.headers));
//     // console.log('Reponse received', body);
//     body2 = body;
//     // jsontest = parser.toJson(body2); // xml -> json
//     // jsontest = JSON.parse(jsontest); // json -> js객체
//     // jsontest = jsontest.response.body.items.item[i].plantGnrlNm;
// });


// app.post('/', function(req,res){
//   jsontest = parser.toJson(body2); // xml -> json
//   jsontest = JSON.parse(jsontest); // json -> js객체
//   count = jsontest.response.body.totalCount;

//   jsontest = jsontest.response.body.items.item[i].plantGnrlNm;
//   i = i<count-1 ? i+1 : 0 //아래 주석처리된 거랑 같은 내용의 코드
//   /* if (i<count-1) {
//     i++;
//   }
//   else {
//     i = 0;
//   } */
//   // console.log(i);
//   res.json(jsontest); //()안에 있는 데이터들을 자동으로 json 형식으로 바꾸어 보낸다. : express에서 사용, 현재 ()안에 들어있는 값은 js객체
// })






// app.listen(5000, function(){ //서버 실행
//   console.log('5000번 포트 대기')
//   // connectDB();
// });

http.listen(5000, function(){ //서버 실행
  console.log('5000번 포트 대기')
  // connectDB();
});






//===== 데이터베이스 연결 =====//

// var MongoClient = require('mongodb').MongoClient;

// //데이터베이스 객체를 위한 변수 선언
// var database;

// //데이터베이스에 연결
// function connectDB() {
	
// 	var databaseUrl = 'mongodb://localhost:27017/plantdb';
	
// 	MongoClient.connect(databaseUrl, function(err, db) {
// 		if (err) throw err;
		
// 		console.log('데이터베이스에 연결되었습니다. : ' + databaseUrl);
		
// 		// database 변수에 할당
// 		database = db;
		
// 		//database.collection is not a function 오류나서 추가해봄
// 		database = db.db('DB');
//     database.createCollection("plant", function(err, res) {
//       if (err) throw err;
//       console.log("Collection created!");
//       db.close();
//     });

// 	});
// }


