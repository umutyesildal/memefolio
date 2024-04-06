import React from 'react';
import '../design/Portfolio.css';


// Statistics Item is a single item in Statistics page that shows buy sell and anything.
const StatisticsItem = ({ stats }) => {

  return (

        <div
          key={stats.tokenAddress}
          className={`statistics-item ${stats.tag === "holding" ? "holding-net" : stats.tag === "Airdrop" ? "airdrop-net" : (stats.net >= 0 ? 'positive-net' : 'negative-net')}`}>
          <div className="token-details">
            <div className='update'>
              <img className='token-img' alt='token' src={stats.content.links.image} />
              <p className="token-name">{stats.content.metadata.symbol}</p>
            </div>
            <p>Buy: {stats.buy.toFixed(4)}</p>
            <p>Sell: {stats.sell.toFixed(4)}</p>
            <p>Net: {stats.net.toFixed(4)}</p>
          </div>
        </div>
      
  );
};

export default StatisticsItem;




