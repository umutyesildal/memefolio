import React from 'react';
import '../design/Statistics.css';

const Highlights = ({transactionsData}) => {

  return (
    <div className="highlights">
        <HighlightsItem title={"total sol change"} data={transactionsData['data']['totalSolChange'].toFixed(4)} type={"total"}  />
        <HighlightsItem title={"holding"} data={transactionsData['data']['holdingsAmount'].toFixed(4) * -1} type={"holding"}  />
        <HighlightsItem title={"rugged"} data={transactionsData['data']['ruggedAmount'].toFixed(4)} type={"rugged"}  />
        <HighlightsItem title={"airdrop"} data={transactionsData['data']['airdropsAmount'].toFixed(4)} type={"airdrop"}  />
  </div>
  );
};


const HighlightsItem = ({ title ,data, type }) => {

  let style;

  if(type === "total"){
     data > 0 ? style = {
      background: "linear-gradient(143deg, #14181b 35%, #376338)"
    } : style = {
      background: "linear-gradient(143deg, #14181b 35%, #633737)"
    }
  } else if(type === "holding"){
     style =  {
      background: "linear-gradient(143deg, #14181b 35%, #4c3763)"
    }
  }else if(type === "rugged"){
     style =  {
      background: "linear-gradient(143deg, #14181b 35%, #633737)"
    }
  }else {
     style =  {
      background: "linear-gradient(143deg, #14181b 35%, #374e63)"

    }}

  return (
    <div style={style} className='highlights-item'><h2>{title} <br/><br/> {data} sol</h2></div>
  );
};




export default Highlights;

/*

        <div className='highlights-item'><h2>best play <br/><br/> {transactionsData['bestPlays']['best']['net'].toFixed(2)} sol</h2></div>
        <div className='highlights-item'><h2>worst play <br/><br/> {transactionsData['bestPlays']['worst']['net'].toFixed(2)} sol</h2></div>
*/