import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import LoginAnubhav from './components/LoginSignup';
import Home from './pages/Home';
function App() {
  return (
        <Router>
          <div>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<LoginAnubhav />} />
            </Routes>
          </div>
          <Toaster />
        </Router>
  );
}

export default App;