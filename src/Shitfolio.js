import React, { useState, useEffect, useRef } from 'react';
import './Shitfolio.css';
import Wallet from './Wallet'; 
import LoadingModal from './LoadingModal';

function Shitfolio() {
  const [transactionData, setTransactionData] = useState(null);
  const [walletAddress, setWalletAddress] = useState('');
  const walletRef = useRef(null); // Creating a reference for the wallet section
  const [isLoading, setIsLoading] = useState(false);

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
        "userAccount": `${walletAddress}`,
        "type": "TOKEN_SWAP",
        "limit": 500
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(payload)
        });

        const data = await response.json();
        const solTokenAddress = "So11111111111111111111111111111111111111112";
        const usdcAddress = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v";
        const usdtAddress = "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB";
        let totalSolChange = 0;
        let solDiffs = {};

        data.data.forEach(tx => {
            const sourceMint = tx.parsedInfo.sourceMint;
            const destinationMint = tx.parsedInfo.destinationMint;

            // Filter out USDC and USDT transactions
            if (sourceMint === usdcAddress || sourceMint === usdtAddress || destinationMint === usdcAddress || destinationMint === usdtAddress) {
                return;
            }

            const sourceAmount = tx.parsedInfo.sourceAmount / Math.pow(10, 9);
            const destinationAmount = tx.parsedInfo.destinationAmount / Math.pow(10, 9);
            const otherMint = sourceMint === solTokenAddress ? destinationMint : sourceMint;

            if (!solDiffs[otherMint]) {
                solDiffs[otherMint] = { buy: 0, sell: 0, net: 0 };
            }

            if (sourceMint === solTokenAddress) {
                // Buy transaction
                solDiffs[otherMint].buy += sourceAmount;
                solDiffs[otherMint].net -= sourceAmount; // Subtract from net as it's a purchase
            }

            if (destinationMint === solTokenAddress) {
                // Sell transaction
                solDiffs[otherMint].sell += destinationAmount;
                solDiffs[otherMint].net += destinationAmount; // Add to net as it's a sale
            }
        });
          // Calculating the total SOL change
          for (const token in solDiffs) {
            totalSolChange += solDiffs[token].net;
        }

        solDiffs['totalSolChange'] = totalSolChange;
        setTransactionData(solDiffs);
        console.log(solDiffs);
    } catch (error) {
        console.error('Error:', error);
    }
}


useEffect(() => {
  if (transactionData && walletRef.current) {
    walletRef.current.scrollIntoView({ behavior: 'smooth' });
  }
}, [transactionData]);

const fetchData = async () => {
  setIsLoading(true);
  await calculateSolDiff();
  setIsLoading(false);
};



  return (
    <div className="Shitfolio">
      {isLoading && <LoadingModal />}
      <header className="Shitfolio-header">
        <div className='Shitfolio-text' > 
          <h1>Memecoin Tracker: <b>Check your P&L</b> </h1>
          <p>Check your memecoin P&L easily with just a click.</p>
          <div className="input-group">
            <input
              type="text"
              placeholder="Enter your wallet address"
              value={walletAddress}
              onChange={(e) => setWalletAddress(e.target.value)}
            />
            <button onClick={fetchData} disabled={!walletAddress}>Fetch Data</button>
          </div>
          <span>- The Statistics data is based on your last 100 transactions. <br></br> - SOL Change is calculated with buys and sells.</span>
        </div>
        <img src="/cat-hero2.png" className="Shitfolio-logo" alt="logo" />
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
