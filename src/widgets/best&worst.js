import React from 'react';
import '../design/BestWorst.css';


// Statistics Item is a single item in Statistics page that shows buy sell and anything.
const BestAndWorstPlays = ({ best, worst }) => {

  return (
    <div className='best-worst' >
        <h3>Best and Worst Plays</h3>
        <div className='bw-grid' >
            <div key={best[0]} className={`best-item`}>
              <div className="bw-token-details">
                  <img className='bw-token-img' alt='token' src={best[1].content.links.image} />
                  <p className="token-header">{best[1].content.metadata.symbol}</p>
                </div>
                <div className='bw-token-statistics' >
                  <p className="bw-token-statistics-item">Buy: <br/>{best[1].buy.toFixed(4)}</p>
                  <p className="bw-token-statistics-item">Sell:<br/> {best[1].sell.toFixed(4)}</p>
                  <p className="bw-token-statistics-item">Net: <br/>{best[1].net.toFixed(4)}</p>
                </div>

            </div>
            <div key={worst[0]} className={`worst-item`}>
              <div className="bw-token-details">
                <img className='bw-token-img' alt='token' src={worst[1].content.links.image} />
                <p className="token-header">{worst[1].content.metadata.symbol}</p>
              </div>
              <div className='bw-token-statistics'>

                <p className="bw-token-statistics-item">Buy: <br/>{worst[1].buy.toFixed(4)}</p>
                <p className="bw-token-statistics-item">Sell: <br/>{worst[1].sell.toFixed(4)}</p>
                <p className="bw-token-statistics-item">Net: <br/>{worst[1].net.toFixed(4)}</p>
                </div>

            </div>
        </div>
    </div>
  );
};

export default BestAndWorstPlays;




