import React from 'react';
import './design/App.css';
import HowToUse from './widgets/howToUse'
import { useNavigate } from "react-router-dom";

function App() {

  const navigate = useNavigate();

  return (
      <div className="App">
        <HowToUse />
        <div className="starter">
                <h1>🤑</h1>
                <h1>memefolio</h1>
                <p>simple accesss to your personal memecoin analyzer</p>
              <div className="starter-input-group">
                <button onClick={() => navigate("/token-holders")} >{"Token Holders"}</button>
                <button onClick={() => navigate("/wallet-analyzer")} >{"Wallet Analyzer"}</button>
                <button onClick={() => navigate("/alpha-finder")} >{"The Alpha finder"}</button>
            </div>
        </div>
      </div>
  );
}

export default App;




