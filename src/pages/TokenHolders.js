import React, { useState, useEffect } from 'react';
import '../design/Holders.css';

const TokenHolders = () => {
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

    const url = "https://mainnet.helius-rpc.com/?api-key=1a8b4527-6ec2-4036-acd8-e747259d7654"; // Replace with your API URL
    const headers = {
      "Content-Type": "application/json"
    };

      // Define the data for fetching total token supply
    const dataTokenSupply = {
      "jsonrpc": "2.0",
      "id": 1,
      "method": "getTokenSupply",
      "params": [tokenAddress] // Using tokenAddress from the component's state
    };
    const dataProgramAccounts = {
      // Your data for the post request
      // Example data structure
      "jsonrpc": "2.0",
      "id": 1,
      "method": "getProgramAccounts",
      "params": [
        "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
        {
          "encoding": "jsonParsed",
          "filters": [
            {
              "dataSize": 165
            },
            {
              "memcmp": {
                "offset": 0,
                "bytes": tokenAddress
              }
            }
          ]
        }
      ]
    };

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

      // Perform the POST request
  const postRequest = async (data) => {
    const response = await fetch(url, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(data)
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return await response.json();
  };

  try {
    const totalSupplyResponse = await postRequest(dataTokenSupply);
    const totalSupply = totalSupplyResponse.result.value.uiAmount;
    const programAccountsResponse = await postRequest(dataProgramAccounts);
    const accounts = programAccountsResponse.result;
    const processedData = accounts.reduce((acc, item) => {
      const info = item.account.data.parsed.info;
      const amount = info.tokenAmount.uiAmount;
      if (amount > 0) {
        const percentage = (amount / totalSupply) * 100;
        acc.push({ owner: info.owner, amount, percentage: percentage.toFixed(2) });
      }
      return acc;
    }, []);

    processedData.sort((a, b) => parseFloat(b.percentage) - parseFloat(a.percentage));
    setOwnersData(processedData); // Update the state with the processed data
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

  // Function to copy all owners' data to clipboard
  const copyAllToClipboard = () => {
    const allOwnersText = ownersData.join('\n'); // Join all owners with newline
    navigator.clipboard.writeText(allOwnersText)
      .then(() => alert('All owners copied to clipboard'))
      .catch(err => console.error('Could not copy text: ', err));
  };

  const downloadOwnersData = () => {
    const jsonBlob = new Blob([JSON.stringify(ownersData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(jsonBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'ownersData.json';
    link.click();
    URL.revokeObjectURL(url);
  };

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
      <h1>token holderz</h1>
      <p>get all holders of a token, <br></br> find out who has the most.</p>
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
      { !isPressed ? null : <div className="owners-list">
      <img className='holders-token-img' alt='token' src={tokenData.image} />
      <p>{tokenData.metadata.name} </p>
      <p>{tokenData.metadata.symbol} </p>
      {ownersData.length > 0 && (
        <div className='owners-button' > 
        <button onClick={downloadOwnersData}>Download</button>
        <button onClick={copyAllToClipboard}>Copy</button>
        </div>
      )}
        <table className="owners-table">
          <thead>
            <tr>
              <th>Owner</th>
              <th>Amount</th>
              <th>Percentage</th>
            </tr>
          </thead>
          <tbody>
            {ownersData.map((owner, index) => (
              <tr key={index}>
                <td>{owner.owner}</td>
                <td>{owner.amount}</td>
                <td>{owner.percentage}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>}
    </div>
  );
};

export default TokenHolders;
