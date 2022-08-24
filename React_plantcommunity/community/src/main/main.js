import React, { useState} from 'react';
import axios from "axios";
import { useNavigate } from "react-router-dom";
// import './App.css';



function Main() {
  const navigate = useNavigate(); // 페이지 이동을 위해 필요

  // cookie_create();



  // function cookie_create() {
  //   axios.post('http://localhost:5000/login/process', {
  //     withCredentials: true
  //   }) // 서버로 get 요청 (세션 확인)
  //     .then(function (response) { // 서버에서 응답이 왔을 때
  //       console.log(response.data.cookie)
  //       if (login_cookie != undefined) { // 로그인이 되어있을 때
  //         // navigate('/'); // 내 정보 페이지로 이동
  //       } else { // 로그인이 되어있지 않을 때
  //         navigate('/login'); // 로그인 페이지로 이동
  //       }  
  //     })
  //     .catch(function (error) {
  //       console.log(error);
  //     });
  // }

  return (
    <div>
    </div>
  );
}

export default Main;
