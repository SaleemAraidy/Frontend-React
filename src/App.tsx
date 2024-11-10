import React from "react";
//import ReactDOM from "react-dom";
import "./index.css";
import Home from "./components/Home/Home";
import Login from "./components/Auth/Login/Login";
import Register from "./components/Auth/Register/Register";
import Navbar from "./components/Navbar/Navbar";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import axios from "axios";

const initAxios = () => {
  axios.defaults.withCredentials = true;
  axios.interceptors.response.use(
    function (response) {
      return response;
    },
    function (error) {
      if (error.response && (error.response.status === 401)) {
        window.location.href = "/login";
      }/* else if(error.response && (error.response.status === 403)) {

      }*/
      return Promise.reject(error);
    }
  );
}

export default function App(){
  initAxios();
  return(
    <div className="app"> 
      <BrowserRouter>
       <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />  
          </Routes>      
        </main>
      </BrowserRouter>
    </div>
  );
}