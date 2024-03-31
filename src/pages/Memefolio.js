import React, { useState, useEffect, useRef } from 'react';
import '../design/Shitfolio.css';
import UserStatistics from './UserStatistics'; // Import the Statistics component
import LoadingModal from '../widgets/loadingModal';

/// TODO LONG TERM: USDC BUY + DCA 

/// USDC: https://api.coingecko.com/api/v3/coins/solana/market_chart/range?vs_currency=usd&from=1693226387&to=1711636787

/// TODO: How much would it be initial.

function Memefolio() {
  const [transactionsData, settransactionsData] = useState(null);
  const [walletData, setWalletData] = useState(null);
  const [walletAddress, setWalletAddress] = useState('');
  const walletRef = useRef(null); // Creating a reference for the wallet section
  const [isLoading, setIsLoading] = useState(false);



  function parseDateStringToDate(dateString) {
    // Split the string into date and time parts
    const [datePart] = dateString.split(' ');

    // Split the date part into day and month
    const [day, month] = datePart.split('.');

    // Create a new Date object with a fixed year and extracted day and month
    const dateTimeObject = new Date(2024, month - 1, day);

    return dateTimeObject;
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
        const usdcTokenAddress = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v";
        let solDiffs = {};
        let allTokens = []
        let totalSolChange = 0;
        let airdropsAmount = 0;
        let holdingsAmount = 0;
        let ruggedAmount = 0;

        
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
            allTokens.push(otherMint)
            if (sourceMint === solTokenAddress) {
                txType = 'buy';
                solChange = sourceAmount;
                solDiffs[otherMint].buy += solChange;
                solDiffs[otherMint].net -= solChange;
                totalSolChange -= solChange;
                solDiffs[otherMint].boughtTokenAmount ? solDiffs[otherMint].boughtTokenAmount=  solDiffs[otherMint].boughtTokenAmount + destinationAmount :  solDiffs[otherMint].boughtTokenAmount= destinationAmount
            } else if (destinationMint === solTokenAddress) {
                txType = 'sell';
                solChange = destinationAmount;
                solDiffs[otherMint].sell += solChange;
                solDiffs[otherMint].net += solChange;
                totalSolChange += solChange;
                solDiffs[otherMint].soldTokenAmount ? solDiffs[otherMint].soldTokenAmount=  solDiffs[otherMint].soldTokenAmount + sourceAmount :  solDiffs[otherMint].soldTokenAmount= sourceAmount
            } else {
                return;
            }

            const transaction = {
                blockTime: new Date(tx.blockTime * 1000).toLocaleString(),
                transactionId: "https://solscan.io/tx/" + tx.transactionId,
                type: txType,
                tokenChange: txType === 'sell' ? sourceAmount * -1 : destinationAmount,
                solChange: solChange
            };

            solDiffs[otherMint].txs.push(transaction);
        });

        for (const [token, details] of Object.entries(solDiffs)) {
          if (details.buy > 0 && details.sell === 0) {
              let isRugged = await rugCheck(token);
              if (isRugged) {
                  solDiffs[token].tag = "rugged";
                  ruggedAmount += details.net;  // Sum up the amount for rugged tokens
              } else {
                  solDiffs[token].tag = "holding";
                  holdingsAmount += details.net;  // Sum up the amount for holdings
              }
          } else if (details.buy === 0 && details.sell > 0) {
              solDiffs[token].tag = "Airdrop";
              airdropsAmount += details.net;  // Sum up the amount for airdrops
          } else if(details.boughtTokenAmount > details.soldTokenAmount) {
            solDiffs[token].tag = "Partially Holding";
          } else {
              solDiffs[token].tag = "sold";
          }
      }
      let allTokensUnique = [...new Set(allTokens)];
      let tokenMetadata = await fetchTokenMetadata(allTokensUnique);
      tokenMetadata.forEach(element => {

        solDiffs[element.id].token_info = element.token_info
        solDiffs[element.id].content = element.content

    });




    let firstTxDate = solDiffs[allTokensUnique[0]].txs[0].blockTime
    let lastTxDate = solDiffs[allTokensUnique[allTokensUnique.length -1]].txs[0].blockTime


    // Filter items based on tags to be excluded
    const excludedTags = ["airdrop", "rugged", "holding"];
    const filteredData = Object.fromEntries(
      Object.entries(solDiffs).filter(([key, value]) => !excludedTags.includes(value.tag))
  );

    // Sort tokens by net from filtered data
    const sortedTokens = Object.entries(filteredData).sort((a, b) => a[1].net - b[1].net);

    if (sortedTokens.length > 0) {
        // Get token with the smallest net
        const minNetToken = sortedTokens[0];
        // Get token with the biggest net
        const maxNetToken = sortedTokens[sortedTokens.length - 1];

        solDiffs['bestPlays'] = {
          "best": {
            "tokenId": maxNetToken[0],
            "name": maxNetToken[1]['token_info']['symbol'],
            "image": maxNetToken[1]['content']['links']['image'],
            "net": maxNetToken[1]['net'],
          },
          "worst": {
            "tokenId": minNetToken[0],
            "name": minNetToken[1]['token_info']['symbol'],
            "image": minNetToken[1]['content']['links']['image'],
            "net": minNetToken[1]['net'],
          }
        }
    }


      solDiffs['data'] = {
        "totalSolChange": totalSolChange,
        "airdropsAmount": airdropsAmount,
        "holdingsAmount": holdingsAmount,
        "ruggedAmount": ruggedAmount,
        "firstTxDate": firstTxDate,
        "lastTxDate": lastTxDate
      }
        settransactionsData(solDiffs);
        console.log(solDiffs)
    } catch (error) {
        console.error('Error:', error);
    }
}

async function rugCheck(tokenId) {
  const url = `https://price.jup.ag/v4/price?ids=${tokenId}&vsToken=So11111111111111111111111111111111111111112`;
  try {
      const response = await fetch(url);
      if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

              // Check if the data for the token is empty
              if (!data.data[tokenId] || Object.keys(data.data[tokenId]).length === 0) {
                return true
            } else {
              return false
            }
  } catch (error) {
      console.error("Error fetching token data:", error);
      throw error;
  }
}


async function fetchTokenMetadata(data) {

  const url = `https://mainnet.helius-rpc.com/?api-key=3a2302cb-b52f-4b1d-8029-5a622a2e20cc`;
  const headers = {
    "accept": "application/json",
    "content-type": "application/json",
};

  const payload = {
    "jsonrpc": "2.0",
    "id": "my-id",
    "method": "getAssetBatch",
    "params": {
      "ids": data
    }
  }
;
let result;
  await fetch(url, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(payload)
  }).then(response => response.json()) // Parse the JSON response
  .then(data => {
    // Access the result from the parsed JSON data
    result = data.result;
  
  })
  return result
}



async function fetchTokensWithNonZeroBalance() {
  const url = "https://rest-api.hellomoon.io/v0/rebase/my-token-balance";
  const headers = {
    "accept": "application/json",
    "content-type": "application/json",
    "authorization": "Bearer b37676d0-bb3b-471d-b0fb-31917a1d6593"
};

  const payload = { "ownerAccount": `${walletAddress}`};  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(payload)
  });
      const data = await response.json();

      let tokens = data.filter(token => token.amount !== "0");
      tokens = tokens.filter(token => token.amount !== "1");

      let walletData = {}
      tokens.forEach(element => {
        
        walletData[element.mint] = {
          "token_id": element.mint,
          "amount": element.amount
        }
    });
      let holdingTokens = tokens.map(item => item["mint"])
      let tokenMetadata = await fetchTokenMetadata(holdingTokens);
      tokenMetadata.forEach(element => {
        if(element.token_info.price_info !== undefined){
          walletData[element.id].token_id === "So11111111111111111111111111111111111111112" ? walletData[element.id].amount = walletData[element.id].amount / Math.pow(10, 9) : walletData[element.id].amount = walletData[element.id].amount / Math.pow(10, 6)
          walletData[element.id].symbol = element.content.metadata.symbol
          walletData[element.id].image = element.content.links.image
          walletData[element.id].holdingPrice = element.token_info.price_info.price_per_token * walletData[element.id].amount
          walletData[element.id].token_price = element.token_info.price_info.price_per_token
        }

    });


    setWalletData(walletData)
  } catch (error) {
      console.error('Error fetching tokens:', error);
      return [];
  }
}




useEffect(() => {
  if (walletData && walletRef.current) {
    walletRef.current.scrollIntoView({ behavior: 'smooth' });
  }
}, [walletData]);

const fetchData = async () => {
  setIsLoading(true);
  await fetchTokensWithNonZeroBalance();
  await calculateSolDiff();
  setIsLoading(false);
};



  return (
    <div className="Shitfolio">
      {isLoading && <LoadingModal />}
      <header className="Shitfolio-header">
        <div className='Shitfolio-text' > 
          <h1>memefolio</h1>
          <p>check your memecoin P&L easily with just a click.</p>
          <div className="input-group">
            <input
              type="text"
              placeholder="Wallet Address"
              value={walletAddress}
              onChange={(e) => setWalletAddress(e.target.value)}
            />
            <button onClick={fetchData} disabled={!walletAddress}>check if you're rekt</button>
          </div>
          <span>- sol change is calculated with buys and sells. <br></br> - especially developed for bonkbot users <br></br> - airdrops are tokens that are not swapped as buys. <br></br> - there might be errors since this is early alpha.</span>
        </div>
      </header>
        <div ref={walletRef}>
          {transactionsData && walletData ? (
            <UserStatistics walletAddress={walletAddress} walletData={walletData} transactionsData={transactionsData} />
          ) : ( null
          )}
        </div>
    </div>
  );
}

export default Memefolio;
