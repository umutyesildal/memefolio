import React, { useState } from 'react';
import './App.css';
import Shitfolio from './Shitfolio';
import Holders from './Holders'; // Import the new Holders component if you're using it

function App() {
  const [activeTab,setActiveTab] = useState('tab1');
  const logState = state => {
    console.log('Toggled:', state)
}
  const renderTabContent = () => {
    switch (activeTab) {
      case 'tab1':
        return <Shitfolio />;
      case 'tab2':
        return <Holders />; // Assuming you're using the Holders component for tab 2
      default:
        return <Shitfolio />;
    }
  };

  return (
    <div className="App">
      <nav>
        <img className='logo' src='heart.png' ></img>
      </nav>
      {renderTabContent()}
    </div>
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