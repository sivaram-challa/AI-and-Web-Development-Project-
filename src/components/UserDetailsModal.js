import React from 'react';
import './UserDetailsModal.css';

function UserDetailsModal({ isOpen, onClose, user, setUser }) {
  if (!isOpen) return null;

  const handleLogout = () => {
    setUser(null); // Clear the user state
    onClose(); // Close the modal
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>User Details</h2>
        {user ? (
          <>
            <div className="user-detail">
              <strong>Username:</strong> {user.username}
            </div>
            <div className="user-detail">
              <strong>Email:</strong> {user.email}
            </div>
          </>
        ) : (
          <p>No user details available</p>
        )}
        <div>
          <button onClick={onClose}>Close</button>
          <button onClick={handleLogout} className="logout-button">Logout</button>
        </div>
      </div>
    </div>
  );
}

export default UserDetailsModal;
