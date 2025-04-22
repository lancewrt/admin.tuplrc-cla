import Swal from 'sweetalert2'
import axios from'axios' 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp, faArrowDown, faArrowUpWideShort } from '@fortawesome/free-solid-svg-icons';

// Activate user
export const activateUser = async (username, id, setLoading, uname) => {
    const result = await Swal.fire({
      title: "Are you sure",
      text: `You want to activate '${username}'?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#54CB58",
      cancelButtonColor: "#94152b",
      confirmButtonText: "Yes, activate!"
    });

    if (!result.isConfirmed) return; // Exit if user cancels

    setLoading(true);
    try {
      const response = await axios.put(`https://api.tuplrc-cla.com/api/account/activate/${id}`, {uname});
      const result2 = await Swal.fire({
        title: "Activated!",
        text: `${username} activated successfully.`,
        icon: "success"
      });

      if(result2.isConfirmed){
        window.location.reload()
      }

    } catch (err) {
      console.log('Cannot activate user. An error occurred: ', err.message);
    } finally {
      setLoading(false);
    }
  };

// Deactivate user
export const deactivateUser = async (username, id, setLoading, uname) => {

    const result = await Swal.fire({
          title: "Are you sure",
          text: `You want to deactivate '${username}'?`,
          icon: "question",
          showCancelButton: true,
          confirmButtonColor: "#54CB58",
          cancelButtonColor: "#94152b",
          confirmButtonText: "Yes, deactivate!"
    });

    if (!result.isConfirmed) return; // Exit if user cancels

    setLoading(true);
    try {
      console.log('account: ', uname);
      const loggedin = JSON.parse(localStorage.getItem('token'));
      console.log('loggedin: ', loggedin);

      const response = await axios.put(`https://api.tuplrc-cla.com/api/account/deactivate/${id}`, {uname});
      const result2 = await Swal.fire({
        title: "Deactivated!",
        text: `${username} deactivated successfully.`,
        icon: "success"
      });

      if(result2.isConfirmed){
        window.location.reload()
      }
      
    } catch (err) {
      console.log('Cannot deactivate user. An error occurred: ', err.message);
    } finally {
      setLoading(false);
    }
  };

// fetch all user account
export const userAccounts = async (setAccounts,setFilteredAccounts,username) => {
    try {
      const response = await axios.get('https://api.tuplrc-cla.com/api/account');
      if (response.data) {
        setAccounts(response.data);
        setFilteredAccounts(response.data)
      }
      console.log(response);
    } catch (err) {
      console.log('Cannot get accounts. An error occurred: ', err.message);
    } 
};

// get all info of user u want to edit
// Get account to be edited
export const getToEdit = async (id,setAccount,setOriginalAccount,username) => {
  console.log(id)
      try {
        const response = await axios.get(`https://api.tuplrc-cla.com/api/account/${id}`);
        const result = {
          userId: response.data[0].staff_id,
          username: response.data[0].staff_uname,
          firstName: response.data[0].staff_fname,
          lastName: response.data[0].staff_lname,
          role: response.data[0].role_name,
          role_id: response.data[0].role_id,
          email: response.data[0].staff_email,
          status: response.data[0].staff_status,
          uname: username,
        };
        setAccount(result);
        setOriginalAccount(result)
      } catch (err) {
        console.log('Cannot get account to be edited. An error occurred: ', err.message);
      }
};

const appendToAccount = (key, value, setAccount) => {
    setAccount((prevAccount) => ({
        ...prevAccount,
        [key]: value, 
    }));
};

// save invitation
export const saveInvitation = async (uname,setLoading,setOpenCreateUser,setAccount,account,setError) => {
    await appendToAccount('uname', uname, setAccount);
    const isValid = await formValidation(account,setError);
  
    if (!isValid) return;
  
    const result = await Swal.fire({
      title: "Are you sure",
      text: "You want to send an activation link to this user?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#54CB58",
      cancelButtonColor: "#94152b",
      confirmButtonText: "Yes, send!"
    });
  
    if (!result.isConfirmed) return;
  
    setLoading(true);
  
    try {
      const response = await axios.post(
        'https://api.tuplrc-cla.com/api/account/invite',
        account, // This is the request body (data sent to server)
        {
          params: { uname: uname } // This becomes a query string like ?uname=whatever
        }
      );
      console.log("Invite sent:", response.data);
  
      setOpenCreateUser(false);
      const result2 = await Swal.fire({
        title: "Activation Link Sent!",
        text: "You successfully sent an activation link.",
        icon: "success",
        confirmButtonColor: "#54CB58",
      });
  
      // Reset form after success
      setAccount({
        userId: '',
        username: '',
        firstName: '',
        lastName: '',
        role: '',
        role_id:'',
        email:'',
        status:''
      });
  
      if (result2.isConfirmed) {
        window.location.reload();
      }
    } catch (err) {
      console.log('Cannot create account. An error occurred:', err.message);
      await axios.delete('https://api.tuplrc-cla.com/api/account/delete-invite', {
        params: { email: account.email }
      });
      await Swal.fire({
        title: "Failed",
        text: "Something went wrong. Try again.",
        icon: "error",
        confirmButtonColor: "#94152b"
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Form validation for creating user account
  const formValidation = async (account,setError) => {
    const err = {}; // Fresh object to collect errors
  
    if (!account.firstName) err.firstName = 'Enter first name';
    if (!account.lastName) err.lastName = 'Enter last name';
    if (!account.role_id) err.role_id = 'Choose a role';
  
    // Email validation
    if (!account.email) {
      err.email = 'Enter email address';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(account.email)) {
        err.email = 'Enter a valid email address';
      } else {
        // only call API if the format is correct
        try {
          const response = await axios.get('https://api.tuplrc-cla.com/api/account/check-email', {
            params: { email: account.email }
          });          
          const error = response.data.error || '';
    
          if (error !== '') {
            err.email = error;
          }
        } catch (error) {
          console.log('Cannot check if email exists. An error occurred:', error);
        }
      }
    }    

    //verify username 
    if (!account.username){
      err.username = 'Enter username';
    }else{
      try {
        const response = await axios.get('https://api.tuplrc-cla.com/api/account/check-uname', {
          params: { username: account.username }
        });

        console.log(response)

        if(response.data.length>0){
          err.username = 'Username already exist'
        }
      } catch (error) {
        console.log('Cannot check if username exist. An error occurred: ', error)
      }
    }
  
    setError(err); // Update error state
  
    return Object.keys(err).length === 0; // Return true if no errors exist
  };

// Modify the clearFilter method
export const clearFilter = (setSortStates,setKeyword,setFilteredAccounts,accounts) => {
    // Reset sortStates
    setSortStates({
      staff_fname: 0, 
      staff_lname: 0, 
      staff_uname: 0, 
      role_name: '',
      staff_status: ''
    });

    // Reset other filtering
    setKeyword('');
    setFilteredAccounts(accounts);
  };

// search
export const handleSearch = (keyword,setFilteredAccounts,accounts) => {
  console.log(keyword)
    if (!keyword.trim()) {
      setFilteredAccounts(accounts);
      return;
    }
  
    const filtered = accounts.filter(account =>
      account.firstName.toLowerCase().includes(keyword.toLowerCase()) ||
      account.lastName.toLowerCase().includes(keyword.toLowerCase()) ||
      account.username.toLowerCase().includes(keyword.toLowerCase()) ||
      account.role.toLowerCase().includes(keyword.toLowerCase()) ||
      account.status.toLowerCase().includes(keyword.toLowerCase())
    );

    console.log(filtered)
  
    setFilteredAccounts(filtered);
};

// New function to handle sort icon clicks
export const handleSortClick = (column,sortStates,setSortStates,accounts,setFilteredAccounts) => {
    // Determine the new sort state (0 = unsorted, 1 = ascending, 2 = descending)
    const currentState = sortStates[column];
    const newState = currentState === 2 ? 0 : currentState + 1;
    
    // Reset other sort states
    const newSortStates = { firstName: 0, lastName: 0, username: 0, status: 0, role: 0 };
    newSortStates[column] = newState;
    setSortStates(newSortStates);
  
    // Sort the accounts
    let sortedAccounts = [...accounts];
  
    if (newState === 1) {
      // Sort ascending (A-Z)
      sortedAccounts.sort((a, b) => a[column].localeCompare(b[column]));
    } else if (newState === 2) {
      // Sort descending (Z-A)
      sortedAccounts.sort((a, b) => b[column].localeCompare(a[column]));
    } else {
      // Reset to original order by refetching data
      userAccounts();
      return;
    }
  
    setFilteredAccounts(sortedAccounts);
};

export const handleFilterDropdown = (e,setSortStates)=>{
    const {name, value} = e.target;

    setSortStates((prev)=>({
      ...prev,
      [name]:value
    }))
}

// Change page
export const nextPage = (currentPage,totalPages,setCurrentPage) => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

export const prevPage = (currentPage,setCurrentPage) => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
};

// Helper to get the right icon based on sort state
export const getSortIcon = (column, sortStates) => {
    switch (sortStates[column]) {
      case 1:
        return <FontAwesomeIcon icon={faArrowUp} className='ms-2'/>;
      case 2:
        return <FontAwesomeIcon icon={faArrowDown} className='ms-2'/>;
      default:
        return <FontAwesomeIcon icon={faArrowUpWideShort} className='ms-2'/>;
    }
};

// Handle input changes for account creation
export const handleChange = (e, setAccount) => {
    const { name, value } = e.target;
    setAccount((prevData) => ({
      ...prevData,
      [name]: value
    }));
};


// get role
