// App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Game from './Game';
import Menu from './Menu';

function App() {
  return (
    <Router>
    <Routes>
      <Route path="/" element={<Menu />} />
      <Route path="/game/:game" element={<Game />} />
    </Routes>
    </Router>
  );
}

export default App;
