import React from "react";
//import ReactDOM from "react-dom";
import "./index.css";
import Home from "./components/Home/Home";
import Login from "./components/Auth/Login/Login";
import Register from "./components/Auth/Register/Register";
import Navbar from "./components/Navbar/Navbar";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { signal } from "@preact/signals-react";
import { UserData } from "./model/user.model";
import LoggedinNavbar from "./components/LoggedinNavbar.tsx/LoggedinNavbar";
import SavedJobs from "./components/Jobs/SavedJobs";

export const signedInUser = signal<UserData | null>(null);

const initAxios = () => {
  axios.defaults.withCredentials = true;
  axios.interceptors.response.use(
    function (response) {
      const token = Cookies.get("access_token") as string;
      if (token) {
        console.log("--------Token:--------", token);
        const decodedToken: any = jwtDecode(token);
        console.log("--------Decoded Token:--------", decodedToken);

        signedInUser.value = {
          email: decodedToken.email,
          givenName: decodedToken.given_name,
          familyName: decodedToken.family_name,
          picture: decodedToken.picture,
        };
      }
      if (response.data && response.data.token) {
        Cookies.set("access_token", token, { expires: 1 }); // Expires in 1 day
        console.log("Token is ok");
      }
      return response;
      return response;
    },
    function (error) {
      if (error.response && error.response.status === 401) {
        window.location.href = "/login";
      } /* else if(error.response && (error.response.status === 403)) {

      }*/
      return Promise.reject(error);
    }
  );
};

export default function App() {
  initAxios();
  return (
    <div className="app">
      <BrowserRouter>
        {/*<Navbar />*/}
        <LoggedinNavbar /> {/* Add this line */}
        <main>
          <Routes>
            <Route path="/saved-jobs" element={<SavedJobs />} />
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </main>
      </BrowserRouter>
    </div>
  );
}
