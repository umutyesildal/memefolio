import React from 'react';
import './Wallet.css';
import Statistics from './Statistics'; // Import the Statistics component

const Wallet = ({walletData,transactionsData }) => {

  return (
    <div className="wallet">
      <div className="wallet-content">
         <Statistics walletData={walletData} transactionsData={transactionsData} />
      </div>
    </div>
  );
};

export default Wallet;