import React, { useState, useEffect, useRef } from 'react';
import './Shitfolio.css';
import Wallet from './Wallet'; 
import LoadingModal from './LoadingModal';

function Shitfolio() {
  const [transactionsData, settransactionsData] = useState(null);
  const [walletData, setWalletData] = useState(null);
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
        let solDiffs = {};
        let totalSolChange = 0;
        let holdings = 0;

        data.data.forEach(tx => {
            const sourceMint = tx.parsedInfo.sourceMint;
            const destinationMint = tx.parsedInfo.destinationMint;
            const sourceAmount = tx.parsedInfo.sourceAmount / Math.pow(10, 9);
            const destinationAmount = tx.parsedInfo.destinationAmount / Math.pow(10, 9);
            const otherMint = sourceMint === solTokenAddress ? destinationMint : sourceMint;

            if (!solDiffs[otherMint]) {
                solDiffs[otherMint] = { buy: 0, sell: 0, net: 0, txs: [], tag: "" };
            }

            let txType;
            let solChange;

            if (sourceMint === solTokenAddress) {
                txType = 'buy';
                solChange = sourceAmount;
                solDiffs[otherMint].buy += solChange;
                solDiffs[otherMint].net -= solChange;
                if (solDiffs[otherMint].sell === 0) {
                    holdings += solChange;
                } else {
                    totalSolChange -= solChange;
                }
            } else if (destinationMint === solTokenAddress) {
                txType = 'sell';
                solChange = destinationAmount;
                solDiffs[otherMint].sell += solChange;
                solDiffs[otherMint].net += solChange;
                totalSolChange += solChange;
            } else {
                return;
            }

            const transaction = {
                blockTime: new Date(tx.blockTime * 1000).toLocaleString(),
                transactionId: "https://solscan.io/tx/" + tx.transactionId,
                type: txType,
                solChange: solChange
            };

            solDiffs[otherMint].txs.push(transaction);
        });

        for (const [token, { buy, sell }] of Object.entries(solDiffs)) {
            if (buy > 0 && sell === 0) {
                solDiffs[token].tag = "holding";
            } else {
              solDiffs[token].tag = "sold";
            }
        }

        solDiffs['totalSolChange'] = totalSolChange;
        solDiffs['holdings'] = holdings;
        settransactionsData(solDiffs);
    } catch (error) {
        console.error('Error:', error);
    }
}

async function fetchTokensWithNonZeroBalance() {
  const url = "https://rest-api.hellomoon.io/v0/rebase/my-token-balance";
  const headers = {
    "accept": "application/json",
    "content-type": "application/json",
    "authorization": "Bearer b37676d0-bb3b-471d-b0fb-31917a1d6593"
};

  const payload = { "ownerAccount": "GHp1YtXxwwPEcijzYod8RkZ1o3HgFaLtETWu6RUvKUmG" };  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(payload)
  });
      const data = await response.json();

      const tokens = data.filter(token => token.amount !== "0");
      setWalletData(tokens)
  } catch (error) {
      console.error('Error fetching tokens:', error);
      return [];
  }
}




useEffect(() => {
  if (transactionsData && walletRef.current) {
    walletRef.current.scrollIntoView({ behavior: 'smooth' });
  }
}, [transactionsData]);

const fetchData = async () => {
  setIsLoading(true);
  await calculateSolDiff();
  await fetchTokensWithNonZeroBalance();
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
        <div ref={walletRef}>
          {transactionsData && walletData ? (
            <Wallet walletData={walletData} transactionsData={transactionsData} />
          ) : ( null
          )}
        </div>
    </div>
  );
}

export default Shitfolio;
