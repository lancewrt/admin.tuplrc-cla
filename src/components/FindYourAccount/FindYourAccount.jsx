import React, { useState } from 'react'
import '../../assets/styles/globals.css';

const FindYourAccount = ({setEmail, search, error}) => {
  return (
    <div className='find-account rounded shadow-sm'>
        {/* header */}
        <div className="header p-3 fs-5 fw-semibold border-bottom border-light-subtle">
            Find your account
        </div>
        {/* body */}
        <div className="body px-3 py-4 fs-6">
            {error?
            <div className="alert alert-danger" role="alert">
                {error}
            </div>:''}
            <p>Please enter your email to search for your account.</p>
            <input 
                type="text"
                className='form-control mt-1'
                placeholder='Email'
                name='email'
                onChange={(e)=>setEmail(e.target.value)}
            />
        </div>
        {/* buttons */}
        <div className="buttons p-3 d-flex justify-content-end gap-1 border-top border-light-subtle">
            <button className="btn btn-secondary">Cancel</button>
            <button 
                className="btn lrc-btn"
                onClick={search}
            >
                Search
            </button>
        </div>
    </div>
  )
}

export default FindYourAccount
