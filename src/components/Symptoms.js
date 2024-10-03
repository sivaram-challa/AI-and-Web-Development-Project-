import React, { useState } from 'react';
import SymptomsList from './SymptomsList';
import SymptomDetail from './SymptomDetail';
import symptomsData from '../data/symptomsData';
import axios from 'axios';
import './Symptoms.css';

const Symptoms = () => {
  const [selectedSymptom, setSelectedSymptom] = useState(null);
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [predictionResult, setPredictionResult] = useState(null);
  const [error, setError] = useState(null);

  const handleSymptomClick = (symptom) => {
    setSelectedSymptom(symptom);
    setError(null); // Clear error when a symptom is selected
  };

  const handleSelectSymptom = () => {
    if (selectedSymptom && !selectedSymptoms.includes(selectedSymptom)) {
      setSelectedSymptoms([...selectedSymptoms, selectedSymptom]);
    }
  };

  const handleRemoveSymptom = (symptom) => {
    setSelectedSymptoms(selectedSymptoms.filter(s => s !== symptom));
  };

  const handlePredict = async () => {
    if (selectedSymptoms.length === 0) {
      setError('Please select at least one symptom.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/predict', {
        symptoms: selectedSymptoms.map(s => s.name.replace('_', ' '))
      });
      setPredictionResult(response.data);
      setError(null); // Clear error after successful prediction
    } catch (error) {
      console.error('Prediction error:', error);
    }
  };

  return (
    <div className="content-container">
      <SymptomsList 
        symptoms={symptomsData} 
        selectedSymptom={selectedSymptom} 
        onSymptomClick={handleSymptomClick} 
      />
      <div className="details-container">
        <SymptomDetail symptom={selectedSymptom} />
        <button className="select-button" onClick={handleSelectSymptom}>
          Select Symptom
        </button>
        <div className="selected-symptoms-container">
          {selectedSymptoms.map((symptom, index) => (
            <div key={index} className="selected-symptom-item">
              <span>{symptom.name.replace('_', ' ')}</span>
              <button className="remove-button" onClick={() => handleRemoveSymptom(symptom)}>Remove</button>
            </div>
          ))}
        </div>
        <button className="select-button" onClick={handlePredict}>
          Predict
        </button>
        {error && <p className="error-message">{error}</p>}
        {predictionResult && (
          <div className="prediction-result">
            <h3>Prediction Result</h3>
            <ul>
              {predictionResult.map((result, index) => (
                <li key={index}>
                  {result.disease}: {parseFloat(result.probability).toFixed(2)}%
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Symptoms;
