import React from 'react';
import './Wallet.css';
import Statistics from './Statistics'; // Import the Statistics component

const Wallet = ({transactionData }) => {

  return (
    <div className="wallet">
      <div className="wallet-content">
         <Statistics data={transactionData} />
      </div>
    </div>
  );
};

export default Wallet;