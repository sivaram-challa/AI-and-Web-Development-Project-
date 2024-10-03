import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Header.css';
import UserDetailsModal from './UserDetailsModal'; // Import the UserDetailsModal component
import userIcon from '../assets/user-icon.jpg';

function Header({ user, setUser }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleMenuClick = () => {
    if (isDropdownOpen) {
      setIsClosing(true);
      setTimeout(() => {
        setIsDropdownOpen(false);
        setIsClosing(false);
      }, 300); // Duration of the closing animation
    } else {
      setIsDropdownOpen(true);
    }
  };

  const handleProfileClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleLinkClick = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsDropdownOpen(false);
      setIsClosing(false);
    }, 300); // Duration of the closing animation
  };

  return (
    <header className="App-header">
      <div className="menu-icon" onClick={handleMenuClick}>≡</div>
      <h1>Prediction Model</h1>
      <div className="profile-icon" onClick={handleProfileClick}>
        <img src={userIcon} alt="User Icon" className="user-icon" />
      </div>
      {(isDropdownOpen || isClosing) && (
        <div className={`dropdown-menu ${isClosing ? 'closing' : ''}`}>
          <ul>
            <li><Link to="/app/home" onClick={handleLinkClick}>Home</Link></li>
            <li><Link to="/app/symptoms" onClick={handleLinkClick}>Symptoms</Link></li>
            <li><Link to="/app/scans" onClick={handleLinkClick}>Scans</Link></li>
            <li><Link to="/app/report" onClick={handleLinkClick}>Report</Link></li>
          </ul>
        </div>
      )}
      <UserDetailsModal isOpen={isModalOpen} onClose={handleCloseModal} user={user} setUser={setUser} />
    </header>
  );
}

export default Header;
