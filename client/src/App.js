// ReactJS components
import React from "react";

// Local ReactJS components
import LoadContract from "./components/LoadContract";
import HomepageScreen from "./screens/HomepageScreen";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import AdminHomeScreen from "./screens/AdminHomeScreen";
import StoreHomeScreen from "./screens/StoreHomeScreen";
import VerifyPriceScreen from "./screens/VerifyPriceScreen";

// React Router
import { Route, BrowserRouter as Router } from "react-router-dom";

import "./App.css";

export default function App() {


  return (
    <Router>
      <div className="App">
        <Route path="/" exact component={HomepageScreen} />
        <Route path="/login" component={LoginScreen} />
        <Route path="/register" component={RegisterScreen} />
        <Route path="/verify/:storeId/:productId" component={VerifyPriceScreen} />
        <Route path="/admin" component={AdminHomeScreen} />
        <Route path="/store" component={StoreHomeScreen} />

      </div>
    </Router>
  );
}
