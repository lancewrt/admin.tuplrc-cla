import React, { useEffect, useState } from 'react'
import ReactDom from 'react-dom'
import './EditUserModal.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faX} from '@fortawesome/free-solid-svg-icons'
import axios from 'axios'
import { checkEmail, checkIfVerified, isEdited, validateEmail, validateUsername, verifyEmail, isCreate } from '../../functions/profileFunctions'

const EditUserModal = ({open, close, account, originalAccount, handleChange, error, save, title, loading, isCreate}) => {
    const [roles, setRoles] = useState([])
    const [usernameValid, setUsernameValid] = useState(true);
    const [usernameChecking, setUsernameChecking] = useState(false);
    const [emailError, setEmailError] = useState('');
    const [isEmailExist, setIsEmailExist] = useState(false);
    const [isEmailValid, setIsEmailValid] = useState(false);
    const [isEmailVerified,setIsEmailVerified] = useState(true);
    const [token,setToken] = useState(null)
    const [sendingLoading, setSendingLoading] = useState(false)

    // if token exist, constantly check if email has been verified
    useEffect(() => {
        if(isCreate) return
        if (!token && !account.username) return;
    
        // Set up an interval to check periodically (every 5 seconds)
        const intervalId = setInterval(() => {
            checkIfVerified(token, account.username,setIsEmailVerified);
        }, 5000);
            
        // Clean up interval on component unmount
        return () => clearInterval(intervalId);
    }, [token]);
    
    // everytime username changes, check is username exist
      useEffect(() => {
        if (!account.username?.trim() || account.username === originalAccount?.username) {
                  setUsernameValid(true);
                  return;
              }
          
              const delayDebounce = setTimeout(() => {
                  validateUsername(account.username, account.userId,setUsernameChecking,setUsernameValid);
              }, 500); // debounce
          
              return () => clearTimeout(delayDebounce);
    }, [account, originalAccount]);  

    // everytime email changes, check if email is valid, exist or verified
    useEffect(() => {
        if(isCreate) return
        if (!account.email && !account.userId ) return;
        setEmailError('');
        setIsEmailValid(false);
        setIsEmailVerified(true);

        if(account.email==originalAccount.email) return
        
        const delayDebounce = setTimeout(() => {
            if (validateEmail(account.email)) {
                checkEmail(account.email, account.userId, setIsEmailExist, setEmailError, setIsEmailValid, setIsEmailVerified, account, originalAccount);
            } else {
                setEmailError('Invalid email format');
            }
        }, 500); // Wait 500ms after user stops typing
        
        return () => clearTimeout(delayDebounce); // Clean up on new keystroke
    }, [account]);

    useEffect(()=>{
        getRole()
    },[])

    const getRole = async()=>{
        try{
            const response = await axios.get('https://api.tuplrc-cla.com/api/data/roles')
            console.log(response)
            setRoles(response.data)
        }catch(err){
            console.log('Cannot retrieve roles. An error occurred: ', err.message)
        }
    }

    const closeModal = ()=>{
        setEmailError('');
        setIsEmailExist(false);
        setIsEmailValid(false);
        setIsEmailVerified(true);
        setToken(null);
        close()
    }
    
    console.log(account)
    console.log('isEmailVerified? ', isEmailVerified)
    if(!open){
        return null
    }

  return ReactDom.createPortal(
    <div className='edit-u-modal-container'>
        {/* overlay */}
        <div className="edit-u-modal-overlay overlay"></div>

        {/* modal box */}
        <div className="edit-u-modal-box">
           {/* header */}
           <div className="d-flex justify-content-between p-4">
            <h4>{title}</h4>
            <FontAwesomeIcon icon={faX} onClick={close} />
           </div>

            <div className="row px-4 gy-3">
                <div className="col-12 form-floating">
                    <input 
                        type="text" 
                        className={`form-control ${error.fname ? 'is-invalid' : ''}`} 
                        id='firstName' 
                        name='firstName' 
                        placeholder='' 
                        value={account?.firstName} 
                        onChange={handleChange}
                    />
                    <label htmlFor="firstName" className='ms-2'>
                        First Name
                    </label>
                    <p className="invalid-feedback m-0">{error.firstName}</p>
                </div>
                <div className="col-12 form-floating">
                    <input 
                        type="text" 
                        className={`form-control ${error.lname ? 'is-invalid' : ''}`} 
                        id='lastName' 
                        name='lastName' 
                        placeholder='' 
                        value={account&&account.lastName} 
                        onChange={handleChange}
                    />
                    <label htmlFor="lastName" className='ms-2'>Last Name</label>
                    <p className="invalid-feedback m-0">{error.lastName}</p>
                </div>
                <div className="col-12 form-floating">
                    <input 
                        type="text" 
                        className={`form-control ${!usernameValid ? 'is-invalid' : ''}`}
                        id='username' 
                        name='username' 
                        placeholder=''
                        value={account&&account.username}
                        onChange={handleChange}
                    />
                    <label htmlFor="username" className='ms-2'>Username</label>
                    <p className="invalid-feedback m-0">{error.username}</p>
                    {!usernameValid && !isCreate && (
                        <div className="invalid-feedback">
                            Username is already taken.
                        </div>
                    )}
                </div>
                <div className="col-12 form-floating">
                    <input 
                        type="text" 
                        className={`form-control ${emailError ? 'is-invalid' : ''}`}
                        id='email' 
                        name='email' 
                        placeholder='' 
                        value={account&&account.email} 
                        onChange={handleChange}
                    />
                    <label htmlFor="email" className='ms-2'>Email</label>
                    {!isEmailExist && isEmailValid && !isEmailVerified && !isCreate && (
                        <button 
                            type="button"
                            className="btn btn-success mt-1 verify"
                            onClick={()=>verifyEmail(setSendingLoading, account, setToken)}
                        >
                            {sendingLoading?'Sending':'Verify now'}
                        </button>
                    )}
                    {isEmailValid && isEmailVerified && !isCreate &&(
                        <div className="text-success mt-1 verified">
                            Your email is verified
                        </div>
                    )}
                    {emailError && !isCreate &&(
                        <div className="invalid-feedback">
                            {emailError}
                        </div>
                    )}
                </div>
                <div className="col-12 form-floating">
                    <select 
                        name="role_id" 
                        id="role_id" 
                        className={`form-control ${error.role ? 'is-invalid' : ''}`} 
                        onChange={handleChange}
                    >
                        <option value="" disabled selected>Select role</option>
                        {roles.length>0?roles.map(item=>{
                            return <option 
                                value={item.role_id} 
                                selected={account&&item.role_id==account.role_id}>
                                    {item.role_name}
                                </option>
                        }):''}
                    </select>
                    <label htmlFor="" className='ms-2'>Role</label>
                    <p className="invalid-feedback m-0">{error.role_id}</p>
                </div>
            </div>
            <div className="d-flex justify-content-center gap-1 mt-4">
                <button 
                    className="btn cancel-btn" 
                    onClick={closeModal}
                >
                    Cancel
                </button>
                <button 
                    type="button"
                    className="btn create-btn" 
                    onClick={save}
                    disabled={!isCreate?!isEdited(account,originalAccount,isEmailVerified) || !usernameValid || !!emailError || !isEmailVerified:false}
                >
                    {!loading?'Confirm':'Loading...'}
                </button>
            </div>
            
        </div>      
    </div>,
    document.getElementById('portal')
  )
}

export default EditUserModal
