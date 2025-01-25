import React from 'react';
import './App.css'
import { ToastContainer } from 'react-toastify';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import Login from './pages/Login';


function App() {

  return (
    <>
      <ToastContainer position="bottom-right" theme="colored" closeButton={true} autoClose={3000}/>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
        </Routes>
      </Router>
    </>
  )
};

export default App
