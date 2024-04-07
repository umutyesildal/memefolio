import React, { useState } from 'react';
import StatisticsItem from './statisticsItem';
import '../design/WeeklyStats.css';

const WeeklyStatistics = ({ weeklyData }) => {

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
    { value: 'time_desc', label: 'Earliest' },
    { value: 'time_asc', label: 'Oldest' },
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
          <StatisticsItem key={index} stats={data} />
        ))}
      </div>

    </div>
  );
};

export default WeeklyStatistics;