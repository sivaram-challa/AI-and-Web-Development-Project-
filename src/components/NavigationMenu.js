import React from 'react';
import { Link } from 'react-router-dom';
import './NavigationMenu.css';

const NavigationMenu = () => {
  return (
    <div className="navigation-menu">
      <nav className="navbar">
        <ul>
          <li><Link to="/app/home">Home</Link></li>
          <li><Link to="/app/symptoms">Symptoms</Link></li>
          <li><Link to="/app/scans">Scans</Link></li>
          <li><Link to="/app/report">Report</Link></li>
        </ul>
      </nav>
    </div>
  );
};

export default NavigationMenu;
