import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';

const LoginPage = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const checkSession = async () => {
            try {
                const response = await axios.get('https://api.tuplrc-cla.com/api/user/check-session', {
                    withCredentials: true
                });

                if (response.data.loggedIn) {
                    navigate('/dashboard');
                }
            } catch (err) {
                console.log("User not logged in");
            }
        };
        checkSession();
    }, [navigate]);

    const login = async () => {
        if (!username || !password) {
            setError("Both fields are required.");
            return;
        }

        try {
            setLoading(true);
            const response = await axios.post(
                'https://api.tuplrc-cla.com/api/user/login',
                { username, password },
                { withCredentials: true }
            );

            console.log(response)

            if (response.status === 200) {
                navigate('/dashboard');
            }
        } catch (err) {
            setError(err.response?.data?.message || "Login failed.");
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            login();
        }
    };

    return (
        <div className="min-vh-100 d-flex align-items-center justify-content-center login-container">
            <div className="card shadow-lg border-0" style={{ maxWidth: "400px" }}>
                <div className="card-body p-5">
                    <div className="text-center mb-4">
                        <div className="d-flex justify-content-center gap-3 mb-3">
                            <img src="/tuplogo.png" alt="TUP Logo" className="img-fluid" style={{ height: "60px" }} />
                            <img src="/clalogo.png" alt="CLA Logo" className="img-fluid" style={{ height: "60px" }} />
                        </div>
                        <h1 className="h3 fw-bold text-dark">College of Liberal Arts</h1>
                        <p className="fw-medium">Learning Resource Center</p>
                    </div>

                    <div className="mb-3 form-floating">
                        <input
                            type="text"
                            className="form-control"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            onKeyDown={handleKeyDown}
                        />
                        <label htmlFor="username">Username</label>
                    </div>

                    <div className="mb-4 form-floating">
                        <input
                            type="password"
                            className="form-control"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onKeyDown={handleKeyDown}
                        />
                        <label htmlFor="password">Password</label>
                    </div>

                    {error && <div className="alert alert-danger">{error}</div>}

                    <div className="d-grid gap-2">
                        <button
                            className="btn btn-dark py-2"
                            onClick={login}
                            disabled={loading}
                        >
                            {loading ? 'Loading...' : 'Login'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
