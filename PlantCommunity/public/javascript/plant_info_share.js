const write_button = document.getElementById("write_button"); // 글쓰기 버튼 변수

/* 글쓰기 버튼 클릭했을 때 이벤트 */
write_button.addEventListener("click", function(){
  // 세션이 있다면 글쓰기 가능 
  // 세션 없으면 글쓰기 불가능
  // 세션은 서버한테 요청해서 유무 알아보기
  makeRequest('http://localhost:5000/plant_info_share/authentication');

});

var httpRequest;

/* 서버 요청 : 글쓰기를 하려고 할 때 로그인된 회원이 맞는지 확인*/
function makeRequest(url) {
  httpRequest = new XMLHttpRequest();

  if(!httpRequest) {
    alert('XMLHTTP 인스턴스 생성 오류');
    return false;
  }

  httpRequest.onreadystatechange = alertContents;
  httpRequest.open('GET', url, true); // GET형태
  httpRequest.send(null); 
}


/* 서버에서 요청에 성공했을 때 */
function alertContents() { //
  if (httpRequest.readyState === XMLHttpRequest.DONE) {
    if (httpRequest.status === 200) { //서버에서 요청에 성공했을 때

      var authentication = httpRequest.responseText; // 인증 여부
      
      if (authentication == 'true') { // 회원일 때
        // makeRequest('http://localhost:5000/contents/plant_info_share');
        location.href = "/contents/plant_info_share";
      } else { // 회원이 아닐 때
        alert("로그인이 되어있지 않습니다. 로그인 후 이용해주세요");
        location.href = "/login";
      }
      
    } else {
      alert('request에 뭔가 문제가 있어요.');
    }
  }
}

