import React, { useState } from 'react';
import '../design/Portfolio.css';
import Modal from './modal'


// Statistics Item is a single item in Statistics page that shows buy sell and anything.
const StatisticsItem = ({ stats }) => {

  const [selectedToken, setSelectedToken] = useState(null);
  const [tokenData, setTokenData] = useState(null);


  const openModal = async (data) => {
    console.log(data)
    setSelectedToken(data.tokenAddress);
    if(data.token_info.price_info === undefined){
    setTokenData({
      mintSymbol: data.content.metadata.symbol,
      price: "Unknown",
      birdeyeLink: `https://birdeye.so/token/${data.tokenAddress}`,
      txs: data.txs
  })
    } else {
      setTokenData({
        mintSymbol: data.content.metadata.symbol,
        price: data.token_info.price_info.price_per_token,
        birdeyeLink: `https://birdeye.so/token/${data.tokenAddress}`,
        txs: data.txs
    })
    }
  };
  return (

        <div 
          key={stats.tokenAddress}
          className={`statistics-item ${stats.tag === "holding" ? "holding-net" : stats.tag === "Airdrop" ? "airdrop-net" : (stats.net >= 0 ? 'positive-net' : 'negative-net')}`}>
          <div className="token-details">
            <div onClick={() => openModal(stats)} className='update'>
              <img className='token-img' alt='token' src={stats.content.links.image} />
              <p className="token-name">{stats.content.metadata.symbol}</p>
            </div>
            <p>Buy: {stats.buy.toFixed(4)}</p>
            <p>Sell: {stats.sell.toFixed(4)}</p>
            <p>Net: {stats.net.toFixed(4)}</p>
          </div>
          <div className='statistics-buttons' >
            <div className='statistics-image-button' >
              <a href={"https://birdeye.so/token/"+stats.tokenAddress} target="_blank" ><img className='statistics-image'  src='/memes/birdeye.png' ></img></a>
              <a href={"https://t.me/bonkbot_bot?start=ref_yesil_ca_"+stats.tokenAddress} target="_blank" ><img className='statistics-image'  src='/memes/bonkbot.png' ></img></a>
            </div>
          </div>
          {selectedToken && tokenData && (
          <Modal isOpen={!!selectedToken} onClose={() => setSelectedToken(null)}>
          <div className='transaction-header'>
            <button className="close-button" onClick={() => setSelectedToken(null)}>X</button>
            <h3>{tokenData.mintSymbol} {tokenData.price}</h3>
            </div>
              {tokenData.txs.map((tx, index) => (
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
        </div>
      
  );
};

export default StatisticsItem;




