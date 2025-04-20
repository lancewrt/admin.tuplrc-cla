import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';
import '../../assets/styles/globals.css';

const AccountsFound = ({account,setAccount,resetPassword,loading}) => {
    console.log(account)
  return (
    <div className='find-account rounded shadow-sm'>
        {/* header */}
        <div className="header p-3 fs-5 fw-semibold border-bottom border-light-subtle">
            We found your account
        </div>
        {/* body */}
        <div className="body px-3 py-4 fs-6">
            <p>Is this you? If so, click the Proceed button to receive your reset link.</p>
            {/* account */}
            <div className='d-flex flex-column align-items-center py-2'>
                <FontAwesomeIcon icon={faUserCircle} className='text-secondary user mb-2'/>
                <p className='m-0 fw-semibold'>{account.staff_uname}</p>
                <p className='text-secondary m-0'>
                    {account.staff_fname} {account.staff_lname}
                </p>
                <p className="m-0">{account.staff_email}</p>
            </div>
        </div>
        {/* buttons */}
        <div className="buttons p-3 d-flex justify-content-end gap-1 border-top border-light-subtle">
            <button 
                className="btn btn-secondary"
                onClick={()=>setAccount([])}
            >
                This is not me
            </button>
            <button 
                className="btn lrc-btn"
                onClick={resetPassword}
            >
                {loading?'Loading...':'Proceed'}
            </button>
        </div>
    </div>
  )
}

export default AccountsFound
