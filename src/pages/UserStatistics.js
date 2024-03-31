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


  function ImageWithTextOverlay() {
    return (
      <div style={{ position: 'relative', width: '300px' }}>
        <img src="https://img.freepik.com/free-photo/abstract-surface-textures-white-concrete-stone-wall_74190-8189.jpg?size=626&ext=jpg&ga=GA1.1.1887574231.1711756800&semt=sph" alt="Your Image" style={{ width: '100%' }} />
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center', color: 'white', backgroundColor: 'rgba(0, 0, 0, 0.5)', padding: '10px' }}>
          <h2>Your Text</h2>
          <p>Some additional text if needed</p>
        </div>
      </div>
    );
  }

  const openModal = async (token, stats) => {
    console.log("Opening modal for token:", token);
    setSelectedToken(token);
    console.log(stats)
    if(stats.token_info.price_info === undefined){
    setTokenData({
      mintSymbol: stats.content.metadata.symbol,
      price: "Unknown",
      birdeyeLink: `https://birdeye.so/token/${token}`
  })
    }

    setTokenData({
      mintSymbol: stats.content.metadata.symbol,
      price: stats.token_info.price_info,
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
          <div className='transaction-header'>
            <button className="close-button" onClick={() => setSelectedToken(null)}>X</button>
            <h3>{tokenData.mintSymbol}</h3>
            <p>current price: {tokenData.price}</p>
            <a href={tokenData.birdeyeLink} target="_blank" >Check {tokenData.mintSymbol} birdeye</a>
            </div>
              {transactionsData[selectedToken].txs.map((tx, index) => (
                <a href={tx.transactionId} target="_blank" rel="noopener noreferrer">
                <div key={index} className={`transaction-item transaction-${tx.type}`}>
                  <span className="transaction-detail">time: </span><span>{tx.blockTime}</span>
                  <span className="transaction-detail">type: </span><span>{tx.type}</span>
                  <span className="transaction-detail">SOL change: </span><span>{tx.solChange}</span>
                </div>
                </a>

              ))}
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
      </div>;
    }
  };
  
  return (
    <div className='all-statistics' >
    <h1>{"transactions since " + transactionsData['data'].lastTxDate+  " to " + transactionsData['data'].firstTxDate }</h1> 
          <h1>{"for " +walletAddress}</h1>
            <div className="statistics-bar">
        <button onClick={() => setActiveTab('tab1')} className={activeTab === 'tab1' ? 'active' : ''}>
          transactions
        </button>
        <button onClick={() => setActiveTab('tab2')} className={activeTab === 'tab2' ? 'active' : ''}>
          holdings
        </button>
      </div>
      {renderTabContent()}
    </div>
  );
};

export default UserStatistics;


/*

*/