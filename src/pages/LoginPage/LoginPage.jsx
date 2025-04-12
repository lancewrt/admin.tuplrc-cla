import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [checkingSession, setCheckingSession] = useState(true);
  const navigate = useNavigate();

  // Check if user is already logged in
  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await axios.get(`https://api.tuplrc-cla.com/api/user/check-session`, {
          withCredentials: true
        });
        
        if (response.data && response.data.authenticated) {
          navigate('/dashboard');
        }
      } catch (error) {
        // Safely handle the error without trying to access null properties
        console.error("Error checking session:", error);
        // Don't set any error state here as this is just a session check
      } finally {
        setCheckingSession(false);
      }
    };

    checkSession();
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        `https://api.tuplrc-cla.com/api/user/login`,
        { username, password },
        { 
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data && response.data.token) {
        localStorage.setItem('userInfo', JSON.stringify(response.data.user));
        navigate('/dashboard');
      } else {
        setError('Login failed. Please try again.');
      }
    } catch (error) {
      // Safe error handling with optional chaining
      const errorMessage = 
        error?.response?.data?.message || 
        'Login failed. Please check your credentials and try again.';
      
      setError(errorMessage);
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (checkingSession) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid bg-light d-flex justify-content-center align-items-center vh-100">
      <div className="card shadow-sm" style={{ maxWidth: '400px', width: '100%' }}>
        <div className="card-body p-4">
          <h3 className="card-title text-center mb-4">TUP Library System Login</h3>
          
          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}
          
          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <label htmlFor="username" className="form-label">Username</label>
              <input
                type="text"
                className="form-control"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            
            <div className="mb-3">
              <label htmlFor="password" className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            <div className="d-grid gap-2">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Loading...
                  </>
                ) : (
                  'Login'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;