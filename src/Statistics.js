import React from 'react';
import './Statistics.css';

const Statistics = ({ data }) => {
  if (!data || !data.performance) {
    return <div>Loading data...</div>; // or handle the absence of data appropriately
  }

  const { performance, totalSOLChange } = data;

  return (
    <div>
      <div className="total-sol-change">
        <h2>Total SOL Change: {totalSOLChange ? totalSOLChange.toFixed(3) : 'N/A'}</h2>
      </div>
      <div className="statistics-grid">
        {Object.entries(performance).map(([token, stats]) => (
          <div 
            key={token} 
            className={`statistics-item ${stats.net >= 0 ? 'positive-net' : 'negative-net'}`}
          >
            <div className="item-details">
              <p className="token-name">{token}</p>
              <p>Buys: {stats.buys ? stats.buys.toFixed(3) : '0.000'}</p>
              <p>Sells: {stats.sells ? stats.sells.toFixed(3) : '0.000'}</p>
              <p>Net: {stats.net ? stats.net.toFixed(3) : '0.000'}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Statistics;
