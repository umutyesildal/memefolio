import React from 'react';
import '../design/Statistics.css';

const Highlights = ({transactionsData}) => {
  return (
    <div className="highlights">
        <div className='highlights-item'><h2>total sol change <br/> {transactionsData['data']['totalSolChange'].toFixed(4)} sol</h2></div>
        <div className='highlights-item'><h2>best play <br/> {transactionsData['bestPlays']['best']['net'].toFixed(2)} sol</h2></div>
        <div className='highlights-item'><h2>worst play <br/> {transactionsData['bestPlays']['worst']['net'].toFixed(2)} sol</h2></div>
        <div className='highlights-item'><h2>holding <br/> {transactionsData['data']['holdingsAmount']} sol</h2></div>
        <div className='highlights-item'><h2>rugged <br/> {transactionsData['data']['ruggedAmount']} sol</h2></div>
        <div className='highlights-item'><h2>airdrop <br/> {transactionsData['data']['airdropsAmount']} sol</h2></div>
  </div>
  );
};

export default Highlights;
