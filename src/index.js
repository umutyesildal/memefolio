import React from 'react';
import ReactDOM from 'react-dom/client';
import './design/index.css';
import App from './App';
import TokenHolders from './pages/TokenHolders';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Memefolio from './pages/Memefolio';
import AlphaFinder from './pages/AlphaFinder';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
      <BrowserRouter>
      <Routes>
          <Route index element={<App />} />
          <Route path="/token-holders" element={<TokenHolders />} />
          <Route path="/wallet-analyzer" element={<Memefolio />} />
          <Route path="/alpha-finder" element={<AlphaFinder />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
