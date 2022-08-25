import React, { useState } from 'react';
// import './App.css';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';

import Main from "./main/main";
import Login from "./login/login";
import Signup from "./login/signup";
import User_info from "./user_info/user_info";

import Plant_info_share from "./menu/plant_info_share";

function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<Main />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/signup" element={<Signup />}></Route>
        <Route path="/user_info" element={<User_info />}></Route>

        <Route path="/plant_info_share" element={<Plant_info_share />}></Route>
      </Routes>
    </>
  );
}

export default App;
