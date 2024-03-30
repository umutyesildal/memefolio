import React, { useState } from 'react';
import '../design/Statistics.css';
import Modal from '../widgets/modal'; // Import the Modal component
import UserPortfolio from './UserPortfolio';
import StatisticsItem from '../widgets/statisticsItem';
import Highlights from '../widgets/highlights';

/// TODO: Change Transactions page

const UserStatistics = ({walletAddress, walletData,transactionsData }) => {
  const [selectedToken, setSelectedToken] = useState(null);
  const [tokenData, setTokenData] = useState(null);
  const [activeTab,setActiveTab] = useState('tab1');


  const openModal = async (token, stats) => {
    console.log("Opening modal for token:", token);
    setSelectedToken(token);
    setTokenData({
      mintSymbol: stats.token_info.symbol,
      price: stats.token_info.price_info.price_per_token,
      birdeyeLink: `https://birdeye.so/token/${token}`
  })
    console.log("Selected token state updated to:", token);
  };


  const renderTabContent = () => {
    switch (activeTab) {
      case 'tab1':
        return      <div className='all-statistics' >      
        <Highlights transactionsData={transactionsData }/>
        <div className="statistics-grid">
          {Object.entries(transactionsData).map(([token, stats]) => {
            return ( 
              <div onClick={() => openModal(token, stats)}>
              <StatisticsItem token={token} stats={stats} />
              </div>
            );
          })}
        </div>
        {selectedToken && tokenData && (
          <Modal isOpen={!!selectedToken} onClose={() => setSelectedToken(null)}>
            <button className="close-button" onClick={() => setSelectedToken(null)}>X</button>
            <h3>Transactions for {tokenData.mintSymbol}</h3>
            <p>Current price: {tokenData.price}</p>
            <a href={tokenData.birdeyeLink} target="_blank" >Check {tokenData.mintSymbol} Birdeye</a>
            <div>
              {transactionsData[selectedToken].txs.map((tx, index) => (
                <div key={index} className={`transaction-item transaction-${tx.type}`}>
                  <span className="transaction-detail">Time: </span><span>{tx.blockTime}</span>
                  <span className="transaction-detail">Type: </span><span>{tx.type}</span>
                  <span className="transaction-detail">SOL Change: </span><span>{tx.solChange}</span>
                  <a href={tx.transactionId} target="_blank" rel="noopener noreferrer">View Transaction</a>
                </div>
              ))}
            </div>
          </Modal>
        )}
      </div>;
      case 'tab2':
        return<UserPortfolio walletAddress={walletAddress}  walletData={walletData} /> // Assuming you're using the Holders component for tab 2
      default:
        return     <div className='all-statistics' >      
        <Highlights transactionsData={transactionsData }/>
        <div className="statistics-grid">
          {Object.entries(transactionsData).map(([token, stats]) => {
            return ( 
              <div onClick={() => openModal(token, stats)}>
              <StatisticsItem token={token} stats={stats} />
              </div>
            );
          })}
        </div>
        {selectedToken && tokenData && (
          <Modal isOpen={!!selectedToken} onClose={() => setSelectedToken(null)}>
            <button className="close-button" onClick={() => setSelectedToken(null)}>X</button>
            <h3>Transactions for {tokenData.mintSymbol}</h3>
            <p>Current price: {tokenData.price}</p>
            <div>
              {transactionsData[selectedToken].txs.map((tx, index) => (
                <div key={index} className={`transaction-item transaction-${tx.type}`}>
                  <span className="transaction-detail">Time: </span><span>{tx.blockTime}</span>
                  <span className="transaction-detail">Type: </span><span>{tx.type}</span>
                  <span className="transaction-detail">SOL Change: </span><span>{tx.solChange}</span>
                  <a href={tx.transactionId} target="_blank" rel="noopener noreferrer">View Transaction</a>
                </div>
              ))}
            </div>
          </Modal>
        )}
      </div>;
    }
  };
  
  return (
    <div className='all-statistics' >
          <h1>{"Wallet Address"}</h1>
          <h1>{walletAddress}</h1>
            <div className="statistics-bar">
        <button onClick={() => setActiveTab('tab1')} className={activeTab === 'tab1' ? 'active' : ''}>
          Transactions
        </button>
        <button onClick={() => setActiveTab('tab2')} className={activeTab === 'tab2' ? 'active' : ''}>
          Holdings
        </button>
      </div>
      {renderTabContent()}
    </div>
  );
};

export default UserStatistics;


/*

*/