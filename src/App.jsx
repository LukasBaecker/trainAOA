import { hot } from "react-hot-loader/root";
import React from "react";
import "./scss/index.scss";
import "./css/style.module.css";

import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from "react-router-dom";
import Navigation from "./components/Navbar.jsx";
import Home from "./components/Home.jsx";
import Footer from "./components/Footer.jsx";
import Signin from "./components/auth/Signin.jsx";
import Signup from "./components/auth/Signup.jsx";
import { useSelector } from "react-redux";
import Start from "./components/Start.jsx";
import User from "./components/User.jsx";
import Autherror from "./components/messages/Autherror.jsx";
import Success from "./components/messages/Success.jsx";
const App = () => {
  const authorized = useSelector((state) => state.auth.isAuthenticated);
  return (
    <>
      <Router>
        <Navigation />
        <Switch>
          <Route exact path="/">
            {authorized ? <Home /> : <Redirect to="/start" />}
          </Route>
          <Route exact path="/signin">
            {authorized ? <Redirect to="/" /> : <Signin />}
          </Route>
          <Route exact path="/signup">
            {authorized ? <Redirect to="/" /> : <Signup />}
          </Route>
          <Route exact path="/user/:userId" component={User} />
          <Route exact path="/start" component={Start} />
          <Route exact path="/autherror" component={Autherror} />
          <Route exact path="/success/:message" component={Success} />
        </Switch>
        <Footer />
      </Router>
    </>
  );
};

export default hot(App);
