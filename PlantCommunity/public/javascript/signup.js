const signupForm = document.querySelector("#signup_form");
const signup_btn = document.querySelector("#signup_confirm_btn");
const id = document.querySelector("#id");
const pw = document.querySelector("#pw");
const pw_check = document.querySelector("#pw_check");

/* 회원가입 버튼을 클릭했을 때 */
signup_btn.addEventListener("click", function(e) {
  if(pw.value && pw.value === pw_check.value){ // pw값과 pw체크값이 같다면
    if (id.value == ''){ // id 값이 비어있다면 
      alert("아이디를 입력하세요");
    } else { // id값이 비어있지 않다면
      makeRequest('http://localhost:5000/signup/process', id.value, pw.value); 
    }    
  }else{ // pw값과 pw체크값이 불일치할 때
    alert("비밀번호가 서로 일치하지 않습니다");
  }
});

var httpRequest;

/* 서버로 요청할 때 */
function makeRequest(url, id, pw) {
  httpRequest = new XMLHttpRequest();

  if(!httpRequest) {
    alert('XMLHTTP 인스턴스 생성 오류');
    return false;
  }

  var data = {'id': id, 'pw': pw};
  data = JSON.stringify(data);

  // XMLHttpRequest 객체의 readyState 프로퍼티 값이 변할 때마다 자동으로 호출되는 함수를 설정
  httpRequest.onreadystatechange = alertContents;
  httpRequest.open('POST', url, true);
  httpRequest.setRequestHeader('Content-Type', 'application/json');
  // request에 실어 보내는 데이터(body)의 type 정보를 표현
  // application/json : {key: value}의 형태로 전송
  // application/x-www-form-urlencoded : key=value&key=value 형태로 전송
  httpRequest.send(data); // json형태로 데이터 보내기
  }

  /* 서버에서 요청에 성공했을 때 */
  function alertContents() { //
    if (httpRequest.readyState === XMLHttpRequest.DONE) {
      if (httpRequest.status === 200) { //서버에서 요청에 성공했을 때
        var result = httpRequest.responseText;
        // var txt = JSON.parse(httpRequest.responseText)
        // $("#content_list").html(result);
        // console.log(result);
        alert("회원가입이 완료되었습니다");
        location.href = "/login";
      } else {
        alert('request에 문제가 있습니다.');
      }
    }
  }

