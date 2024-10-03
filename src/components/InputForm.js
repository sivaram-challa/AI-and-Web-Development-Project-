import React, { useState } from 'react';
import axios from 'axios';

function InputForm({ setResult }) {
  const [input, setInput] = useState('');

  const handleSubmit = async () => {
    const response = await axios.post('http://localhost:5000/predict', { input });
    setResult(response.data.prediction);
  };

  return (
    <div className="Input-form">
      <label htmlFor="inputData">Enter Data:</label>
      <input
        type="text"
        id="inputData"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button onClick={handleSubmit}>Predict</button>
    </div>
  );
}

export default InputForm;
