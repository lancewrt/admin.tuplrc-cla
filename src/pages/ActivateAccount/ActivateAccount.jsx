import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import './ActivateAccount.css'; 

const ActivateAccount = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [valid, setValid] = useState(false);
  const [email, setEmail] = useState('');
  const [data, setData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({
    password: '',
    confirmPassword: ''
  });
  const [message, setMessage] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  // Password validation criteria
  const passwordCriteria = {
    minLength: 8,
    hasUppercase: /[A-Z]/,
    hasLowercase: /[a-z]/,
    hasNumber: /[0-9]/,
    hasSpecial: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/
  };

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
      const res = await axios.get(`https://api.tuplrc-cla.com/api/account/verify-token`, {
        params: { token }
      });
      setValid(true);
      setEmail(res.data.email);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Invalid or expired token.');
      setValid(false);
    } finally {
      setIsLoading(false);
    }
  };

  const validatePassword = (password) => {
    const errors = [];
    
    if (password.length < passwordCriteria.minLength) {
      errors.push(`Password must be at least ${passwordCriteria.minLength} characters long`);
    }
    if (!passwordCriteria.hasUppercase.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    if (!passwordCriteria.hasLowercase.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    if (!passwordCriteria.hasNumber.test(password)) {
      errors.push('Password must contain at least one number');
    }
    if (!passwordCriteria.hasSpecial.test(password)) {
      errors.push('Password must contain at least one special character');
    }
    
    return errors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Live validation
    if (name === 'password') {
      const passwordErrors = validatePassword(value);
      setErrors(prev => ({
        ...prev,
        password: passwordErrors.length > 0 ? passwordErrors : ''
      }));
    } else if (name === 'confirmPassword') {
      setErrors(prev => ({
        ...prev,
        confirmPassword: value !== data.password ? 'Passwords do not match' : ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Final validation before submission
    const passwordErrors = validatePassword(data.password);
    
    if (passwordErrors.length > 0 || data.password !== data.confirmPassword) {
      setErrors({
        password: passwordErrors.length > 0 ? passwordErrors : '',
        confirmPassword: data.password !== data.confirmPassword ? 'Passwords do not match' : ''
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const res = await axios.post(`https://api.tuplrc-cla.com/api/account/activate`, {
        token,
        password: data.password
      });
      
      setMessage(res.data.message || 'Account activated successfully!');
      
      navigate('/');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Error activating account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const requestActivationLink = async () => {
    try {
      const response = await axios.post('https://api.tuplrc-cla.com/api/account/request-new-link', {
        token: token
      });
      console.log(response)
  
      if (response.data.success) {
        setMessage("New activation link sent to your email.");
      } else {
        setMessage(response.data.error);
      }
    } catch (error) {
      console.error("Request error:", error);
    }
  };
  

  // Password strength indicator
  const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, label: '' };
    
    const criteria = [
      password.length >= passwordCriteria.minLength,
      passwordCriteria.hasUppercase.test(password),
      passwordCriteria.hasLowercase.test(password),
      passwordCriteria.hasNumber.test(password),
      passwordCriteria.hasSpecial.test(password)
    ];
    
    const metCriteria = criteria.filter(Boolean).length;
    
    if (metCriteria === 5) return { strength: 100, label: 'Strong' };
    if (metCriteria >= 3) return { strength: 60, label: 'Moderate' };
    if (metCriteria >= 1) return { strength: 30, label: 'Weak' };
    return { strength: 0, label: '' };
  };

  const passwordStrength = getPasswordStrength(data.password);

  if (isLoading) {
    return (
      <div className="activate-container">
        <div className="loading-spinner"></div>
        <p>Verifying your account...</p>
      </div>
    );
  }

  return (
    <div className='activate'>
        <div className="activate-container">
        {valid ? (
            <div className="activate-form-wrapper">
            <form onSubmit={handleSubmit} className="activate-form">
                <h2>Activate Your Account</h2>
                <p className="email-display">Account: <strong>{email}</strong></p>
                
                <div className="form-group">
                <label htmlFor="password">New Password</label>
                <input
                    id="password"
                    type="password"
                    name="password"
                    value={data.password}
                    onChange={handleChange}
                    className={errors.password ? 'input-error' : ''}
                    required
                />
                
                {data.password && (
                    <div className="password-strength">
                    <div className="strength-meter">
                        <div 
                        className={`strength-meter-fill strength-${passwordStrength.label.toLowerCase()}`}
                        style={{ width: `${passwordStrength.strength}%` }}
                        ></div>
                    </div>
                    <span className={`strength-text strength-${passwordStrength.label.toLowerCase()}`}>
                        {passwordStrength.label}
                    </span>
                    </div>
                )}
                
                {Array.isArray(errors.password) ? (
                    <ul className="error-list">
                    {errors.password.map((error, index) => (
                        <li key={index} className="error-message">{error}</li>
                    ))}
                    </ul>
                ) : (
                    errors.password && <p className="error-message">{errors.password}</p>
                )}
                
                <div className="password-requirements">
                    <p>Password must:</p>
                    <ul>
                    <li className={data.password.length >= passwordCriteria.minLength ? 'met' : ''}>
                        Be at least {passwordCriteria.minLength} characters long
                    </li>
                    <li className={passwordCriteria.hasUppercase.test(data.password) ? 'met' : ''}>
                        Include at least one uppercase letter
                    </li>
                    <li className={passwordCriteria.hasLowercase.test(data.password) ? 'met' : ''}>
                        Include at least one lowercase letter
                    </li>
                    <li className={passwordCriteria.hasNumber.test(data.password) ? 'met' : ''}>
                        Include at least one number
                    </li>
                    <li className={passwordCriteria.hasSpecial.test(data.password) ? 'met' : ''}>
                        {`Include at least one special character (!@#$%^&*()_+-=[]{}|;:'",./<>?)`}
                    </li>
                    </ul>
                </div>
                </div>
                
                <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                    id="confirmPassword"
                    type="password"
                    name="confirmPassword"
                    value={data.confirmPassword}
                    onChange={handleChange}
                    className={errors.confirmPassword ? 'input-error' : ''}
                    required
                />
                {errors.confirmPassword && <p className="error-message">{errors.confirmPassword}</p>}
                </div>
                
                <button 
                type="submit" 
                className="submit-button"
                disabled={isLoading || Object.values(errors).some(error => error && error.length)}
                >
                {isLoading ? 'Activating...' : 'Activate Account'}
                </button>
            </form>
            </div>
        ) : (
            <div className="error-container">
            <h2>Invalid or Expired Token</h2>
            <button onClick={requestActivationLink} className="action-button">
                Request New Activation Link
            </button>
            </div>
        )}
        
        {message && <div className="message-container">{message}</div>}
        </div>
    </div>
    
  );
};

export default ActivateAccount;