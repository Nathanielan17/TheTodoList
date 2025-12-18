import logo from './logo.svg';
import './App.css';
import Login from "./Pages/Login.tsx";
import {BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from "./Pages/Home.tsx";
import SignUp from "./Pages/SignUp.tsx";

function App() {
  return (
    <Router>
        <Routes>
            <Route path="/" element={<Login/>} />
            <Route path="/home" element={<Home/>} />
            <Route path="/sign-up" element={<SignUp/>} />
        </Routes>
    </Router>
  );
}

export default App;
