// SymptomsList.js

import React from 'react';
import './SymptomsList.css';

const SymptomsList = ({ symptoms, selectedSymptom, onSymptomClick }) => {
  return (
    <div className="symptoms-list-container">
      {symptoms.map((symptom) => (
        <div
          key={symptom.name}
          className={`symptoms-list-item ${selectedSymptom === symptom ? 'selected' : ''}`}
          onClick={() => onSymptomClick(symptom)}
        >
          {symptom.name.replace('_', ' ')}
        </div>
      ))}
    </div>
  );
};

export default SymptomsList;
