import React, { useState } from 'react';
import './Scans.css';

const scanTechniques = {
  MRI: [
    'Brain', 'Spine', 'Neck', 'Chest', 'Abdomen', 'Pelvis', 'Heart', 'Liver', 'Kidneys', 'Bladder', 'Pancreas', 'Gallbladder', 'Prostate', 'Uterus', 'Ovaries', 'Testes', 'Thyroid', 'Blood Vessels'
  ],
  CT: [
    'Brain', 'Spine', 'Neck', 'Chest', 'Abdomen', 'Pelvis', 'Heart', 'Lungs', 'Liver', 'Kidneys', 'Bladder', 'Pancreas', 'Gallbladder', 'Stomach', 'Intestines', 'Prostate', 'Uterus', 'Ovaries', 'Testes', 'Blood Vessels'
  ],
  Xray: [
    'Spine', 'Neck', 'Chest', 'Blood Vessels'
  ],
  Ultrasound: [
    'Neck', 'Chest', 'Abdomen', 'Pelvis', 'Heart', 'Liver', 'Kidneys', 'Bladder', 'Pancreas', 'Gallbladder', 'Prostate', 'Uterus', 'Ovaries', 'Testes', 'Thyroid', 'Blood Vessels'
  ],
  PET: [
    'Brain', 'Neck', 'Chest', 'Abdomen', 'Pelvis', 'Heart', 'Lungs', 'Liver', 'Kidneys', 'Bladder', 'Pancreas', 'Gallbladder', 'Stomach', 'Intestines', 'Prostate', 'Uterus', 'Ovaries', 'Testes', 'Thyroid', 'Blood Vessels'
  ]
};

const Scans = () => {
  const [selectedTechnique, setSelectedTechnique] = useState(null);
  const [selectedBodyPart, setSelectedBodyPart] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [viewImages, setViewImages] = useState(false);

  const handleTechniqueClick = (technique) => {
    setSelectedTechnique(technique);
    setSelectedBodyPart(null);
    setSelectedFiles([]);
    setViewImages(false);
  };

  const handleBodyPartClick = (part) => {
    setSelectedBodyPart(part);
    setViewImages(false);
  };

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    const fileURLs = files.map((file) => URL.createObjectURL(file));
    setSelectedFiles(fileURLs);
    setViewImages(false);
  };

  const handleUploadClick = () => {
    if (selectedFiles.length > 0) {
      // Handle file upload logic here
      console.log('Files uploaded:', selectedFiles);
    }
  };

  const handleViewImagesClick = () => {
    setViewImages(true);
  };

  return (
    <div className="scans-container">
      <h1>Available Scans</h1>
      <div className="buttons-container">
        {Object.keys(scanTechniques).map((technique) => (
          <button
            key={technique}
            onClick={() => handleTechniqueClick(technique)}
            className="scan-button"
          >
            {technique}
          </button>
        ))}
      </div>
      {selectedTechnique && (
        <div className="body-parts-container">
          <h2>{selectedTechnique} Scans</h2>
          <div className="body-parts-grid">
            {scanTechniques[selectedTechnique].map((part) => (
              <div
                key={part}
                className="body-part-option"
                onClick={() => handleBodyPartClick(part)}
              >
                {part}
              </div>
            ))}
          </div>
        </div>
      )}
      {selectedBodyPart && (
        <div className="scan-image-button-container">
          <h3>Selected Body Part: {selectedBodyPart}</h3>
          <input type="file" multiple onChange={handleFileChange} />
          {selectedFiles.length > 0 && <p>{selectedFiles.length} file(s) selected</p>}
          <button className="scan-image-button" onClick={handleUploadClick}>Upload Scan Images</button>
          {selectedFiles.length > 0 && <button className="scan-image-button" onClick={handleViewImagesClick}>View Uploaded Images</button>}
        </div>
      )}
      {viewImages && selectedFiles.length > 0 && (
        <div className="images-container">
          {selectedFiles.map((file, index) => (
            <div key={index} className="image-container">
              <img src={file} alt={`Uploaded Scan ${index + 1}`} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Scans;
