import React from 'react'
import tuplogo from '../../assets/tuplogo.png'
import clalogo from '../../assets/clalogo.png'
import './AdminLogIn.css'
import AdminFooter from '../AdminFooter/AdminFooter'

const AdminLogIn = () => {
  return (
    <div className='adminlogin-container'>
        {/* overlay */}
        <div className="admin-overlay"></div>

        {/* log in box */}
        <div className="login-box">
            <div className="logos-heading">
                {/* logos */}
                <div className="logos">
                    <img src={tuplogo} alt="tup-logo" />
                    <img src={clalogo} alt="cla-log" />
                </div>
                {/* heading */}
                <div className="heading">
                    <p className='heading-text heading-cla'>College of Liberal Arts</p>
                    <p className='heading-text heading-lrc'>Learning Resource Center</p>
                </div>
                
            </div>
            

            {/* login form */}
            <div className="login-form-box">
                {/* username label and input */}
                <div className="admin-input-box">
                    <label htmlFor="username" className='admin-label'>Username</label>
                    <input type="text" placeholder='Enter username' id='username'className='admin-input'/>
                </div>
                {/* password label and input */}
                <div className="admin-input-box">
                    <label htmlFor="password"className='admin-label'>Password</label>
                    <input type="text" placeholder='Enter password'id='password'className='admin-input'/>
                </div>
            </div>

            {/* login button */}
            <button type='submit' className='login-button'>Login</button>
        </div>

        <AdminFooter/>
    </div>
  )
}

export default AdminLogIn
