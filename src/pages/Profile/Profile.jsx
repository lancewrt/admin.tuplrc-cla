import React, { useEffect, useId, useState } from 'react';
import AdminNavbar from '../../components/AdminNavbar/AdminNavbar';
import AdminTopNavbar from '../../components/AdminTopNavbar/AdminTopNavbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUser, 
  faLock, 
  faQrcode,
  faChevronRight
} from '@fortawesome/free-solid-svg-icons';
import './Profile.css';
import { useSelector } from 'react-redux';
import axios from 'axios'
import Swal from 'sweetalert2'
import Loading from '../../components/Loading/Loading';

const Profile = () => {
    const {userId} = useSelector(state=>state.username)
    const [userData, setUserData] = useState({
        username: '',
        firstName: '',
        lastName: '',
        role: '',
    });
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [activeTab, setActiveTab] = useState('account'); // 'account' or 'password'
    const [originalUserData, setOriginalUserData] = useState(null);
    const [usernameValid, setUsernameValid] = useState(true);
    const [usernameChecking, setUsernameChecking] = useState(false);

    useEffect(()=>{
        if(!userId) return
        getUserProfile()
    },[userId])

    useEffect(() => {
        if (!userData.username.trim() || userData.username === originalUserData?.username) {
            setUsernameValid(true);
            return;
        }
    
        const delayDebounce = setTimeout(() => {
            validateUsername(userData.username);
        }, 500); // debounce
    
        return () => clearTimeout(delayDebounce);
    }, [userData.username]);    

    const getUserProfile = async()=>{
        try {
            console.log(userId)
            const response = await axios.get(`https://api.tuplrc-cla.com/api/user/profile/${userId}`)
            const data = response.data[0]
            const fetchedData = {
                username: data.staff_uname,
                firstName: data.staff_fname,
                lastName: data.staff_lname,
                role: data.role_name,
            };
    
            setUserData(fetchedData);
            setOriginalUserData(fetchedData); // Save the original for comparison
        } catch (error) {
        }
    }

    const validateUsername = async (username) => {
        setUsernameChecking(true);
        try {
            const response = await axios.get(
                `https://api.tuplrc-cla.com/api/user/check-username/${username}?excludeId=${userId}`
            );
            setUsernameValid(!response.data.exists); // true if username is available
        } catch (error) {
            console.error('Username validation error:', error);
            setUsernameValid(false);
        } finally {
            setUsernameChecking(false);
        }
    };

    const handleUserDataChange = (e) => {
        const { name, value } = e.target;
        setUserData({...userData, [name]: value});
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData({...passwordData, [name]: value});
    };

    const handleUserDataSubmit = (e) => {
        e.preventDefault();
        // Handle form submission
        console.log('Updated user data:', userData);
        // Add API call to update user data
    };

    const handlePasswordSubmit = (e) => {
        e.preventDefault();
        // Handle password change submission
        console.log('Password change request:', passwordData);
        // Add API call to update password
        
        // Reset password fields after submission
        setPasswordData({
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
        });
    };

    const isEdited = () => {
        if (!originalUserData) return false;
    
        const isChanged = (
            userData.username !== originalUserData.username ||
            userData.firstName !== originalUserData.firstName ||
            userData.lastName !== originalUserData.lastName ||
            userData.role !== originalUserData.role
        );
    
        const hasEmptyField = (
            !userData.username.trim() ||
            !userData.firstName.trim() ||
            !userData.lastName.trim() ||
            !userData.role.trim()
        );
    
        return isChanged && !hasEmptyField;
    };

    const updateAccount = async () => {
        const result = await Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#54CB58",
            cancelButtonColor: "#94152b",
            confirmButtonText: "Yes, update!"
        });
    
        if (!result.isConfirmed) return;
    
        try {
            await axios.put(`https://api.tuplrc-cla.com/api/user/update/${userId}`, userData);
    
            await Swal.fire({
                title: "Updated!",
                text: "Your account has been updated.",
                icon: "success",
                confirmButtonColor: "#54CB58"
            });
    
            window.location.reload();
        } catch (error) {
            console.error("Cannot update account:", error);
            Swal.fire({
                title: "Error!",
                text: "There was a problem updating your account.",
                icon: "error",
                confirmButtonColor: "#94152b"
            });
        } 
    };
    
    console.log(userData)

    return (
        <div className='profilepage bg-light'>
            <div>
                <AdminNavbar />
            </div>
            <div>
                <AdminTopNavbar />
                <div className="settings-container">
                    <div className="settings-sidebar">
                        <div className="settings-menu">
                            <a 
                                href="#" 
                                className={`menu2 ${activeTab === 'account' ? 'active' : ''}`}
                                onClick={(e) => {
                                    e.preventDefault();
                                    setActiveTab('account');
                                }}
                            >
                                <FontAwesomeIcon icon={faUser} className="menuicon" />
                                <span>Account Details</span>
                                <FontAwesomeIcon icon={faChevronRight} className="arrow-icon" />
                            </a>
                            <a 
                                href="#" 
                                className={`menu2 ${activeTab === 'password' ? 'active' : ''}`}
                                onClick={(e) => {
                                    e.preventDefault();
                                    setActiveTab('password');
                                }}
                            >
                                <FontAwesomeIcon icon={faLock} className="menuicon" />
                                <span>Change Password</span>
                                <FontAwesomeIcon icon={faChevronRight} className="arrow-icon" />
                            </a>
                        </div>
                    </div>
                    
                    <div className="settings-content">
                        {activeTab === 'account' ? (
                            <>
                                <h1 className="settings-title">Account Settings</h1>
                                
                                <form onSubmit={handleUserDataSubmit} className="settings-form">
                                    <div className="form-group">
                                        <label htmlFor="username">Username</label>
                                        <input 
                                            type="text" 
                                            id="username" 
                                            name="username" 
                                            value={userData.username} 
                                            onChange={handleUserDataChange} 
                                            className={`form-control ${!usernameValid ? 'is-invalid' : ''}`}
                                        />
                                        {!usernameValid && (
                                            <div className="invalid-feedback">
                                                Username is already taken.
                                            </div>
                                        )}
                                    </div>
                                    
                                    <div className="form-group">
                                        <label htmlFor="firstName">First name</label>
                                        <input 
                                            type="text" 
                                            id="firstName" 
                                            name="firstName" 
                                            value={userData.firstName} 
                                            onChange={handleUserDataChange} 
                                            className="form-control text-capitalize"
                                        />
                                    </div>
                                    
                                    <div className="form-group">
                                        <label htmlFor="lastName">Last name</label>
                                        <input 
                                            type="text" 
                                            id="lastName" 
                                            name="lastName" 
                                            value={userData.lastName} 
                                            onChange={handleUserDataChange} 
                                            className="form-control text-capitalize"
                                        />
                                    </div>
                                    
                                    <div className="form-group">
                                        <label htmlFor="role">Role</label>
                                        <input 
                                            type="text" 
                                            id="role" 
                                            name="role" 
                                            value={userData.role}
                                            className="form-control text-capitalize"
                                            disabled
                                        />
                                    </div>
                                    
                                    <div className="form-actions">
                                        <button 
                                            type="submit" 
                                            className="btn-save" 
                                            disabled={!isEdited()}
                                            onClick={updateAccount}
                                            >
                                            Save Changes
                                        </button>
                                    </div>
                                </form>
                            </>
                        ) : (
                            <>
                                <h1 className="settings-title">Change Password</h1>
                                
                                <form onSubmit={handlePasswordSubmit} className="settings-form">
                                    <div className="form-group">
                                        <label htmlFor="currentPassword">Current Password</label>
                                        <input 
                                            type="password" 
                                            id="currentPassword" 
                                            name="currentPassword" 
                                            value={passwordData.currentPassword} 
                                            onChange={handlePasswordChange} 
                                            className="form-control"
                                            required
                                        />
                                    </div>
                                    
                                    <div className="form-group">
                                        <label htmlFor="newPassword">New Password</label>
                                        <input 
                                            type="password" 
                                            id="newPassword" 
                                            name="newPassword" 
                                            value={passwordData.newPassword} 
                                            onChange={handlePasswordChange} 
                                            className="form-control"
                                            required
                                        />
                                    </div>
                                    
                                    <div className="form-group">
                                        <label htmlFor="confirmPassword">Confirm New Password</label>
                                        <input 
                                            type="password" 
                                            id="confirmPassword" 
                                            name="confirmPassword" 
                                            value={passwordData.confirmPassword} 
                                            onChange={handlePasswordChange} 
                                            className="form-control"
                                            required
                                        />
                                    </div>
                                    
                                    <div className="form-actions">
                                        <button 
                                            type="submit" 
                                            className="btn-save"
                                            
                                        >
                                            Update Password
                                        </button>
                                    </div>
                                </form>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profile;