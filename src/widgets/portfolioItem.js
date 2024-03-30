import React from 'react';
import '../design/Portfolio.css';

const PortfolioItem = ({ index, item }) => {

  return (
    <a href={"https://birdeye.so/token/" + item.token_id} target="_blank" >
    <div key={index} className="portfolio-item">
    <div className="item-details">
    <img className='token-img' alt='token' src={item.image === undefined ? "https://solana.com/_next/static/media/solanaLogoMark.17260911.svg" : item.image} />
      <p style={{ margin: 0, fontWeight: "bold" }}>{item.symbol}</p>
      <p style={{ margin: 0 }}>{parseFloat(item.holdingPrice).toFixed(2) + "$"}</p>
      <p style={{ margin: 0 }}>{parseFloat(item.token_price) + "$"}</p>
      <p style={{ margin: 0 }}>{parseFloat(item.amount)}</p>

    </div>
  </div>
  </a>
  );
};

export default PortfolioItem;
