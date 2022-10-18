import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from "react-router-dom";

import axios from "axios";

function Like_contents() {
  const navigate = useNavigate(); // 페이지 이동을 위해 필요

  const [contents, setContents] = useState([]);

  let [total_contents, setTotalcontents] = useState(); // 게시글의 총 개수
  let one_page_contents = 10; // 한 페이지 당 게시글의 개수

  let [total_pages, setTotalpages] = useState(1); // 총 페이지 개수
  let [remain_contents, setRemaincontents] = useState(); // 나머지 게시글 개수


  function each_page_contents(current_page) {
    axios.get('http://localhost:5000/user_info/like_contents', { // 서버로 post 요청
      params: {
        current_page: current_page, 
        one_page_contents: one_page_contents
      }  
    })
    .then(function (response) { // 서버에서 응답이 왔을 때
      console.log(response.data);
      // const data = [...response.data];
      // setContents(data);
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  // 클로저를 이용해서 가장 마지막 값만 출력되는 오류를 해결
  function page_button_create() { // 페이지 버튼 생성
    let button_array = [];
    for (let i=1; i<total_pages+1; i++) {
      button_array.push(<input class="page_btn" key={i} type="button" value={i} onClick={ () => {each_page_contents(i)} } />)
    }
    return button_array;
  }

  return(
    <>
      <p>좋아요한 글</p>
    </>
  );
}

export default Like_contents;


