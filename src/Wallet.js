import React, { useState } from 'react';
import './Wallet.css';
import Portfolio from './Portfolio'; // Adjust the import path as necessary
import Statistics from './Statistics'; // Import the Statistics component

const Wallet = ({ data, transactionData }) => {
  const [activeTab, setActiveTab] = useState('portfolio');

  return (
    <div className="wallet">
      <div className="wallet-tabs">
        <button
          className={`tab ${activeTab === 'portfolio' ? 'active' : ''}`}
          onClick={() => setActiveTab('portfolio')}
        >
          Portfolio
        </button>
        <button
          className={`tab ${activeTab === 'statistics' ? 'active' : ''}`}
          onClick={() => setActiveTab('statistics')}
        >
          Statistics
        </button>
      </div>
      <div className="wallet-content">
        {activeTab === 'portfolio' && <Portfolio data={data} />}
        {activeTab === 'statistics' && <Statistics data={transactionData} />}
      </div>
    </div>
  );
};

export default Wallet;
