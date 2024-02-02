import React from 'react';
import './Portfolio.css';

// Import your own copy icon image

const Portfolio = ({ walletData }) => {
  if (!walletData) return <div>Loading...</div>; // or handle the absence of walletData appropriately

  const handleCopyClick = (mint) => {
    // Create a temporary textarea element
    const textarea = document.createElement('textarea');

    // Set the mint as the text content to be copied
    textarea.value = mint;

    // Append the textarea to the document
    document.body.appendChild(textarea);

    // Select the text inside the textarea
    textarea.select();

    // Execute the copy command
    document.execCommand('copy');

    // Remove the temporary textarea
    document.body.removeChild(textarea);

    // Show "Copied to clipboard" alert
    alert('Copied to clipboard');
  };

  return (
    <div className="portfolio">
      <h2>Holdings</h2>
      <div className="portfolio-grid">
        {walletData.map((item, index) => (
          <div key={index} className="portfolio-item">
            <div className="item-details">
              <p style={{ margin: 0, fontWeight: "bold" }}>{item.mint.slice(0, 10)}</p>
              <p style={{ margin: 0 }}>{parseFloat(item.amount) / Math.pow(10, 9)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Portfolio;
