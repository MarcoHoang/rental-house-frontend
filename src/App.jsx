// src/App.js
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Register from './components/login-register/Register';
import Login from './components/login-register/Login';
// import LoginPage from './pages/LoginPage';
// import HouseDetailPage from './pages/HouseDetailPage';

function App() {
  return (
    <Router>
      <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
        <Route path="/" element={<HomePage />} />

        {/* <Route path="/login" element={<LoginPage />} /> */}
        {/* <Route path="/houses/:id" element={<HouseDetailPage />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
