import React from 'react';
import '../design/Statistics.css';

const Highlights = ({transactionsData}) => {
  return (
    <div className="highlights">
        <div className='highlights-item'><h2>Total SOL Change <br/> {transactionsData['data']['totalSolChange'].toFixed(4)} SOL</h2></div>
        <div className='highlights-item'><h2>Holding <br/> {transactionsData['data']['holdingsAmount']} SOL</h2></div>
        <div className='highlights-item'><h2>Rugged <br/> {transactionsData['data']['ruggedAmount']} SOL</h2></div>
        <div className='highlights-item'><h2>Airdrop <br/> {transactionsData['data']['airdropsAmount']} SOL</h2></div>
  </div>
  );
};

export default Highlights;
