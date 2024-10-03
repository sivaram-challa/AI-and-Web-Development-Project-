import React from 'react';
import './PredictionResult.css';

function PredictionResult({ result }) {
  return (
    <div className="Prediction-result">
      <p>Prediction Result: {result}%</p>
    </div>
  );
}

export default PredictionResult;
