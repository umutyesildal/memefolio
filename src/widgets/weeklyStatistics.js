import React, { useState } from 'react';
import StatisticsItem from './statisticsItem';
import '../design/WeeklyStats.css';
import Modal from './modal'

const WeeklyStatistics = ({ weeklyData }) => {
  const [selectedToken, setSelectedToken] = useState(null);
  const [tokenData, setTokenData] = useState(null);


  const openModal = async (data) => {
    console.log(data)
    setSelectedToken(data.tokenAddress);
    if(data.token_info.price_info === undefined){
    setTokenData({
      mintSymbol: data.content.metadata.symbol,
      price: "Unknown",
      birdeyeLink: `https://birdeye.so/token/${data.tokenAddress}`,
      txs: data.txs
  })
    }
    setTokenData({
      mintSymbol: data.content.metadata.symbol,
      price: data.token_info.price_info.price_per_token,
      birdeyeLink: `https://birdeye.so/token/${data.tokenAddress}`,
      txs: data.txs
  })

  };
  // State to manage sorting criteria and order
  const [sortOption, setSortOption] = useState('time_desc'); // Default sorting option

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
        {sortedData.map((data, index) => (
          <div onClick={() => openModal(data)}>
          <StatisticsItem key={index} stats={data} />
          </div>
        ))}
      </div>
      {selectedToken && tokenData && (
          <Modal isOpen={!!selectedToken} onClose={() => setSelectedToken(null)}>
          <div className='transaction-header'>
            <button className="close-button" onClick={() => setSelectedToken(null)}>X</button>
            <h3>{tokenData.mintSymbol}</h3>
            <p>current price: {tokenData.price}</p>
            <a href={tokenData.birdeyeLink} target="_blank" >Check {tokenData.mintSymbol} birdeye</a>
            </div>
              {tokenData.txs.map((tx, index) => (
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
  );
};

export default WeeklyStatistics;