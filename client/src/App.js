// ReactJS components
import React from "react";

// Local ReactJS components
import AdminHomeScreen from "./screens/AdminHomeScreen";
import StoreHomeScreen from "./screens/StoreHomeScreen";
import VerifyPriceScreenDemo from "./screens/VerifyPriceScreenDemo";
import VerifyPriceScreen from "./screens/VerifyPriceScreen";
import SignIn from "./components/landingpage/SignIn";
import SignUp from "./components/landingpage/SignUp";
import Home from "./components/landingpage/Home";
import StoreWelcomeScreen from "./screens/StoreWelcomeScreen";

// React Router
import { Route, BrowserRouter as Router } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
import { AuthProvider } from "./context/AuthContext";
import { SmartContractProvider } from "./context/SmartContractContext";

import "./App.css";

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Route path="/" exact component={Home} />
          <Route path="/login" component={SignIn} />
          <Route path="/register" component={SignUp} />
          <Route
            path="/demo/verify/:storeId/:productId"
            component={VerifyPriceScreenDemo}
          />
          <SmartContractProvider>
            <Route
              path="/verify/:storeId/:productId"
              component={VerifyPriceScreen}
            />
          </SmartContractProvider>
          <PrivateRoute path="/admin" component={AdminHomeScreen} />
          <PrivateRoute path="/store" component={StoreHomeScreen} />
          <PrivateRoute path="/store-welcome" component={StoreWelcomeScreen} />
        </div>
      </Router>
    </AuthProvider>
  );
}
