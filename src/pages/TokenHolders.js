import React, { useState } from 'react';
import '../design/Holders.css';

const TokenHolders = () => {
  const [ownersData, setOwnersData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [tokenAddress, setTokenAddress] = useState('');
  const [isPressed, setIsPressed] = useState(false);
  const solregex = /(^[1-9A-HJ-NP-Za-km-z]{32,44}$)/g 
  const isValidAddress = tokenAddress.match(solregex)
  console.log(isValidAddress)
  // Function to fetch data and extract owners
  const fetchDataAndExtractOwners = async () => {
    setIsLoading(true);

    const url = "https://jittery-charmian-fast-mainnet.helius-rpc.com/"; // Replace with your API URL
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
    console.log(totalSupply)
    const programAccountsResponse = await postRequest(dataProgramAccounts);
    console.log(programAccountsResponse)
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
    console.log(processedData)
    setOwnersData(processedData); // Update the state with the processed data
  } catch (error) {
    console.error('Error fetching and processing data: ', error);
  } finally {
    setIsLoading(false); // Ensure loading state is updated even if an error occurs
  }
    setIsPressed(true)
    setIsLoading(false);
  };

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

  return (
    <div className="holders">
      <h1>Get all the token holders easily</h1>
      <img src="/tokenholders.png" className="holders-logo" alt="tokenholders" />
      <p>Explore the token universe with our feature that fetches and displays all holders of a specific token, <br></br> revealing each holder's percentage share. Gain quick and insightful access to ownership distribution in just a few clicks.</p>
      {isValidAddress ? null : <span style={{color: "#EE4B2B"}}> Please enter a correct token address </span>}
      <div className='input' >
      <input style={isValidAddress ? {border: "2px solid #61dafb"} : {border: "2px solid red"} } 
            type="text"
            placeholder="Enter token address"
            value={tokenAddress}
            onChange={(e) => setTokenAddress(e.target.value)} 
                     />
      <button onClick={fetchDataAndExtractOwners} disabled={!isValidAddress || isLoading}>
        {isLoading ? 'Loading...' : 'Fetch Data'}
      </button>
      </div>
      { !isPressed ? null : <div className="owners-list">
      {ownersData.length > 0 && (
        <div className='owners-button' > 
        <button onClick={downloadOwnersData}>Download Owners Data</button>
        <button onClick={copyAllToClipboard}>Copy All Owners</button>
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
