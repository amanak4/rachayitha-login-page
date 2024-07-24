import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import LoginAnubhav from './components/AnubhavLogin';

function App() {
  return (
        <Router>
          <div>
            <Routes>
              <Route path="/login" element={<LoginAnubhav />} />
              {/* <Route path="/create-account" element={<CreateAccount />} /> */}
            </Routes>
          </div>
          <Toaster />
        </Router>
  );
}

export default App;