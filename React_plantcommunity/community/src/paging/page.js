let total_contents = 25; // 총 게시글의 개수
let one_page_contents = 10; // 한 페이지 당 게시글의 개수

let total_pages = parseInt(total_contents / one_page_contents); // 총 페이지 개수
let remain_contents = total_contents % one_page_contents; // 나머지 게시글 개수 

remain_contents ? total_pages += 1 : total_pages; // 나머지 게시글이 있으면 페이지 개수 추가

let current_page = 1; // 현재 페이지


let start_value; // 페이지의 첫번째 값
let last_page; // 마지막 페이지

start_value = (current_page-1) * one_page_contents; // 시작값
let output_num;
 

if (current_page == total_pages) { // 현재 페이지가 마지막 페이지라면
  remain_contents? last_page = start_page + remain_contents : last_page = (current_page) * one_page_contents - 1;
  output_num = remain_contents; 
} else { // 현재 페이지가 마지막 페이지가 아니라면 
  last_page = (current_page) * one_page_contents - 1;
  output_num = one_page_contents;
}


// 몇부터 몇개를 출력 (x, y) : x는 시작, y는 출력 개수
sql = "SELECT * FROM contents WHERE board = 'plant_info_share' ORDER BY num DESC limit (start_value, output_num)";
 