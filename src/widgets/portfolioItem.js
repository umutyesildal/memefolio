import React from 'react';
import '../design/Portfolio.css';

const PortfolioItem = ({ index, item }) => {

  return (
    <div key={index} className="portfolio-item">
    <div className="item-details">
      <div className='image-header'>
        <img className='token-img' alt='token' src={item.image === undefined ? "https://solana.com/_next/static/media/solanaLogoMark.17260911.svg" : item.image} />
        <h4 style={{ margin: 0, fontWeight: "bold" }}>{item.symbol}</h4>
      </div>
      <div className="item-data-grid" >
        <p style={{ margin: 0 }}>{"Price:"}</p>
        <p style={{ margin: 0 }}>{parseFloat(item.token_price).toFixed(6) + "$" }</p>
        <p style={{ margin: 0 }}>{"Amount:"}</p>
        <p style={{ margin: 0 }}>{parseFloat(item.amount).toFixed(2)}</p>
        <p style={{ margin: 0 }}>{"Estimated Value:"}</p>
        <p style={{ margin: 0, fontWeight: "bold"  }}>{parseFloat(item.holdingPrice).toFixed(2) + "$"}</p>

      </div>
      <div className='portfolio-button-group' >
        <a href={"https://t.me/bonkbot_bot?start=ref_yesil_ca_"+item.token_id} target="_blank" > <button className='bonkbot-button' >Trade now  <img className='bonkbot-image'  src='/memes/bonkbot.png' ></img></button> </a>
        <a href={"https://birdeye.so/token/"+item.token_id} target="_blank" > <button className='bonkbot-button' >Check chart <img className='bonkbot-image'  src='/memes/birdeye.png' ></img></button> </a>
      </div>
    </div>
  </div>
  );
};

export default PortfolioItem;
