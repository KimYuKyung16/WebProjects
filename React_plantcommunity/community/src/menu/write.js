import React, { useState } from 'react';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "../layout/header";
import './write.css';

import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

import cookies from 'react-cookies'; // 쿠키

// import SimpleUploadAdapter from '@ckeditor/ckeditor5-upload/src/adapters/simpleuploadadapter';

import styled from "styled-components"; // styled in js

/* 홈페이지 메인 타이틀 세팅값 */
const title_setting = {
  title_backcolor: "rgb(107, 164, 255)",
  title_textcolor: "rgb(255, 255, 255)",
}

/* 네비게이션바 세팅값 */
const navbar_setting = {
  navbar_backcolor: "rgb(107, 164, 255)",
  navbar_textcolor: "rgb(255, 255, 255)",
}


function Write() {
  // const navigate = useNavigate(); // 페이지 이동을 위해 필요

  let [content_title, setTitle] = useState(); // 글 제목
  let data; // 글 내용
  let [board, setBoard] = useState('plant_info_share');

  function date(){ //날짜를 구해주는 함수
    var today = new Date();

    var year = today.getFullYear();
    var month = ('0' + (today.getMonth() + 1)).slice(-2);
    var day = ('0' + today.getDate()).slice(-2);

    var dateString = year + '.' + month  + '.' + day;
    return dateString
}

  function time(){ //시간을 구해주는 함수
      var today = new Date();   

      var hours = ('0' + today.getHours()).slice(-2); 
      var minutes = ('0' + today.getMinutes()).slice(-2);
      var seconds = ('0' + today.getSeconds()).slice(-2); 
      
      var timeString = hours + ':' + minutes  + ':' + seconds;
      return timeString
  }

  const onChangeBoard = (e) => { // 글 저장 게시판을 변경할 때마다
    setBoard(e.target.value);
  }

  const onChangeTitle = (e) => { // 글 제목을 변경할 때마다
    setTitle(e.target.value);
  }


  function write_process(){
    if (content_title && data){
      const contents_send_val = {
        title: content_title,
        content: data,
        board: board,
        writer: cookies.load('nickname'),
        date: date(),
        time: time(),
        clickcount: 0
      }
      axios.post('http://localhost:5000/write/plant_info_share', { // 서버로 post 요청
        contents_send_val
      })
      .then(function (response) { // 서버에서 응답이 왔을 때
        console.log('저장완료')
        // if (response.data.login_status === 'success') {
        //   // navigate('/'); // 메인페이지로 이동
        // } else {
        //   alert("로그인에 실패하셨습니다.");
        // }  
      })
      .catch(function (error) {
        console.log(error);
      });
    } else {
      alert("작성되지 않은 부분이 있습니다.")
    }
    
  }

  return (
    <>
      <Header title_setting={title_setting} navbar_setting={navbar_setting}/>
      <div className="App">
        <div>
          <input onChange={onChangeTitle} id="content_title" type="text" placeholder='제목을 입력해주세요'></input>
          <select onChange={onChangeBoard} value={board}>
            <option value='plant_info_share'>식물 정보 공유</option>
            <option value='plant_introduce'>내 식물 자랑</option>
          </select>
        </div>
        <CKEditor
            editor={ ClassicEditor }
            // data="<p>Hello from CKEditor 5!</p>"
            onReady={ editor => {
                // You can store the "editor" and use when it is needed.
                console.log( 'Editor is ready to use!', editor );
            } }
            onChange={ ( event, editor ) => {
                data = editor.getData();
                console.log( { event, editor, data } );
                console.log({data});
            } }
            onBlur={ ( event, editor ) => {
                console.log( 'Blur.', editor );
            } }
            onFocus={ ( event, editor ) => {
                console.log( 'Focus.', editor );
            } }
        />
      </div>
      <input onClick={write_process} type="button" value="저장"/>
    </>
  );
}

export default Write;
