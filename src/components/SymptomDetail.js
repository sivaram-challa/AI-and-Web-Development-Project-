// SymptomDetail.js

import React from 'react';
import './SymptomDetail.css';

function SymptomDetail({ symptom }) {
  if (!symptom) {
    return <div className="symptom-detail">Select a symptom to see the details.</div>;
  }

  return (
    <div className="symptom-details-container">
      <h2>{symptom.name.replace('_', ' ')}</h2>
      <p>{symptom.description}</p>
    </div>
  );
}

export default SymptomDetail;
