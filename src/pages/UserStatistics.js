import React, { useState } from 'react';
import '../design/Statistics.css';
import UserPortfolio from './UserPortfolio';
import Highlights from '../widgets/highlights';
import BestAndWorstPlays from '../widgets/best&worst';
import WeeklyStatistics from '../widgets/weeklyStatistics';

/// TODO: Change Transactions page

const UserStatistics = ({walletAddress,transactionsData,generalData }) => {

  const [activeTab,setActiveTab] = useState('tab1');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'tab1':
        return      <div className='all-statistics' >      
        <Highlights generalData={generalData}/>
        <BestAndWorstPlays best={generalData.bestAndWorst.best} worst={generalData.bestAndWorst.worst} />
        <div className="statistics-grid">
        {transactionsData.map((week, index) => (
          <WeeklyStatistics weeklyData={week} index={index}/>
        ))}
        </div>
      </div>;
      case 'tab2':
        return<UserPortfolio walletAddress={walletAddress}  
      //  walletData={walletData}
         /> 
      default:
        return     <div className='all-statistics' >      
        <Highlights transactionsData={generalData }/>
        <BestAndWorstPlays best={generalData.bestAndWorst.best} worst={generalData.bestAndWorst.worst} />
        <div className="statistics-grid">
        {transactionsData.map((week, index) => (
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
      <h1 >{"between " + generalData.lastTxDate.substring(0,10)+  " - " + generalData.firstTxDate.substring(0,10)}</h1> 
      <h2  >{walletAddress}</h2> 
      {renderTabContent()}
    </div>
  );
};

export default UserStatistics;


/*

*/