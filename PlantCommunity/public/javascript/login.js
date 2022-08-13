import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-analytics.js";
import { getAuth, onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCHINcntS5pZQkjgXY33uoWrwwbeIR7SV0",
  authDomain: "ireum-project.firebaseapp.com",
  projectId: "ireum-project",
  storageBucket: "ireum-project.appspot.com",
  messagingSenderId: "912854040938",
  appId: "1:912854040938:web:80ea54dc415e94c59b6513",
  measurementId: "G-8H16XTD8L9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const provider = new GoogleAuthProvider();
const auth = getAuth();

const login_btn = document.getElementById("login_confirm_btn");
const google_login_btn = document.getElementById("google_login_confirm_btn");

const id = document.getElementById("id"); // 아이디
const pw = document.getElementById("pw"); // 패스워드

google_login_btn.onclick = authpopup // 구글 로그인할 때


function authpopup(){
  signInWithPopup(auth, provider)
    .then((result) => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      // The signed-in user info.
      const user = result.user;
      // ...
      console.log(user.email);
      // email.value = user.email;
      // user_add_form.submit();

    }).catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.email;
      // The AuthCredential type that was used.
      const credential = GoogleAuthProvider.credentialFromError(error);
      // ...
      console.log("로그인 실패");
    });
}


login_btn.addEventListener("click", function(){ // 일반 로그인할 때
  if (id.value != "" && pw.value != "") { // 아이디와 비밀번호를 입력했을 때
    makeRequest('http://localhost:5000/login/process', id.value, pw.value);
  } else { // 하나라도 입력되지 않은 것이 있을 때
    alert("입력되지 않은 부분이 있습니다. 다시 입력해주세요.");
  }
})

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
        var result = httpRequest.responseText;
        // var txt = JSON.parse(httpRequest.responseText)
        // $("#content_list").html(result);
        // console.log(result);
        alert("로그인이 완료되었습니다.");
        location.href = "/";
      } else {
        alert('request에 뭔가 문제가 있어요.');
      }
    }
  }