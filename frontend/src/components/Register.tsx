import React, { useState } from 'react';
import './styles.css';

interface RegisterProps {
  onRegister: (token: string) => void;
  switchView: () => void;
}

const Register: React.FC<RegisterProps> = ({ onRegister, switchView }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5001/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();
      if (response.ok) {
        // Auto-login after registration
        const loginResponse = await fetch('http://localhost:5001/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password }),
        });
        const loginData = await loginResponse.json();
        if (loginResponse.ok && loginData.token) {
          onRegister(loginData.token);
        } else {
          alert(loginData.message || 'Login failed after registration');
        }
      } else {
        alert(data.message || 'Registration failed');
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred during registration.');
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h2>Register</h2>
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
          <button type="submit" className="button">Register</button>
        </form>
        <div style={{ textAlign: 'center' }}>
          <p>
            Already have an account?{' '}
            <button className="link-button" onClick={switchView}>Login</button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
