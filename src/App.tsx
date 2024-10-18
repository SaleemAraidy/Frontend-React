import React from "react";
//import ReactDOM from "react-dom";
import "./index.css";
import Home from "./components/Home/Home";
import Login from "./components/Auth/Login/Login";
import Register from "./components/Auth/Register/Register";
import Navbar from "./components/Navbar/Navbar";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";


export default function App(){
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