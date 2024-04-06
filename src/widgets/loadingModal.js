import React, { useState, useEffect } from 'react';
import '../design/LoadingModal.css'; // Import the CSS file

const LoadingModal = () => {
  const [loadingText, setLoadingText] = useState('getting your memes...');

  useEffect(() => {
    // Function to update the loading text every 2 seconds
    const intervalId = setInterval(() => {
      setLoadingText((prevText) => {
        // Example array of loading texts to cycle through
        const loadingTexts = ['I hope you did not paperhand 😂', 'Yes you did lmao', 'Is this taking too long?', 'I guess now we have a problem but keep waiting'];
        // Find the index of the current text and get the next one
        const currentIndex = loadingTexts.findIndex((text) => text === prevText);
        const nextIndex = (currentIndex + 1) % loadingTexts.length; // Wrap around to the start
        return loadingTexts[nextIndex];
      });
    }, 2000);

    return () => {
      // Cleanup function to clear interval on component unmount
      clearInterval(intervalId);
    };
  }, []); // Run effect only once on component mount

  return (
    <div className="loading-modal">
      <img src="/memes/wink.gif" alt="Loading..." className="spinner-gif" />
      <p className="loading-text">{loadingText}</p>
    </div>
  );
};

export default LoadingModal;
