import React, { useState } from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';

import Main from "./main/main";
import Login from "./login/login";
import Signup from "./login/signup";
import User_info from "./user_info/user_info";
import Profile from "./user_info/profile";

import Plant_info from "./plant_info/plant_info";
import Plant_info_share from "./menu/plant_info_share";
import Write from "./menu/write";
import Read from "./menu/read";
import Revise from "./menu/revise";

import Market from "./market/market_list";
import MarketRead from "./market/market_read";
import Chat from "./chat/chat1";
import Plant_album from "./plant_album/plant_album";

function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<Main />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/signup" element={<Signup />}></Route>
        <Route path="/user_info" element={<User_info />}></Route>
        <Route path="/user_info/profile" element={<Profile />}></Route>

        <Route path="/plant_info" element={<Plant_info />}></Route>
        <Route path="/plant_album" element={<Plant_album />}></Route>

        <Route path="/plant_market" element={<Market />}></Route>
        <Route path="/plant_market/contents/:num" element={<MarketRead />}></Route>

        <Route path="/:board" element={<Plant_info_share />}></Route>
        <Route path="/:board/contents/:num" element={<Read />}></Route>
        <Route path="/write" element={<Write />}></Route>
        <Route path="/:board/contents/:num/revise" element={<Revise />}></Route>


        <Route path="/chat" element={<Chat />}></Route>


        
      </Routes>
    </>
  );
}

export default App;
