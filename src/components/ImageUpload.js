import React, { useState } from 'react';
import './ImageUpload.css';

function ImageUpload({ setResult }) {
  const [image, setImage] = useState(null);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async () => {
    // Handle image upload and prediction
    const response = await new Promise((resolve) =>
      setTimeout(() => resolve({ prediction: 75 }), 2000)
    ); // Simulate API call
    setResult(response.prediction);
  };

  return (
    <div className="Image-upload">
      <div className="upload-box">
        <input type="file" id="upload" onChange={handleImageChange} />
        <label htmlFor="upload" className="upload-label">+</label>
      </div>
      <button onClick={handleSubmit}>start</button>
    </div>
  );
}

export default ImageUpload;
