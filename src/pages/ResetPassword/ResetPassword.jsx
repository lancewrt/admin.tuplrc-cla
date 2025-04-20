import React, { useState } from 'react'
import './ResetPassword.css'
import FindYourAccount from '../../components/FindYourAccount/FindYourAccount'
import axios from 'axios';
import AccountsFound from '../../components/AccountsFound/AccountsFound';
import Swal from 'sweetalert2'

const ResetPassword = () => {
    const [email,setEmail] = useState(''); 
    const [account, setAccount] = useState([]);
    const [emailError, setEmailError] = useState('');
    const [loading, setLoading] = useState(false);
    
    const handleSearch = async ()=>{
        setEmailError('')
        try {
            const response = await axios.get(`https://api.tuplrc-cla.com/api/user/search-email`,{
                params: {email:email}
            })

            console.log(response.data[0])
            setAccount(response.data[0])
        } catch (error) {
            console.log('Cannot search email. An error occurred: ', error)
            setEmailError(error.response.data.message)
        }
    }

    const resetPassword = async ()=>{
        setLoading(true)
        try {
            const response = await axios.post('https://api.tuplrc-cla.com/api/account/reset-password',{
                email: account.staff_email,
                firstName: account.staff_fname
            })

            if(response.data.isSent){
                Swal.fire({
                    title: "Verification Email Sent!",
                    text: "Please check your email inbox to complete verification.",
                    icon: "success",
                    confirmButtonColor: "#54CB58"
                });
            }
        } catch (error) {
            console.log('Cannot send reset link. ', error)
        } finally{
            setLoading(false)
        }
    }

    console.log(account)

  return (
    <div className='reset-password-page'>
      {/* find your account by email */}
      {account.length==0?
      <FindYourAccount setEmail={setEmail} search={handleSearch} error={emailError}/>:
      <AccountsFound account={account} setAccount={setAccount} resetPassword={resetPassword} loading={loading}/>}
      

      {/* display found account */}

    </div>
  )
}

export default ResetPassword
