import React, { useState } from 'react';
import '../design/Statistics.css';
import UserPortfolio from './UserPortfolio';
import Highlights from '../widgets/highlights';
import BestAndWorstPlays from '../widgets/best&worst';
import WeeklyStatistics from '../widgets/weeklyStatistics';

/// TODO: Change Transactions page

const UserStatistics = ({walletAddress, walletData,transactionsData, weeklyData }) => {

  console.log(transactionsData)

  const [activeTab,setActiveTab] = useState('tab1');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'tab1':
        return      <div className='all-statistics' >      
        <Highlights transactionsData={transactionsData }/>
        <BestAndWorstPlays best={transactionsData['bestPlays']['best']} worst={transactionsData['bestPlays']['worst']} />
        <div className="statistics-grid">
        {weeklyData.map((week, index) => (
          <WeeklyStatistics weeklyData={week} index={index}/>
        ))}
        </div>
      </div>;
      case 'tab2':
        return<UserPortfolio walletAddress={walletAddress}  walletData={walletData} /> // Assuming you're using the Holders component for tab 2
      default:
        return     <div className='all-statistics' >      
        <Highlights transactionsData={transactionsData }/>
        <BestAndWorstPlays best={transactionsData['bestPlays']['best']} worst={transactionsData['bestPlays']['worst']} />
        <div className="statistics-grid">
        {weeklyData.map((week, index) => (
          <WeeklyStatistics weeklyData={week} index={index}/>
        ))}
        </div>
      </div>;
    }
  };
  
  return (
    <div id="statistics" className='all-statistics' >
      <div className="statistics-bar">
        <button onClick={() => setActiveTab('tab1')} className={activeTab === 'tab1' ? 'active' : ''}>
          transactions
        </button>
        <button onClick={() => setActiveTab('tab2')} className={activeTab === 'tab2' ? 'active' : ''}>
          holdings
        </button>
      </div>
      <h1 >{"between " + transactionsData['data'].lastTxDate.substring(0,5)+  " - " + transactionsData['data'].firstTxDate.substring(0,5)}</h1> 
      <h2  >{walletAddress}</h2> 
      {renderTabContent()}
    </div>
  );
};

export default UserStatistics;


/*

*/