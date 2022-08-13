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

/* 토글 버튼 클릭 시 이벤트 */
toggleBtn.addEventListener('click', () => {
  menu.classList.toggle('active'); // 메뉴 활성화
  icons.classList.toggle('active'); // 아이콘활성화
});







