import React from 'react';
import { useCookies } from 'react-cookie';

function Intro() {
  const [cookies, setCookie] = useCookies(['howToUseSeen']);

  const handleClose = () => {
    // Set a cookie to indicate that the user has seen the instructions
    setCookie('howToUseSeen', true, { maxAge: 7 * 24 * 60 * 60 }); // Cookie expires in 7 days
  };

  // Check if the user has already seen the instructions
  if (cookies.howToUseSeen) {
    return null; // Don't render anything if the user has already seen the instructions
  }

  return (
    <div className="how-to-use">
      <h2>How to Use</h2>
      <p>Welcome to the application! Here are instructions on how to use it...</p>
      <button onClick={handleClose}>Got It!</button>
    </div>
  );
}

export default Intro;
