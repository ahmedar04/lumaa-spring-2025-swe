import React, { useState } from 'react';
import './styles.css';

interface LoginProps {
  onLogin: (token: string) => void;
  switchView: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin, switchView }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5001/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();
      if (response.ok && data.token) {
        onLogin(data.token);
      } else {
        alert(data.message || 'Login failed');
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred during login.');
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h2>Login</h2>
        <form onSubmit={handleSubmit} className="form-group">
          <input
            className="input"
            type="text"
            placeholder="Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
          />
          <input
            className="input"
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="button">Login</button>
        </form>
        <div style={{ textAlign: 'center' }}>
          <p>
            Don't have an account?{' '}
            <button className="link-button" onClick={switchView}>Register</button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
