import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom"
import Count from './Auth/Count'
import Login from "./Auth/Login";
import Dashboard from "./Components/Dashboard";
import Client from "./Components/Client";
import Flight from "./Components/Flight";
import Reservation from "./Components/Reservation";
import Home from "./Components/Home";
import Profile from "./Components/Profile";
import Navbar from "./Components/Navbar/Navbar";
import "aos/dist/aos.css";
import AOS from "aos";
import React from "react";
import Search from "./Components/Search";
import Help from "./Components/Help";
import Primo from "./Components/Primo";


const AppContent = () => {
  const location = useLocation();
  const showNavbar = !['/Dashboard', '/Login', '/Count', '/Client', '/Flight', '/Profile', '/Reservation', '/Home'].includes(location.pathname);


  return (
    <div className="overflow-hidden">
    {showNavbar && <Navbar />}
 
      <Routes>
      <Route path="/" element={ <Login />}></Route>
        <Route path="/Count" element={ <Count />}></Route>
        <Route path="/Login" element={ <Login />}></Route>
        <Route path="/Search" element={ <Search />}></Route>
        <Route path="/Help" element={ <Help />}></Route>
        <Route path="/Primo" element={ <Primo />}></Route>
        <Route path="/Dashboard" element={ <Dashboard />}></Route>
        <Route path="/" element={ <Dashboard />}>
        <Route path="/Client" element={ <Client />}></Route>
        <Route path="/Flight" element={ <Flight />}></Route>
        <Route path="/Profile" element={ <Profile />}></Route>
        <Route path="/Reservation" element={ <Reservation />}></Route>
        <Route path="/Home" element={ <Home />}></Route>
        </Route>
      </Routes>
    </div>
  );
};
const App = () => {
  React.useEffect(() => {
    AOS.init({
      duration: 600,
      easing: "ease-in-sine",
      offset: 100,
    });
  }, []);

  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;
