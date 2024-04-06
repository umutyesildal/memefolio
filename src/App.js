import React, { useState } from 'react';
import './design/App.css';
import Memefolio from './pages/Memefolio';
import TokenHolders from './pages/TokenHolders'; // Import the new Holders component if you're using it
import { ParallaxProvider } from 'react-scroll-parallax';

function App() {
  const [activeTab,setActiveTab] = useState('tab1');
  const renderTabContent = () => {
    switch (activeTab) {
      case 'tab1':
        return <Memefolio />;
      case 'tab2':
        return <TokenHolders />; // Assuming you're using the Holders component for tab 2
      default:
        return <Memefolio />;
    }
  };

  return (
    <ParallaxProvider>
      <div className="App">
        {renderTabContent()}
      </div>
    </ParallaxProvider>

  );
}

export default App;


/*

            <div className="tab-bar">
        <button onClick={() => setActiveTab('tab1')} className={activeTab === 'tab1' ? 'active' : ''}>
          Shitfolio
        </button>
        <button onClick={() => setActiveTab('tab2')} className={activeTab === 'tab2' ? 'active' : ''}>
          Holders
        </button>
      </div>

*/