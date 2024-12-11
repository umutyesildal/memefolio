import React, { useState,useEffect } from 'react';

const AlphaFinder = () => {
  const [ownersData, setOwnersData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [tokenAddress, setTokenAddress] = useState('');
  const [tokenData, setTokenData] = useState(null);
  const [isPressed, setIsPressed] = useState(false);
  const [isValidAddress, setisValidAddress] = useState(false);
  const [buttonText, setButtonText] = useState("enter a valid address");
  const [buttonLogic, setButtonLogic] = useState(false);
  // Function to fetch data and extract owners
  const fetchDataAndExtractOwners = async () => {
    setIsLoading(true);

    const url = `https://public-api.birdeye.so/defi/history_price?address=${tokenAddress}&address_type=token&type=1m&time_from=1705316127&time_to=1716327127`; // Replace with your API URL
    const headers = {
      "Content-Type": "application/json",
      "x-chain": "solana",
      "X-API-KEY": "d6bf1f9fb4334ddfb1504a0c70f41733"
    };

    const getRequest = async (data) => {
      const response = await fetch(url, {
        method: 'GET',
        headers: headers,
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      return await response.json();
    };

    const tokenPriceData = await getRequest();

      // Function to compare each item with the next one and log the unixTime if the value increase is more than 50%
      function findSignificantIncreases(items) {
        let significantIncreases = [];
    
        for (let i = 0; i < items.length - 1; i++) {
            const currentItem = items[i];
            const nextItem = items[i + 1];
            const increase = ((nextItem.value - currentItem.value) / currentItem.value) * 100;
    
            if (increase > 50) {
                significantIncreases.push(currentItem.unixTime);
            }
        }
    
        return significantIncreases;
    }

  // Execute the function with your items
  const increasedTimes = findSignificantIncreases(tokenPriceData.data.items);

  console.log(increasedTimes)
  let helius = `https://api.helius.xyz/v0/addresses/3psH1Mj1f7yUfaD5gh6Zj7epE8hhrMkMETgv5TshQA4o/transactions?api-key=3a2302cb-b52f-4b1d-8029-5a622a2e20cc`;
  let lastSignature = null;
  
  const fetchAndParseTransactions = async () => {
    while (true) {
      if (lastSignature) {
        helius += `&before=${lastSignature}`;
      }
      const response = await fetch(helius);
      const transactions = await response.json();
  
      if (transactions && transactions.length > 0) {
        console.log("Fetched transactions: ", transactions);
        lastSignature = transactions[transactions.length - 1].signature;
      } else {
        console.log("No more transactions available.");
        break;
      }
    }
  };
  fetchAndParseTransactions();


    let tokenMetadata = await fetchTokenMetadata()

    let token = {
      metadata: tokenMetadata.content.metadata ? tokenMetadata.content.metadata : {
        "description": "Unknown Token",
        "name": "Unknown Token",
        "symbol": "UNK",
    },
      image: tokenMetadata.content.links.image ? tokenMetadata.content.links.image : "https://cdn.pixabay.com/photo/2017/08/30/01/05/milky-way-2695569_960_720.jpg"
    }
    setTokenData(token)
    console.log(token)


  try {

  } catch (error) {
    console.error('Error fetching and processing data: ', error);
  } finally {
    setIsLoading(false); // Ensure loading state is updated even if an error occurs
  }
    setIsPressed(true)
    setIsLoading(false);
  };


  async function fetchTokenMetadata() {

    const url = `https://mainnet.helius-rpc.com/?api-key=3a2302cb-b52f-4b1d-8029-5a622a2e20cc`;
    const headers = {
      "accept": "application/json",
      "content-type": "application/json",
  };
  
    const payload = {
      "jsonrpc": "2.0",
      "id": "my-id",
      "method": "getAsset",
      "params": {
        "id": tokenAddress
      }
    }
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


  function isValidSolanaAddress() {
    // Regular expression for Solana address
    const solregex = /(^[1-9A-HJ-NP-Za-km-z]{32,44}$)/g 
    const check = solregex.test(tokenAddress)
    console.log("Checked for " + tokenAddress + " Result is " + check)
    setisValidAddress(check)
  }


function buttonChecker() {

  if(isValidAddress){
    setButtonText("check token holders")
    setButtonLogic(true)
  } 
  else if(!isValidAddress){
    setButtonText("enter a valid address")
    setButtonLogic(false)
  }
}

  
useEffect(() => {
  isValidSolanaAddress();
  buttonChecker();
}, [buttonLogic]);

useEffect(() => {
  buttonChecker(); // Check button logic immediately after isValidAddress changes
}, [isValidAddress]); // Only trigger effect when isValidAddress changes


  return (
    
    <div className="holders">
      <h1>alpha finder</h1>
      <p>give a timeframe <br></br> give a token <br></br> get the cabal</p>
      <div className="input-group">
                <input
                  type="text"
                  placeholder="Token Address"
                  value={tokenAddress}
                  onChange={(e) => setTokenAddress(e.target.value)} 
                />
                <button onClick={fetchDataAndExtractOwners} disabled={ isLoading}>
        {buttonText}
      </button>
      </div>
    </div>
  );
};

export default AlphaFinder;
