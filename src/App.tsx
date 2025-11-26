import React, { Component } from 'react';
import './App.css';
import VerbList from './pages/conjugacion/VerbList';
import { Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ConjugationsSettings from './pages/settings/ConjugacionSettings';



function App() {
  return (
    <div className="App">
      <Routes>
        <Route path='/' element={<HomePage/>} />
        <Route path='/setup' element={<ConjugationsSettings/>} />
        <Route path='/list' element={<VerbList/>} />
      </Routes>
    </div>
  );
}

export default App;
