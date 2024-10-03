import React from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import './CircularProgress.css';

function CircularProgress({ percentage }) {
  return (
    <div className="Circular-progress">
      <CircularProgressbar
        value={percentage}
        text={`${percentage}%`}
        styles={buildStyles({
          textColor: '#333',
          pathColor: '#6a1b9a',
          trailColor: '#d6d6d6',
        })}
      />
    </div>
  );
}

export default CircularProgress;
