import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import Wallet from './Wallet'; 
import LoadingAnimation from './LoadingAnimation'; 

function App() {
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
        'X-API-KEY': '755089198a7140aa9f5bf0dd9ba84c18',
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
      let totalSOLChange = 0;
    
      transactions.forEach(tx => {
        let solChange = 0;
        let tokenData = {};
    
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
    
        if (tokenData.symbol) {
          const tokenName = tokenData.symbol;
    
          if (!solPerformance[tokenName]) {
            solPerformance[tokenName] = { buys: 0, sells: 0, net: 0, logoURI: tokenData.logoURI };
          }
    
          // Convert SOL change to actual value (truncate to 3 decimal places)
          const convertedSolChange = Math.floor(solChange / Math.pow(10, 9 - 3)) / 1000;
    
          if (solChange < 0) {
            solPerformance[tokenName].buys += Math.abs(convertedSolChange);
          } else if (solChange > 0) {
            solPerformance[tokenName].sells += convertedSolChange;
          }
    
          solPerformance[tokenName].net += convertedSolChange;
          totalSOLChange += convertedSolChange;
        }
      });

      console.log({ performance: solPerformance, totalSOLChange })
    
      return { performance: solPerformance, totalSOLChange };
    }
    
    

  useEffect(() => {
    if (portfolioData && walletRef.current) {
      walletRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [portfolioData]);

  const fetchData = async () => {
    setIsLoading(true);
    await fetchTransactionData();
    await fetchPortfolioData();
    setIsLoading(false);
  };



  return (
    <div className="App">
      <header className="App-header">
        <img src="/shitfolio.png" className="App-logo" alt="logo" />
        <p>Welcome to my Shitfolio! You can track your gains or losses here.</p>
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
      {isLoading ? (
        <LoadingAnimation /> // Display loading animation while data is being fetched
      ) : (
        <main ref={walletRef}>
          {portfolioData && transactionData ? (
            <Wallet data={portfolioData} transactionData={transactionData} />
          ) : (
            <p>No data loaded</p>
          )}
        </main>
              )}

    </div>
    
  );
}

export default App;
