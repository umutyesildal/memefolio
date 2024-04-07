import React, { useRef, useState } from 'react';
import { createCanvas, loadImage } from 'canvas';
import Modal from './modal';
import '../design/saveImage.css';

function ImageGenerator(data) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState('');

  const generateImage = async () => {
    const canvas = createCanvas(800, 600);
    const ctx = canvas.getContext('2d');

    // Load the background image
    const backgroundImage = await loadImage('/memes/memefolio-export.png'); // Replace with your image path
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

    // Add text on top of the image
    const sold = '3 sol';
    const bought = '2.5 sol';
    const net = '%25'
    ctx.font = '32px SpaceMonoBold';
    ctx.fillStyle = '#fffa65';
    ctx.textAlign = 'Space Around';
    ctx.fillText(sold, canvas.width / 1.6, canvas.height / 2);
    ctx.fillText(bought, canvas.width / 3.9, canvas.height / 2);
    ctx.font = '64px SpaceMonoBold';
    ctx.fillText(net, canvas.width / 2.3, canvas.height / 1.5);

    // Convert the canvas to a Blob
    const blob = await new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        resolve(blob);
      }, 'image/png');
    });

    // Convert the Blob to a data URL
    const imageUrl = URL.createObjectURL(blob);
    setGeneratedImageUrl(imageUrl);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      <button className='save-image' onClick={generateImage}>Share It</button>
      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={closeModal}>
        <div className='image-modal' >
          <button className="close-button" onClick={closeModal}>X</button>
          <img src={generatedImageUrl} alt="Generated Image" style={{ maxWidth: '80%', maxHeight: '50vh' }} />
          <div className='socials' > 
            <a href={generatedImageUrl} download="generated_image.png">
              Download Image
            </a>
            <a href={generatedImageUrl} download="generated_image.png">
              Download Image
            </a>
            <a href={generatedImageUrl} download="generated_image.png">
              Download Image
            </a>
          </div>
        </div>
        </Modal>
      )}
    </div>
  );
}

export default ImageGenerator;
