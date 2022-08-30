let total_contents = 25; // 총 게시글의 개수
let one_page_contents = 10; // 한 페이지 당 게시글의 개수

let total_pages = parseInt(total_contents / one_page_contents); // 총 페이지 개수
let remain_contents = total_contents % one_page_contents; // 나머지 게시글 개수 

remain_contents ? total_pages += 1 : total_pages; // 나머지 게시글이 있으면 페이지 개수 추가

let current_page = 1; // 현재 페이지

// 만약에 1페이지면
let last_value = current_page * one_page_contents // last_value까지 출력하면 총 10개의 게시글 출력

let start_page; // 시작 페이지
let last_page; // 마지막 페이지

start_page = (current_page-1) * one_page_contents; 

if (current_page == total_pages) { // 현재 페이지가 마지막 페이지라면
  remain_contents? last_page = start_page + remain_contents : last_page = (current_page) * one_page_contents - 1; 
} else { // 현재 페이지가 마지막 페이지가 아니라면 
  last_page = (current_page) * one_page_contents - 1;
}


// 몇부터 몇까지 출력 (x, y)
sql = "SELECT * FROM contents WHERE board = 'plant_info_share' ORDER BY num DESC limit 10";
 