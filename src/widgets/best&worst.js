import React from 'react';
import '../design/BestWorst.css';
import StatisticsItem from './statisticsItem';


// Statistics Item is a single item in Statistics page that shows buy sell and anything.
const BestAndWorstPlays = ({ best, worst }) => {

  return (
    <div className='best-worst' >
        <h3>Best and Worst Plays</h3>
        <div className='best-worst-grid' >
          <StatisticsItem  stats={best[1]} />
          <StatisticsItem  stats={worst[1]} />
        </div>
    </div>
  );
};

export default BestAndWorstPlays;




