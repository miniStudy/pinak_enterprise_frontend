import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Banks from './components/Banks';
import BaseLayout from './components/BaseLayout';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

const App = () => {
  return (
    <>
    <Router>
      <Routes>
        <Route path="/" element={<BaseLayout />}>
          <Route index element={<Home />} />
          <Route path="banks" element={<Banks />} />
        </Route>
      </Routes>
    </Router>
    </>
  );
};

export default App;
