// const main_title = document.getElementById("main_title");
// const product_image = document.getElementById("product_image");
// const login_title = document.getElementsByClassName("login_title");
// const login_btn = document.getElementById("login_btn");
// const my_info = document.getElementById("my_info");
// const side_menu1 = document.getElementById("side_menu1")
// const side_menu2 = document.getElementById("side_menu2")
// const my_nickname = document.getElementsByClassName("my_nickname")
// const logout_btn = document.getElementById("logout_btn")
// const page_num_form = document.getElementById("page_num_form")


const toggleBtn = document.querySelector(".navbar_togglebBtn") // 토글 버튼 변수
const menu = document.querySelector(".navbar_menu") // 네비게이션바 메뉴 변수
const icons = document.querySelector(".navbar_icons") // 네비게이션바 아이콘 변수
const my_info = document.getElementById("my_info"); // 내 정보창 변수 
const login_btn = document.getElementById("login_btn"); // 로그인 변수 
const signup_btn = document.getElementById("signup_btn"); // 회원가입 버튼 변수

const id = document.getElementById("u_id"); // 입력받은 아이디 변수
const pw = document.getElementById("u_pw"); // 입력받은 패스워드 변수

/* 토글 버튼 클릭 시 이벤트 */
toggleBtn.addEventListener('click', () => {
  menu.classList.toggle('active'); // 메뉴 활성화
  icons.classList.toggle('active'); // 아이콘활성화
});

/* 내 정보 클릭 시 이벤트 */
my_info.addEventListener("click", function() { // 내 정보를 누르면 '/login'으로 이동 : 로그인 유무는 /login에서 처리
  location.href = '/login'
});

/* 회원가입 버튼 클릭 시 이벤트 */
signup_btn.addEventListener("click", function() { // 회원가입 버튼을 누르면 '/signup'으로 이동
  location.href = '/signup'
});

/* 로그인 버튼 클릭 시 이벤트 */
login_btn.addEventListener("click", function() { 
  if (id.value != "" && pw.value != "") { // 아이디와 비밀번호를 입력했을 때
    makeRequest('http://localhost:5000/login/process', id.value, pw.value);
  } else { // 하나라도 입력되지 않은 것이 있을 때
    alert("입력되지 않은 부분이 있습니다. 다시 입력해주세요.");
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
  httpRequest.send(data); // json형태로 데이터 보내기
  }

  /* 서버에서 요청에 성공했을 때 */
  function alertContents() { //
    if (httpRequest.readyState === XMLHttpRequest.DONE) {
      if (httpRequest.status === 200) { //서버에서 요청에 성공했을 때
        alert("로그인이 완료되었습니다.");
        location.href = "/"; // 로그인 완료 후 새로고침
      } else {
        alert('request에 뭔가 문제가 있어요.');
      }
    }
  }










