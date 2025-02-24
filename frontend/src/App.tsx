import React, { useState } from 'react';
import Login from './components/Login';
import Register from './components/Register';
import Tasks from './components/Tasks';

const App: React.FC = () => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [view, setView] = useState<'login' | 'register' | 'tasks'>(token ? 'tasks' : 'login');

  const handleLogin = (token: string) => {
    localStorage.setItem('token', token);
    setToken(token);
    setView('tasks');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setView('login');
  };

  return (
    <div className="app-container">
      <header className="header">
        <h1>Task Manager</h1>
        {token && (
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        )}
      </header>
      <main className="main-content">
        {view === 'login' && (
          <Login onLogin={handleLogin} switchView={() => setView('register')} />
        )}
        {view === 'register' && (
          <Register onRegister={handleLogin} switchView={() => setView('login')} />
        )}
        {view === 'tasks' && token && <Tasks token={token} />}
      </main>
    </div>
  );
};

export default App;
