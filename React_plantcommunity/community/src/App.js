import React, { useState } from 'react';
// import './App.css';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';

import Main from "./main/main";
import Login from "./login/login";
import Signup from "./login/signup";
import User_info from "./user_info/user_info";
import Profile from "./user_info/profile";

import Plant_info_share from "./menu/plant_info_share";
import Write from "./menu/write";
import Read from "./menu/read";

function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<Main />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/signup" element={<Signup />}></Route>
        <Route path="/user_info" element={<User_info />}></Route>
        <Route path="/user_info/profile" element={<Profile />}></Route>

        <Route path="/:board" element={<Plant_info_share />}></Route>
        <Route path="/:board/contents/:num" element={<Read />}></Route>
        <Route path="/write" element={<Write />}></Route>
        
      </Routes>
    </>
  );
}

export default App;
