// ReactJS components
import React from "react";

// Local ReactJS components
import LoadContract from "./components/LoadContract";
//import HomepageScreen from "./screens/HomepageScreen";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import AdminHomeScreen from "./screens/AdminHomeScreen";
import StoreHomeScreen from "./screens/StoreHomeScreen";
import VerifyPriceScreen from "./screens/VerifyPriceScreen";
import SignIn from "./components/landingpage/SignIn";
import SignUp from "./components/landingpage/SignUp";

import Home from "./components/landingpage/Home";

// React Router
import { Route, BrowserRouter as Router } from "react-router-dom";

import "./App.css";

export default function App() {


  return (
    <Router>
      <div className="App">
        <Route path="/" exact component={Home} />
        <Route path="/login" component={SignIn} />
        <Route path="/register" component={SignUp} />
        <Route path="/verify/:storeId/:productId" component={VerifyPriceScreen} />
        <Route path="/admin" component={AdminHomeScreen} />
        <Route path="/store" component={StoreHomeScreen} />

      </div>
    </Router>
  );
}
