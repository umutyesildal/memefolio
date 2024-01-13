import React, { useState, useEffect, useRef } from 'react';
import './Shitfolio.css';
import Wallet from './Wallet'; 
import LoadingModal from './LoadingModal';

function Shitfolio() {
  const [portfolioData, setPortfolioData] = useState(null);
  const [transactionData, setTransactionData] = useState(null);
  const [walletAddress, setWalletAddress] = useState('');
  const walletRef = useRef(null); // Creating a reference for the wallet section
  const [isLoading, setIsLoading] = useState(false);


  // Function to fetch portfolio data from the API
  const fetchPortfolioData = async () => {
    if (!walletAddress.match(/^[1-9A-HJ-NP-Za-km-z]{32,44}$/)) {
      alert('Invalid wallet address format.');
      return;
    }

    const apiUrl = `https://public-api.birdeye.so/v1/wallet/token_list?wallet=${walletAddress}`;
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'X-API-KEY': 'd6bf1f9fb4334ddfb1504a0c70f41733',
        'x-chain': 'solana'
      }
    });


    if (response.ok) {
      const jsonResponse = await response.json();
      if (jsonResponse.success) {
        const filteredItems = jsonResponse.data.items.filter(item => item.valueUsd != null);
        jsonResponse.data.items = filteredItems;
        console.log(jsonResponse.data)
        setPortfolioData(jsonResponse.data);
      } else {
        console.error('API responded with success: false');
      }
    } else {
      console.error('HTTP error: ', response.status);
    }
    
  };

    // Function to fetch transaction data from the API
    const fetchTransactionData = async () => {
      if (!walletAddress.match(/^[1-9A-HJ-NP-Za-km-z]{32,44}$/)) {
        alert('Invalid wallet address format.');
        return;
      }
      const apiUrl = `https://public-api.birdeye.so/v1/wallet/tx_list?wallet=${walletAddress}`;

      try {
        const response = await fetch(apiUrl, {
          method: 'GET',
          headers: {
            'X-API-KEY': '755089198a7140aa9f5bf0dd9ba84c18',
            'x-chain': 'solana'
          }
        });
  
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
  
        const data = await response.json();
        if (data.success) {
          setTransactionData(calculateSOLPerformance(data.data.solana));
        } else {
          console.error('API responded with success: false');
        }
      } catch (error) {
        console.error('Error fetching transaction data: ', error.message);
      }
    };


    function calculateSOLPerformance(transactions) {
      const solPerformance = {};
      const solPerformanceByDate = {};
    
      transactions.forEach(tx => {
        let solChange = 0;
        let tokenData = {};
        const txDate = tx.blockTime.split('T')[0];
    
        tx.balanceChange.forEach(change => {
          if (change.symbol === "SOL") {
            solChange = change.amount;
          } else {
            tokenData = {
              symbol: change.symbol,
              logoURI: change.logoURI
            };
          }
        });
    
        if (tokenData.symbol && !tokenData.symbol.startsWith("USD") && !tokenData.symbol.startsWith("WSOL")) {
          const tokenName = tokenData.symbol;
    
          if (!solPerformance[tokenName]) {
            solPerformance[tokenName] = { buys: 0, sells: 0, net: 0, logoURI: tokenData.logoURI };
          }
    
          const convertedSolChange = Math.floor(solChange / Math.pow(10, 9 - 3)) / 1000;
    
          if (solChange < 0) {
            solPerformance[tokenName].buys += Math.abs(convertedSolChange);
          } else if (solChange > 0) {
            solPerformance[tokenName].sells += convertedSolChange;
          }
    
          solPerformance[tokenName].net += convertedSolChange;
    
          // Grouping by date
          if (!solPerformanceByDate[txDate]) {
            solPerformanceByDate[txDate] = [];
          }
          solPerformanceByDate[txDate].push({ tokenName, data: solPerformance[tokenName] });
        }
      });
    
      // Sort within each date by net
      Object.keys(solPerformanceByDate).forEach(date => {
        solPerformanceByDate[date].sort((a, b) => b.data.net - a.data.net);
      });
    
      // Additional existing logic for overall sorting and tagging
      // Filter out tokens with only buys and no sells
      Object.keys(solPerformance).forEach(token => {
        if (solPerformance[token].sells === 0 && solPerformance[token].buys > 0) {
          delete solPerformance[token];
        }
      });
      
      const sortedTokens = Object.entries(solPerformance)
      .sort((a, b) => b[1].net - a[1].net);
    
      if (sortedTokens.length > 1) {
        const bestPlay = sortedTokens[0][0];
        const worstPlay = sortedTokens[sortedTokens.length - 1][0];
        solPerformance[bestPlay].tag = 'Best Play';
        solPerformance[worstPlay].tag = 'Worst Play';
      }
      
      let totalSOLChange = Object.values(solPerformance).reduce((acc, token) => acc + token.net, 0);
    
      console.log({ performance: solPerformance, totalSOLChange, solPerformanceByDate });
    
      return { performance: solPerformance, totalSOLChange, solPerformanceByDate };
    }

    async function calculateSolDiff() {
      const url = "https://rest-api.hellomoon.io/v0/solana/txns-by-user";
      const headers = {
          'accept': 'application/json',
          'authorization': 'Bearer b37676d0-bb3b-471d-b0fb-31917a1d6593',
          'content-type': 'application/json'
      };
  
      const payload = {
          "blockTime": {
              "operator": "between",
              "greaterThan": 0,
              "lessThan": 100000000000000
          },
          "userAccount": "GHp1YtXxwwPEcijzYod8RkZ1o3HgFaLtETWu6RUvKUmG",
          "type": "TOKEN_SWAP",
          "limit": 250
      };
  
      try {
          const response = await fetch(url, {
              method: 'POST',
              headers: headers,
              body: JSON.stringify(payload)
          });
  
          const data = await response.json();
          const solTokenAddress = "So11111111111111111111111111111111111111112";
          let solDiffs = {};
          let totalSolChange = 0;
  
          data.data.forEach(tx => {
              const sourceMint = tx.parsedInfo.sourceMint;
              const destinationMint = tx.parsedInfo.destinationMint;
              const sourceAmount = tx.parsedInfo.sourceAmount / Math.pow(10, 9);
              const destinationAmount = tx.parsedInfo.destinationAmount / Math.pow(10, 9);
  
              if (sourceMint !== solTokenAddress) {
                  solDiffs[sourceMint] = (solDiffs[sourceMint] || 0) + destinationAmount;
                  totalSolChange += destinationAmount;
              }
              if (destinationMint !== solTokenAddress) {
                  solDiffs[destinationMint] = (solDiffs[destinationMint] || 0) - sourceAmount;
                  totalSolChange -= sourceAmount;
              }
          });
  
          solDiffs['totalSolChange'] = totalSolChange;
          setTransactionData(solDiffs)
          console.log(solDiffs)
      } catch (error) {
          console.error('Error:', error);
      }
  }
  
  
    
    

  useEffect(() => {
    if (portfolioData && walletRef.current) {
      walletRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [portfolioData]);

  const fetchData = async () => {
    setIsLoading(true);
    await calculateSolDiff();
    setIsLoading(false);
  };



  return (
    <div className="Shitfolio">
      {isLoading && <LoadingModal />}
      <header className="Shitfolio-header">
        <h1>SHITFOLIO</h1>
        <img src="/shitfolio.png" className="Shitfolio-logo" alt="logo" />
        <p>Ever wondered how you did with your shitcoin gambles? <br></br></p>
        <p style={{fontSize: "1vw"}} >The Statistics data is based on your last 100 transactions. <br></br> SOL Change is calculated with buys and sells, if you interacted with them differently it might be incorrect.</p>
        <a style={{fontSize: "1vw", color: "white", paddingBottom: "1vw"}}  href='https:/twitter.com/yesilNFT'> A project by @YesilNFT </a>
        <p style={{fontSize: "1vw", color:"yellow"}} >If you like and want to support me, send me any shitcoin you got 5pX257UPd2My1As288AFagAmxMyb5jHsywnoTerABc41</p>
        
        <div className="input-group">
          <input
            type="text"
            placeholder="Enter your wallet address"
            value={walletAddress}
            onChange={(e) => setWalletAddress(e.target.value)}
          />
          <button onClick={fetchData} disabled={!walletAddress}>Fetch Data</button>
        </div>
      </header>
      
        <main ref={walletRef}>
          {transactionData ? (
            <Wallet transactionData={transactionData} />
          ) : ( null
          )}
        </main>

    </div>
    
  );
}

export default Shitfolio;
