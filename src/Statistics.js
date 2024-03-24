import React, { useState } from 'react';
import './Statistics.css';
import Modal from './Modal'; // Import the Modal component
import Portfolio from './Portfolio';

const Statistics = ({ walletData,transactionsData }) => {
  const [selectedToken, setSelectedToken] = useState(null);
  const [tokenData, setTokenData] = useState(null);
  const [isloading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);


   console.log(transactionsData)

  const openModal = async (token) => {
    console.log("Opening modal for token:", token);
    setIsLoading(true)
    setSelectedToken(token);
    await fetchTokenData(token)
    console.log("Selected token state updated to:", token);
  };

async function fetchTokenData(tokenId) {
    const url = `https://price.jup.ag/v4/price?ids=${tokenId}&vsToken=So11111111111111111111111111111111111111112`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

                // Check if the data for the token is empty
                if (!data.data[tokenId] || Object.keys(data.data[tokenId]).length === 0) {
                  setTokenData( {
                      mintSymbol: "Rugged Token",
                      price: "Rugged Token",
                      birdeyeLink: "Rugged Token"
                  })
              } else {
                const tokenData = data.data[tokenId];
      
                setTokenData({
                    mintSymbol: tokenData.mintSymbol,
                    price: tokenData.price,
                    birdeyeLink: `https://birdeye.so/token/${tokenId}`
                })
              }
              console.log(tokenData)
              setIsLoading(false)
              setIsError(false)
    } catch (error) {
        console.error("Error fetching token data:", error);
        setIsError(true)
        throw error;
    }
}

  
  return (
    <div className='all-statistics' >
      <Portfolio walletData={walletData} />
      <div className="highlights">
        <div style={{  backgroundColor: "#c2fac28f"}} className='highlights-item'><h2>Total SOL Change <br/> {transactionsData['data']['totalSolChange'].toFixed(4)} SOL</h2></div>
        <div style={{  backgroundColor: "#ffaff7ca"}} className='highlights-item'><h2>Holding <br/> {transactionsData['data']['holdingsAmount']} SOL</h2></div>
        <div style={{  backgroundColor: "#d0e186"}} className='highlights-item'><h2>Rugged <br/> {transactionsData['data']['ruggedAmount']} SOL</h2></div>
        <div style={{  backgroundColor: "#c5d1ff"}} className='highlights-item'><h2>Airdrop <br/> {transactionsData['data']['airdropsAmount']} SOL</h2></div>
      </div>
      <div className="statistics-grid">
        {Object.entries(transactionsData).map(([token, stats]) => {
          return (
            token !== 'data' && (
              <div
              onClick={() => openModal(token)}
                key={token}
                className={`statistics-item ${stats.tag === "holding" ? "holding-net" : stats.tag === "Airdrop" ? "airdrop-net" : (stats.net >= 0 ? 'positive-net' : 'negative-net')}`}
              >
                <div className="token-details">
                  <div className='update'>
                    <img className='token-img' alt='token' src={stats.content.links.image} />
                    <p className="token-name">{stats.content.metadata.symbol}</p>
                  </div>
                  <p>Buy: {stats.buy}</p>
                  <p>Sell: {stats.sell.toFixed(4)}</p>
                  <p>Net: {stats.net.toFixed(4)}</p>
                </div>
              </div>
            )
          );
        })}
      </div>
      {selectedToken && !isloading && tokenData && !isError && (
        <Modal isOpen={!!selectedToken} onClose={() => setSelectedToken(null)}>
          <button className="close-button" onClick={() => setSelectedToken(null)}>X</button>
          <h3>Transactions for {tokenData.mintSymbol}</h3>
          <p>Current price: {tokenData.price}</p>
          <a href={tokenData.birdeyeLink} >Check {tokenData.mintSymbol} Birdeye</a>
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
    </div>
  );
};

export default Statistics;


/*

*/