import React from 'react';
import '../design/Portfolio.css';
import PortfolioItem from '../widgets/portfolioItem';

const UserPortfolio = ({ walletAddress, walletData }) => {
  if (!walletData) return <div>Loading...</div>; // or handle the absence of walletData appropriately

  return (
    <div className="portfolio">
      <div className="portfolio-grid">
      {Object.entries(walletData).map(([item, index]) => {
        if(walletData[item].holdingPrice !== undefined)
          return ( 
            <PortfolioItem item={walletData[item]} index={index} />
          );
        })}
      </div>
    </div>
  );
};

export default UserPortfolio;
