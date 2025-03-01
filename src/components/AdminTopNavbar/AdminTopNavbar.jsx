import React, { useEffect, useState } from 'react';
import './AdminTopNavbar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleUser } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook for navigation
import { useSelector, useDispatch } from 'react-redux';
import { checkIfOnline } from '../../features/isOnlineSlice';


const AdminTopNavbar = () => {
    const [dateTime, setDateTime] = useState(new Date());
    const dispatch = useDispatch();
    const isOnline = useSelector((state) => state.isOnline.isOnline);
    const [uname, setUname] = useState(null);
    const navigate = useNavigate(); // Hook to navigate programmatically

    useEffect(() => {
        const getUsername = async () => {
            try {
                const response = await axios.get('https://api.tuplrc-cla.com/api/user/check-session', { withCredentials: true });
                console.log(response.data);
                if (response.data.loggedIn) {
                    setUname(response.data.username);
                } else {
                    setUname(null);
                }
            } catch (error) {
                console.error('Error verifying session:', error);
                setUname(null);
            }
        };
        getUsername();
    }, []);

    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const today = new Date();
    const currentDay = days[today.getDay()];

    useEffect(() => {
        const checkOnlineStatus = async () => {
            try {
                await fetch("https://jsonplaceholder.typicode.com/todos/1", { cache: "no-store" });
                dispatch(checkIfOnline(true));
            } catch (error) {
                dispatch(checkIfOnline(false));
            }
        };

        // Initially set "Loading..." until first check
        dispatch(checkIfOnline(null));
        checkOnlineStatus();

        // Add event listeners for online/offline events
        const handleOnline = () => dispatch(checkIfOnline(true));
        const handleOffline = () => dispatch(checkIfOnline(false));

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        // Check internet status every 5 seconds
        const intervalId = setInterval(checkOnlineStatus, 5000);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
            clearInterval(intervalId);
        };
    }, [dispatch]);

    // Logout function
    const logout = async () => {
        try {
            await axios.post('https://api.tuplrc-cla.com/api/user/logout', { username: uname }, { withCredentials: true });
            localStorage.removeItem('role');
            localStorage.removeItem('username');
            navigate('/');
        } catch (err) {
            console.error('Logout error:', err);
        }
    };

    return (
        <div className="top-navbar">
            {/* Online/Offline Indicator */}
            <div className="indicator">
                {isOnline === null ? 'Loading...' : isOnline ? 'Online' : 'Offline'}
            </div>
            <div className="info">
                {/* Date and Time */}
                <div className="top-navbar-datetime">
                    <span>{dateTime.toLocaleTimeString()}</span>
                    <span>|</span>
                    <span>{currentDay}</span>
                    <span>|</span>
                    <span>{dateTime.toLocaleDateString()}</span>
                </div>

                {/* Admin Account Dropdown */}
                <div className="user-box">
                    <div className="dropdown">
                        <button className="btn cat-dropdown dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                            <FontAwesomeIcon icon={faCircleUser} className="icon" />
                            <span>
                                Hello, <span className="user-welcome-uname">{uname}</span>
                            </span>
                        </button>
                        <ul className="dropdown-menu">
                            <li>
                                <button className="dropdown-item" onClick={logout}>Logout</button>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminTopNavbar;
