import React from 'react';
import './Portfolio.css';

const Portfolio = ({ walletData }) => {
  if (!walletData) return <div>Loading...</div>; // or handle the absence of walletData appropriately

  return (
    <div className="portfolio">
        <h2>Holdings</h2>
      <div className="portfolio-grid">
        {walletData.map((item, index) => (
          <div key={index} className="portfolio-item">
            <img src={item.info.image} alt={item.info.name} className="item-logo" />
              <div className="item-details">
                <p style={{margin: 0}} >{item.info.name}</p>
                <p style={{margin: 0}} className="bold">{item.info.symbol}</p>
                <p style={{margin: 0}} >{item.balance}</p>
              </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Portfolio;
