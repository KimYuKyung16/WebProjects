import React, { useState } from 'react';
import './App.css';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';

import Header from "./layout/header";
import Main from "./main/main";
import Login from "./login/login";
import Signup from "./login/signup";
import User_info from "./user_info/user_info";

function App() {

  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Main />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/signup" element={<Signup />}></Route>
        <Route path="/user_info" element={<User_info />}></Route>
      </Routes>
    </>
  );
}

export default App;
