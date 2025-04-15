import React, { useEffect, useState } from 'react'
import ReactDom from 'react-dom'
import './EditUserModal.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faX} from '@fortawesome/free-solid-svg-icons'
import axios from 'axios'

const EditUserModal = ({open, close, account, handleChange, error, save, title,loading}) => {
    const [roles, setRoles] = useState([])

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

    console.log(account)
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
                    <input type="text" className={`form-control ${error.fname ? 'is-invalid' : ''}`} id='fname' name='fname' placeholder='' value={account?.fname} onChange={handleChange}/>
                    <label htmlFor="fname" className='ms-2'>First Name</label>
                    <p className="invalid-feedback m-0">{error.fname}</p>
                </div>
                <div className="col-12 form-floating">
                    <input type="text" className={`form-control ${error.lname ? 'is-invalid' : ''}`} id='lname' name='lname' placeholder='' value={account&&account.lname} onChange={handleChange}/>
                    <label htmlFor="lname" className='ms-2'>Last Name</label>
                    <p className="invalid-feedback m-0">{error.lname}</p>
                </div>
                <div className="col-12 form-floating">
                    <input type="text" className={`form-control ${error.uname ? 'is-invalid' : ''}`} id='uname' name='uname' placeholder='' value={account&&account.uname} onChange={handleChange}/>
                    <label htmlFor="uname" className='ms-2'>Username</label>
                    <p className="invalid-feedback m-0">{error.uname}</p>
                </div>
                <div className="col-12 form-floating">
                    <input type="text" className={`form-control ${error.email ? 'is-invalid' : ''}`} id='email' name='email' placeholder='' value={account&&account.email} onChange={handleChange}/>
                    <label htmlFor="email" className='ms-2'>Email</label>
                    <p className="invalid-feedback m-0">{error.email}</p>
                </div>
                <div className="col-12 form-floating">
                    <select name="role" id="role" className={`form-control ${error.role ? 'is-invalid' : ''}`} onChange={handleChange}>
                        <option value="" disabled selected>Select role</option>
                        {roles.length>0?roles.map(item=>{
                            return <option value={item.role_id} selected={account&&item.role_id==account.role}>{item.role_name}</option>
                        }):''}
                    </select>
                    <label htmlFor="" className='ms-2'>Role</label>
                    <p className="invalid-feedback m-0">{error.role}</p>
                </div>
            </div>
            <div className="d-flex justify-content-center gap-1 mt-4">
                <button 
                    className="btn cancel-btn" 
                    onClick={close}
                >
                    Cancel
                </button>
                <button 
                    className="btn create-btn" 
                    onClick={save}
                    disabled={loading}
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
