import axios from'axios' 
import Swal from 'sweetalert2'

export const validateUsername = async (username,userId,setUsernameChecking,setUsernameValid) => {
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

export const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
}

export const checkEmail = async (email, userId, setIsEmailExist, setEmailError, setIsEmailValid, setIsEmailVerified, userData, originalUserData) => {
    console.log(userData)
    console.log(originalUserData)
    try {
        const response = await axios.get(
            `https://api.tuplrc-cla.com/api/user/check-email/${email}?excludeId=${userId}`
    );
      
        setIsEmailExist(response.data.exists);
        setEmailError(response.data.error || '');
        setIsEmailValid(userData.email !== originalUserData.email);
        setIsEmailVerified(response.data.verified)
    } catch (error) {
        console.error('Email validation error:', error);
    }
};

export const verifyEmail = async (setSendingLoading, userData, setToken) => {
    setSendingLoading(true)
    try {
        const response = await axios.post(`https://api.tuplrc-cla.com/api/user/verify-email`, userData);

        console.log(response)
        if (response.data.token) {
            setToken(response.data.token);
        }

        if(response.data.isSent){
            Swal.fire({
                title: "Verification Email Sent!",
                text: "Please check your email inbox to complete verification.",
                icon: "success",
                confirmButtonColor: "#54CB58"
            });
        }
    } catch (error) {
        console.log('Cannot verify email. An error occurred: ', error);
          
        Swal.fire({
            title: "Error!",
            text: "There was a problem sending the verification email.",
            icon: "error",
            confirmButtonColor: "#94152b"
          });
    }finally{
        setSendingLoading(false)
    }
};

export const checkIfVerified = async (token,username, setIsEmailVerified) => {
    console.log(token)
    console.log(username)
    try {
      const res = await axios.get("https://api.tuplrc-cla.com/api/user/check-verified", {
        params: { token: token, username:username }
      });

      console.log(res)
      
      if (res.status === 200) {
        setIsEmailVerified(true);
      }
    } catch (err) {
      console.log('Cannot check if email is verified: ', err);
    } 
  };

export const isEdited = (userData, originalUserData, isEmailVerified) => {
    if (!userData || !originalUserData) return false;

    console.log('isEdited');
  

    const isChanged = (
        userData.username !== originalUserData.username ||
        userData.firstName !== originalUserData.firstName ||
        userData.lastName !== originalUserData.lastName ||
        userData.email !== originalUserData.email ||
        userData.role !== originalUserData.role
    );

    const hasEmptyField = (
        !userData.username?.trim() ||
        !userData.firstName?.trim() ||
        !userData.lastName?.trim() ||
        !userData.role?.trim()
    );

    console.log(isChanged && !hasEmptyField && isEmailVerified)
    return isChanged && !hasEmptyField;
};


export const updateAccount = async (userId, userData) => {
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