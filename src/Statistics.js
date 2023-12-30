import React from 'react';
import './Statistics.css';

const Statistics = ({ data }) => {
  if (!data || !data.performance) {
    return <div>Loading data...</div>;
  }

  const { performance, totalSOLChange } = data;

  let bestPlayToken = '';
  let worstPlayToken = '';

  // Find the best and worst plays
  Object.entries(performance).forEach(([token, stats]) => {
    if (stats.tag === 'Best Play' && !bestPlayToken) {
      bestPlayToken = token;
    } else if (stats.tag === 'Worst Play' && !worstPlayToken) {
      worstPlayToken = token;
    }
  });

  // Sort performances to put best and worst plays at the top
  const sortedPerformances = [];
  if (bestPlayToken) sortedPerformances.push([bestPlayToken, performance[bestPlayToken]]);
  if (worstPlayToken) sortedPerformances.push([worstPlayToken, performance[worstPlayToken]]);

  Object.entries(performance).forEach(([token, stats]) => {
    if (token !== bestPlayToken && token !== worstPlayToken) {
      sortedPerformances.push([token, stats]);
    }
  });
  return (
    <div>
        <div className="total-sol-change">
        <h2>Total SOL Change: {totalSOLChange.toFixed(3)}</h2>
      </div>
      <div className="statistics-grid">
        {sortedPerformances.map(([token, stats]) => (
          <div 
            key={token} 
            className={`statistics-item ${stats.net >= 0 ? 'positive-net' : 'negative-net'} 
              ${stats.tag === 'Best Play' ? 'best-play' : ''} 
              ${stats.tag === 'Worst Play' ? 'worst-play' : ''}`}
          >
            <div className="item-details">
              <p className="token-name">{token} {stats.tag ? `(${stats.tag})` : ''}</p>
              <p>Buys: {stats.buys.toFixed(3)}</p>
              <p>Sells: {stats.sells.toFixed(3)}</p>
              <p>Net: {stats.net.toFixed(3)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Statistics;
