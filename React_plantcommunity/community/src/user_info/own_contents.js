import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from "react-router-dom";

import axios from "axios";

function Own_contents() {
  const navigate = useNavigate(); // 페이지 이동을 위해 필요

  const [contents, setContents] = useState([]);

  let [total_contents, setTotalcontents] = useState(); // 게시글의 총 개수
  let one_page_contents = 10; // 한 페이지 당 게시글의 개수

  let [total_pages, setTotalpages] = useState(1); // 총 페이지 개수
  let [remain_contents, setRemaincontents] = useState(); // 나머지 게시글 개수


  function each_page_contents(current_page) {
    axios.get('http://localhost:5000/user_info/contents', { // 서버로 post 요청
      params: {
        current_page: current_page, 
        one_page_contents: one_page_contents
      }  
    })
    .then(function (response) { // 서버에서 응답이 왔을 때
      const data = [...response.data];
      setContents(data);
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

  /* 내가 쓴 글 */
  function total_contents_request() { // 게시글의 총 개수
    axios.get('http://localhost:5000/user_info/total_contents') // 서버로 get 요청
      .then(function (response) { // 서버에서 응답이 왔을 때
        setTotalcontents(response.data[0].count);
   
        setTotalpages(parseInt(total_contents / one_page_contents));// 총 페이지 개수 설정
        setRemaincontents(total_contents % one_page_contents); // 나머지 게시글 개수 설정
       
        if (remain_contents) { // 현재 페이지가 1페이지가 아니고 나머지 페이지가 있다면
          setTotalpages(total_pages => total_pages+1) // 총 페이지에 +1
        } 
        console.log(response.data[0].count);
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  useEffect(() => { each_page_contents(1); }, [])
  useEffect(() => { total_contents_request(); }, [total_contents, remain_contents]) // 뒤에 변수들의 값이 변할 때마다 실행



  return(
    <>
      <p className="tmp_title">내가 쓴 글</p>
      <div className="test">
        <table id="content_list">
          <thead>
            <tr>
              <th className="num">번호</th>
              <th className="content_title">제목</th>
              <th className="writer">작성자</th>
              <th className="date">날짜</th>
              <th className="click_count">조회수</th>
            </tr>
          </thead>
          <tbody>
            {contents.map((x) => {
              let link = `/plant_info_share/contents/${x.num}`;

              return (
                <tr>
                  <td className="num">{x.num}</td>
                  <td className="content_title"><Link to = {link}>{x.title}</Link></td>
                  <td className="writer" id="writer1">{x.writer}</td>
                  <td className="date">{x.date}</td>
                  <td className="click_count">{x.clickcount}</td>
                </tr>   
              )        
            })}
          </tbody>
        </table>

        <div className="pager"> 
          { page_button_create() } 
        </div>
      </div>
    </>
  );
}

export default Own_contents;


