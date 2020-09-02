import React, { useEffect } from "react";
import axios from "axios";
import "./App.css";
import "./resources/scripts/LandingPage";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import Header from "./components/Header";
import LandinPage from "./components/LandingPage";
import LoginForm from "./components/LoginForm";
import SignupForm from "./components/SignupForm";
import SearchForm from "./components/SearchForm";
import ParkingDetailes from "./components/ParkingDetails";
import LendForm from "./components/LendForm";
import UserContextProvider from "./contexts/userContext";
import LocattionContextProvider from "./contexts/locationContext";
import Footer from "./components/Footer";
import Checkout from "./components/Checkout";
import Orders from "./components/Orders";
import Invoice from "./components/Invoice";
import MyParkings from "./components/MyParkings";
import RecentOrders from "./components/RecentOrders";

function App() {
  return (
  <UserContextProvider>
    <LocattionContextProvider>
      <Router>
          <Header />
          <Switch>
            <Route exact path="/">
              <LandinPage />
            </Route>
            <Route path="/login">
              <LoginForm />
            </Route>
            <Route path="/signup">
              <SignupForm />
            </Route>
            <Route exact path="/book">
              <SearchForm />
            </Route>
            <Route exact path="/lend">
              <LendForm />
            </Route>
            <Route exact path="/updateParking">
              <LendForm />
            </Route>
            <Route path="/book/:id">
              <ParkingDetailes />
            </Route>
            <Route path="/orders">
              <Orders/>
            </Route>
            <Route path="/parkings">
              <MyParkings/>
            </Route>
            <Route path="/recent-orders">
              <RecentOrders/>
            </Route>
            <Route path="/invoice/:id">
              <Invoice/>
            </Route>
            <Route path="/checkout/:id">
              <Checkout/>
            </Route>
          </Switch>
      </Router>
      <Footer/>
    </LocattionContextProvider>
  </UserContextProvider>
  );
}

export default App;
