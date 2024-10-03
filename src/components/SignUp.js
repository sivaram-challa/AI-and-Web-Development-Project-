// SignUp.js

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './SignUp.css';
import userIcon from '../assets/user-icon.jpg';

function SignUp({ setUser }) {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/signup', { email, username, password });
      alert('User created successfully');
      setUser({ username, email }); // Set the new user details
      navigate('/app/home'); // Redirect to home page
    } catch (error) {
      alert('Error creating user');
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSignUp(event);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-form" onKeyPress={handleKeyPress}>
        <div className="signup-avatar">
          <img src={userIcon} alt="User Icon" />
        </div>
        <form onSubmit={handleSignUp}>
          <input
            type="email"
            placeholder="Gmail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="signup-input"
          />
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="signup-input"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="signup-input"
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="signup-input"
          />
          <button type="submit" className="signup-button">SIGN UP</button>
        </form>
        <div className="login-link">
          <span>Already have an account?</span> <button onClick={() => navigate('/')}>Login</button>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
