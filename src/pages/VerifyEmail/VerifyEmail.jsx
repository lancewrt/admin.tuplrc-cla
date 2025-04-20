import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setIsEmailVerified } from '../../features/isEmailVerified';
import './VerifyEmail.css'

const VerifyEmail = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [email, setEmail] = useState('');
    const { isEmailVerified } = useSelector(state => state.isEmailVerified);
    
    // Extract token from URL query
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get('token');
    
    useEffect(() => {
        // Verify token
        if (token) {
          verifyToken();
        } else {
          setIsLoading(false);
          setMessage('Token is missing.');
        }
    }, [token]);

    const verifyToken = async () => {
        try {
          const res = await axios.get("https://api.tuplrc-cla.com/api/user/verify-token", {
            params: { token }
          });
          console.log(res)
          dispatch(setIsEmailVerified(true));
          setEmail(res.data.email);
        } catch (err) {
          setMessage(err.response?.data?.message || 'Invalid or expired token.');
          dispatch(setIsEmailVerified(false));
        } finally {
          setIsLoading(false);
        }
    };

    console.log('isEmailVerified: ', isEmailVerified);
      
    useEffect(() => {
        console.log('Email verification state updated:', isEmailVerified);
    }, [isEmailVerified]);

    return (
        <div className="container-fluid min-vh-100 bg-light d-flex align-items-center justify-content-center verify-container">
          <div className="w-100" style={{ maxWidth: '500px' }}>
            {isLoading ? (
              // Loading State
              <div className="card shadow-sm border-0">
                <div className="card-body text-center p-5">
                  <div class="spinner-grow text-danger" role="status">
                    <span class="sr-only">Loading...</span>
                  </div>
                  <h3 className="fw-bold mb-2 mt-3">Verifying Your Email</h3>
                  <p className="text-muted">Please wait while we verify your email address...</p>
                </div>
              </div>
            ) : message ? (
              // Error State
              <div className="card shadow-sm border-0 overflow-hidden">
                <div className="text-white text-center pt-4">
                  <div className="bg-white rounded-circle d-inline-flex p-3 shadow">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" 
                      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-danger">
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="15" y1="9" x2="9" y2="15"></line>
                      <line x1="9" y1="9" x2="15" y2="15"></line>
                    </svg>
                  </div>
                </div>
                <div className="card-body p-4 text-center">
                  <h3 className="fw-bold mb-2">Verification Failed</h3>
                  <p className="text-muted mb-2">{message}</p>
                </div>
              </div>
            ) : (
              // Success State
              <div className="card shadow-sm border-0 overflow-hidden">
                <div className="text-white text-center pt-4">
                  <div className="bg-white rounded-circle d-inline-flex p-3 shadow">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" 
                      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                      <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                  </div>
                </div>
                <div className="card-body p-4 text-center">
                  <h3 className="fw-bold mb-2">Email Verified!</h3>
                  <p className="text-muted mb-1">Your email address has been successfully verified.</p>
                  {email && <p className="text-primary fw-bold mb-4">{email}</p>}
                </div>
              </div>
            )}
          </div>
        </div>
    );
}

export default VerifyEmail;