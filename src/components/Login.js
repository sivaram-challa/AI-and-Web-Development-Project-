// Login.js

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';
import userIcon from '../assets/user-icon.jpg';

function Login({ setUser }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/login', { username, password });
      setUser(response.data.user);
      navigate('/app/home'); // Redirect to home page
    } catch (error) {
      alert('Invalid username or password');
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleLogin(event);
    }
  };

  return (
    <div className="login-container">
      <div className="login-form" onKeyPress={handleKeyPress}>
        <div className="login-avatar">
          <img src={userIcon} alt="User Icon" />
        </div>
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="login-input"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="login-input"
          />
          <button type="submit" className="login-button">LOGIN</button>
        </form>
        <div className="login-options">
          <label>
            <input type="checkbox" /> Remember me
          </label>
          <a href="#" className="forgot-password">Forgot your password?</a>
        </div>
        <div className="signup-link">
          <span>Don't have an account?</span> <button onClick={() => navigate('/signup')}>Sign Up</button>
        </div>
      </div>
    </div>
  );
}

export default Login;
