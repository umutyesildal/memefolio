import React, { useState } from 'react';
import StatisticsItem from './statisticsItem';
import '../design/WeeklyStats.css'; // Import the CSS file with updated styles

const WeeklyStatistics = ({ weeklyData }) => {
  // State to manage sorting criteria and order
  const [sortOption, setSortOption] = useState('net_desc'); // Default sorting option

  // Function to handle sorting based on the selected option
  const handleSortChange = (event) => {
    setSortOption(event.target.value);
  };

  // Function to sort data based on the selected option
  const sortedData = Object.values(weeklyData.data).sort((a, b) => {
    const [sortBy, sortOrder] = sortOption.split('_'); // Split the sortOption into criteria and order
    const multiplier = sortOrder === 'asc' ? 1 : -1;

    if (sortBy === 'net') {
      return multiplier * (a.net - b.net);
    } else if (sortBy === 'time') {
      const timeA = new Date(a.txs[0].blockTime).getTime();
      const timeB = new Date(b.txs[0].blockTime).getTime();
      return multiplier * (timeA - timeB);
    }
    return 0;
  });

  // Sorting options with labels
  const sortingOptions = [
    { value: 'net_desc', label: 'Best to Worst' },
    { value: 'net_asc', label: 'Worst to Best' },
    { value: 'time_desc', label: 'Newest' },
    { value: 'time_asc', label: 'Latest' },
  ];

  return (
    <div className='weekly-statistics'>
    <div className='weekly-sorting' >
    <h4>Between {weeklyData.startDate} - {weeklyData.endDate}</h4>
      <div className='sorting-dropdown'>
        {/* Styled dropdown for sorting */}
        <select
          value={sortOption}
          onChange={handleSortChange}
          className='custom-select' // Assign the custom-select class for styling
        >
          {sortingOptions.map((option) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      </div>
    </div>
      <div className='weekly-grid'>
        {/* Map over sortedData to render StatisticsItem components */}
        {sortedData.map((data, index) => (
          <StatisticsItem key={index} stats={data} />
        ))}
      </div>
    </div>
  );
};

export default WeeklyStatistics;









/*
    (weeklyData !== 'data') && (
        <div>
            <div className="statistics-grid">
                {Object.entries(weeklyData.data).map(([data]) => {
                    return ( 
                    <div
                    onClick={() => openModal(data.tokenAdress, data.tokenAdress)}
                    >
                    <StatisticsItem token={tokenAddress} stats={stats} />
                    </div>
                    );
                })}
            </div>

        {selectedToken && tokenData && (
          <Modal isOpen={!!selectedToken} onClose={() => setSelectedToken(null)}>
          <div className='transaction-header'>
            <button className="close-button" onClick={() => setSelectedToken(null)}>X</button>
            <h3>{tokenData.mintSymbol}</h3>
            <p>current price: {tokenData.price}</p>
            <a href={tokenData.birdeyeLink} target="_blank" >Check {tokenData.mintSymbol} birdeye</a>
            </div>
              {transactionsData[selectedToken].txs.map((tx, index) => (
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
      )
      

*/