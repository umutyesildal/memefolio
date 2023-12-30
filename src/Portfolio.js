import React from 'react';
import './Portfolio.css';

const Portfolio = ({ data }) => {
  if (!data || !data.items) return <div>Loading...</div>; // or handle the absence of data appropriately

  return (
    <div className="portfolio">
      <div className="wallet-info">
        <h2>{data.wallet}</h2>
        <h3>${data.totalUsd ? data.totalUsd.toFixed(2) : '0.00'}</h3>
      </div>
      <div className="portfolio-grid">
        {data.items.map((item, index) => (
          <div key={index} className="portfolio-item">
            <img src={item.logoURI} alt={item.name} className="item-logo" />
            <div className="item-details">
              <p>{item.name}</p>
              <p className="bold">{item.symbol}</p>
              <p>{item.uiAmount}</p>
              <p className="bold">${item.valueUsd ? item.valueUsd.toFixed(2) : '0.00'}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Portfolio;
