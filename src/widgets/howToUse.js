import React, { useEffect, useState } from 'react';
import '../design/howToUse.css'; // Import the CSS file
import { useCookies } from 'react-cookie';
import Modal from './modal';

function HowToUseCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [cookies, setCookie] = useCookies(['howToUseSeen']);
  const [isModalOpen, setIsModalOpen] = useState(!cookies.howToUseSeen);




  const handleClose = () => {
    // Set a cookie to indicate that the user has seen the instructions
    setCookie('howToUseSeen', true, { maxAge: 7 * 24 * 60 * 60 }); // Cookie expires in 7 days
    setIsModalOpen(false);
  };

  const carouselItems = [
    <div className='carousel-item' >
      <h2>How to Use</h2>
      <p>Welcome to the application! Here are instructions on how to use it...</p>
    </div>,
    <div className='carousel-item' >
    <h2>How to Use</h2>
      <p>Welcome to the application! Here are instructions on how to use it...</p>
      <p>Welcome to the application! Here are instructions on how to use it...</p>
    </div>,
    <div className='carousel-item' >
    <h2>How to Use</h2>
      <p>Welcome to the application! Here are instructions on how to use it...</p>
      <p>Welcome to the application! Here are instructions on how to use it...</p>
      <p>Welcome to the application! Here are instructions on how to use it...</p>
      <button className='cookie-button' onClick={handleClose}>Got It!</button>
    </div>]; // Example carousel items


  useEffect(() => {
    showSlide(currentSlide);
    console.log(currentSlide)
  }, [currentSlide]);

  const showSlide = (slideIndex) => {
    const numSlides = carouselItems.length;
    if (slideIndex < 0) {
      slideIndex = numSlides - 1;
    } else if (slideIndex >= numSlides) {
      slideIndex = 0;
    }

    setCurrentSlide(slideIndex);
  };

  const prevSlide = () => {
    showSlide(currentSlide - 1);
  };

  const nextSlide = () => {
    showSlide(currentSlide + 1);
  };

  return (
    <Modal isOpen={isModalOpen} onClose={handleClose}>
      <div className="how-to-use-container">
        <div className="carousel">
          <div className="carousel-inner">
            {carouselItems[currentSlide]}
          </div>
          <button className="carousel-control prev" onClick={prevSlide}>&#10094;</button>
          <button className="carousel-control next" onClick={nextSlide}>&#10095;</button>
        </div>
      </div>
    </Modal>
  );
}

export default HowToUseCarousel;
