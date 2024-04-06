import React, { useRef, useState } from 'react';
import { createCanvas, loadImage } from 'canvas';
import Modal from './modal';

function ImageGenerator() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState('');

  const generateImage = async () => {
    const canvas = createCanvas(800, 600);
    const ctx = canvas.getContext('2d');

    // Load the background image
    const backgroundImage = await loadImage('/memes/bonkbot.png'); // Replace with your image path
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

    // Add text on top of the image
    const text = 'Hello, World!';
    ctx.font = '40px Arial';
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.fillText(text, canvas.width / 2, canvas.height / 2);

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
      <button onClick={generateImage}>Generate Image</button>

      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={closeModal}>
          <img src={generatedImageUrl} alt="Generated Image" style={{ maxWidth: '100%', maxHeight: '80vh' }} />
          <button onClick={closeModal}>Close</button>
          <a href={generatedImageUrl} download="generated_image.png">
            Download Image
          </a>
        </Modal>
      )}
    </div>
  );
}

export default ImageGenerator;
