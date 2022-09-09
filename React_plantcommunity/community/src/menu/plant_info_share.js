import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from "react-router-dom";

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

  // useEffect(() => { // 렌더링이 된 후에 실행하는 생명주기 메서드(첫 번째 렌더링, 업데이트 후에 일어나는 렌더링)
  //   document.title = `you clicked 3 times`;
  // });

  axios.defaults.headers.common['cookies'] = encodeURIComponent(cookies.load('login_cookie')); // for all requests


  let [total_contents, setTotalcontents] = useState(); // 게시글의 총 개수
  let one_page_contents = 20; // 한 페이지 당 게시글의 개수

  let [total_pages, setTotalpages] = useState(1); // 총 페이지 개수
  let [remain_contents, setRemaincontents] = useState(); // 나머지 게시글 개수

  let [search_value, setSearchvalue] = useState();

  let search_change = (e) => {
    setSearchvalue(e.target.value);
    console.log(search_value);
  }

  /* 검색어에 해당하는 게시글 출력 */
  function search_conents() {
    axios.get('http://localhost:5000/board/plant_info_share/search', { // 서버로 post 요청
      params: {
        search_val : search_value
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
  

  function each_page_contents(current_page) {
    axios.get('http://localhost:5000/board/plant_info_share', { // 서버로 post 요청
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
      button_array.push(<input type="button" value={i} onClick={page_middle_process(i)} />)
    }
    return button_array;
  }
  

  
  function total_contents_request() { // 게시글의 총 개수
    axios.get('http://localhost:5000/board/plant_info_share/total_contents') // 서버로 post 요청
      .then(function (response) { // 서버에서 응답이 왔을 때
        setTotalcontents(response.data[0].count);
   
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


  
  // let test = {
  //   headers: {
  //     test_cookie: encodeURIComponent(cookies.load('user_login'))
  //   }
  // }


  function login_confirm() {
    // var login_cookie = cookies.load('user_login'); // user_login이라는 이름의 쿠키 불러오기
    // console.log(cookies.load('login_cookie'));

    let authentication;

    axios.get('http://localhost:5000/login/authentication') // 서버로 post 요청
      .then(function (response) { // 서버에서 응답이 왔을 때
       if (response.data.authenticator === true) {
        console.log("인증되어있는 회원이 맞습니다.")
        authentication = true;
        // navigate('/write'); // 글쓰기 페이지로 이동
       } else {
        alert("글을 쓸 권한이 없습니다. 로그인을 먼저 해주세요.");
        authentication = false;
        navigate('/login'); // 로그인 페이지로 이동
       }
      })
      .catch(function (error) {
        console.log(error);
      });

      if (authentication) { navigate('/write'); }
      else { navigate('/login'); }

    

    navigate('/write'); // 글쓰기 페이지로 이동

    // if (login_cookie !== undefined) { // 로그인이 되어있을 때
    //   navigate('/write'); // 글쓰기 페이지로 이동
    // } else { // 로그인이 되어있지 않을 때
    //   alert("글을 쓸 권한이 없습니다. 로그인을 먼저 해주세요.");
    //   navigate('/login'); // 로그인 페이지로 이동
    // }  
  }

  // Effect가 수행되는 시점에 이미 DOM이 업데이트 되어있음을 보장함.
  useEffect(() => { search_conents(); }, [search_value]) // 검색어가 달라질 때마다
  useEffect(() => { each_page_contents(1) }, []) // 처음에 무조건 한 번 실행
  useEffect(() => { total_contents_request(); }, [total_contents, remain_contents]) // 뒤에 변수들의 값이 변할 때마다 실행
 

  return (
    <>
      <Header title_setting={title_setting} navbar_setting={navbar_setting}/>
      <Search>
        <p>글 검색</p>
        <input onChange={search_change} type="search" value={search_value}/>
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

      <div>
        {page_button_create()}
      </div>
     
      <div className="button_div">
        <input onClick={login_confirm} id="write_button" type="button" value="글쓰기" />
      </div>

    </>
  );
}

export default Plant_info_share;
