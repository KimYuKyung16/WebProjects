import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";

import Header from "../layout/header";
import { colorConfig } from '../config/color';

import axios from "axios";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // 아이콘 사용 위해 필요
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'; // 내 정보 아이콘

import styled from "styled-components"; // styled in js

import cookies from 'react-cookies'; // 쿠키 저장

/* 홈페이지 메인 타이틀 세팅값 */
const title_setting = {
  title_backcolor: colorConfig.main_color,
  title_textcolor: colorConfig.sub_color
}

/* 네비게이션바 세팅값 */
const navbar_setting = {
  navbar_backcolor: colorConfig.main_color,
  navbar_textcolor: colorConfig.sub_color
}

const Search = styled.div`

`;

function Plant_info_share() {
  const navigate = useNavigate(); // 페이지 이동을 위해 필요

  const [contents, setContents] = useState([]);

   // 한 번은 무조건 렌더링, total_contents 값이 바뀌면 렌더링
  // login_confirm();

  // // Effect가 수행되는 시점에 이미 DOM이 업데이트 되어있음을 보장함.
  // useEffect(() => { // 렌더링이 된 후에 실행하는 생명주기 메서드(첫 번째 렌더링, 업데이트 후에 일어나는 렌더링)
  //   document.title = `You clicked 3 times`;
  // });

  // function Contents_request() {
  //   axios.get('http://localhost:5000/plant_info_share/contents', { // 서버로 post 요청
  //       num: 1
  //     })
  //     .then(function (response) { // 서버에서 응답이 왔을 때
  //       const data = [...response.data];
  //       setContents(data);
  //     })
  //     .catch(function (error) {
  //       console.log(error);
  //     });
  // }

  let [total_contents, setTotalcontents] = useState(); // 게시글의 총 개수
  let one_page_contents = 20; // 한 페이지 당 게시글의 개수

  let [total_pages, setTotalpages] = useState(1); // 총 페이지 개수
  let [remain_contents, setRemaincontents] = useState(); // 나머지 게시글 개수

  
  // let [current_page, setCurrentpage] = useState(1);

  function each_page_contents(current_page) {
    axios.get('http://localhost:5000/plant_info_share/contents', { // 서버로 post 요청
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


  function page_middle_process(current_page) {
    return function() {
      each_page_contents(current_page);
    }
  }

    // 클로저를 이용해서 가장 마지막 값만 출력되는 오류를 해결
  function page_button_create() { // 페이지 버튼 생성
    let button_array = [];
    for (var i=1; i<total_pages+1; i++) {
      button_array.push(<input key={i} type="button" value={i} onClick={page_middle_process(i)} />)
    }
    return button_array;
  }
  

  
  function total_contents_request() { // 게시글의 총 개수
    axios.get('http://localhost:5000/plant_info_share/total_contents') // 서버로 post 요청
      .then(function (response) { // 서버에서 응답이 왔을 때
        setTotalcontents(response.data[0].count);
        // function test()  {
        //   setTotalcontents(total_contents => response.data[0].count);
        // }

   
        setTotalpages(parseInt(total_contents / one_page_contents));// 총 페이지 개수 설정
        setRemaincontents(total_contents % one_page_contents); // 나머지 게시글 개수 설정
       
        if (remain_contents) { // 현재 페이지가 1페이지가 아니고 나머지 페이지가 있다면
          setTotalpages(totalpages => total_pages+1) // 총 페이지에 +1
        } 
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  // total_contents_request().then(() => {
  //   setTotalpages(parseInt(total_contents / one_page_contents));// 총 페이지 개수 설정
  //   setRemaincontents(total_contents % one_page_contents); // 나머지 게시글 개수 설정
  // }
  // )



  // console.log(total_contents, total_pages, remain_contents);


  // function contents_request() {
  // axios.get('http://localhost:5000/plant_info_share/contents', { // 서버로 post 요청
  //     num: 1
  //   })
  //   .then(function (response) { // 서버에서 응답이 왔을 때
  //     total_contents = (response.data[0].count); // 게시글의 총 개수
  //   })
  //   .catch(function (error) {
  //     console.log(error);
  //   });
  // }






  function final() {

  }







  function login_confirm() {
    console.log(cookies.load('user_login'));
  }

  useEffect(() => {each_page_contents(1)}, [])
  useEffect(()=>{ total_contents_request(); }, [total_contents, remain_contents])




  return (
    <>
      <Header title_setting={title_setting} navbar_setting={navbar_setting}/>
      <Search>
        <p>글 검색</p>
        <input type="search"/>
        <FontAwesomeIcon icon={faMagnifyingGlass} />
      </Search>
      <table>
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
          {contents.map((x) => (
            <tr>
              <td className="num">{x.num}</td>
              <td className="content_title">{x.title}</td>
              <td className="writer" id="writer1"></td>
              <td className="date"></td>
              <td className="click_count"></td>
            </tr>
          ))
          }
        </tbody>
      </table>

      <div>
        {page_button_create()}
      </div>
     
      <div className="button_div">
        <input onClick={() => {navigate('/write');}} id="write_button" type="button" value="글쓰기" />
      </div>

    </>
  );
}

export default Plant_info_share;
