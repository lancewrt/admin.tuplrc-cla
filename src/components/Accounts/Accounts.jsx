import React, { useEffect, useState } from 'react';
import './Accounts.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faUser, faPen, faUserSlash, faArrowLeft, faArrowRight, faSearch, faSort, faSortUp, faSortDown, faArrowUp, faArrowDown, faArrowUpWideShort, faExclamationCircle, faXmarkCircle } from '@fortawesome/free-solid-svg-icons';
import CreateUserModal from '../CreateUserModal/CreateUserModal';
import EditUserModal from '../EditUserModal/EditUserModal';
import DeactivateModal from '../DeactivateModal/DeactivateModal';
import ActivateModal from '../ActivateModal/ActivateModal';
import axios from 'axios';
import Loading from '../Loading/Loading';
import ResourceStatusModal from '../ResourceStatusModal/ResourceStatusModal';
import Swal from 'sweetalert2'
import { useSelector } from 'react-redux';

const Accounts = () => {
  // const [staffUname, setStaffUname] = useState(null);
  const {username} = useSelector(state=>state.username)
  const [openCreateUser, setOpenCreateUser] = useState(false);
  const [openEditUser, setEditUser] = useState(false);
  const [openDeactivate, setOpenDeactivate] = useState(false);
  const [openActivate, setOpenActivate] = useState(false);
  const [accounts, setAccounts] = useState([]);
  const [filteredAccounts, setFilteredAccounts] = useState([]);
  const [account, setAccount] = useState({
    fname: '',
    lname: '',
    uname: '',
    role: '',
    email:''
  });
  const [originalAccount, setOriginalAccount] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({});
  const [selectedUname, setSelectedUname] = useState('');
  const [keyword, setKeyword] = useState('');
  
  // New state to track sort directions
  const [sortStates, setSortStates] = useState({
    staff_fname: 0, // 0 = unsorted, 1 = ascending (A-Z), 2 = descending (Z-A)
    staff_lname: 0,
    staff_uname: 0,
    role_name:0,
    role_status:0
  });

  // New state for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // Number of items to display per page

  // Paginate accounts
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentAccounts = filteredAccounts.slice(indexOfFirstItem, indexOfLastItem);

  // Calculate total pages
  const totalPages = Math.ceil(filteredAccounts.length / itemsPerPage);

  // Change page
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Reset current page when filtered accounts change
  useEffect(() => {
    setCurrentPage(1);
  }, [filteredAccounts]);
  
  useEffect(() => {
    userAccounts();
    // getUsername(); 
  }, []);

  const appendToAccount = (key, value) => {
      setAccount((prevAccount) => ({
          ...prevAccount,
          [key]: value, 
      }));
      console.log(account)
  };

  useEffect(()=>{
    if(keyword==''){
      userAccounts();
    }
  },[keyword])

  // Fetch user accounts
  const userAccounts = async () => {
    try {
      const response = await axios.get('https://api.tuplrc-cla.com/api/account');
      if (response.data) {
        setAccounts(response.data);
        setFilteredAccounts(response.data)
      }
      console.log(response);
    } catch (err) {
      console.log('Cannot get accounts. An error occurred: ', err.message);
    } finally {
      setLoading(false);
    }
  };

  // Get account to be edited
  const getToEdit = async (id) => {
      try {
        const response = await axios.get(`https://api.tuplrc-cla.com/api/account/${id}`);
        const result = {
          id: response.data[0].staff_id,
          fname: response.data[0].staff_fname,
          lname: response.data[0].staff_lname,
          uname: response.data[0].staff_uname,
          role: response.data[0].role_id,
          password: '',
          confirmPassword: '',
          username: username,
        };
        setAccount(result);
        setOriginalAccount(result)
      } catch (err) {
        console.log('Cannot get account to be edited. An error occurred: ', err.message);
      }
  };


  const saveInvitation = async () => {
    await appendToAccount('username', username);
    const isValid = await formValidation();
  
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
      const response = await axios.post('https://api.tuplrc-cla.com/api/account/invite', account);
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
        fname: '',
        lname: '',
        uname: '',
        role: '',
        email: '',
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
  const formValidation = async () => {
    const err = {}; // Fresh object to collect errors
  
    if (!account.fname) err.fname = 'Enter first name';
    if (!account.lname) err.lname = 'Enter last name';
    if (!account.role) err.role = 'Choose a role';
  
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
    if (!account.uname){
      err.uname = 'Enter username';
    }else{
      try {
        const response = await axios.get('https://api.tuplrc-cla.com/api/account/check-uname', {
          params: { uname: account.uname }
        });

        console.log(response)

        if(response.data.length>0){
          err.uname = 'Username already exist'
        }
      } catch (error) {
        console.log('Cannot check if username exist. An error occurred: ', error)
      }
    }
  
    setError(err); // Update error state
  
    return Object.keys(err).length === 0; // Return true if no errors exist
  };
  
  // Deactivate user
  const deactivateUser = async (uname, id) => {

    const result = await Swal.fire({
          title: "Are you sure",
          text: `You want to deactivate '${uname}'?`,
          icon: "question",
          showCancelButton: true,
          confirmButtonColor: "#54CB58",
          cancelButtonColor: "#94152b",
          confirmButtonText: "Yes, deactivate!"
    });

    if (!result.isConfirmed) return; // Exit if user cancels

    setLoading(true);
    try {
      console.log('account: ', username)
      const response = await axios.put(`https://api.tuplrc-cla.com/api/account/deactivate/${id}`, {username});
      const result2 = await Swal.fire({
        title: "Deactivated!",
        text: `${uname} deactivated successfully.`,
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

  // Activate user
  const activateUser = async (uname, id) => {
    const result = await Swal.fire({
      title: "Are you sure",
      text: `You want to activate '${uname}'?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#54CB58",
      cancelButtonColor: "#94152b",
      confirmButtonText: "Yes, activate!"
    });

    if (!result.isConfirmed) return; // Exit if user cancels

    setLoading(true);
    try {
      const response = await axios.put(`https://api.tuplrc-cla.com/api/account/activate/${id}`, {username});
      const result2 = await Swal.fire({
        title: "Activated!",
        text: `${uname} activated successfully.`,
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

  // Handle input changes for account creation
  const handleChange = (e) => {
    const { name, value } = e.target;
    setAccount((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleEdit = (id) => {
    setEditUser(true);
    getToEdit(id);
  };

  const handleSearch = () => {
    if (!keyword.trim()) {
      setFilteredAccounts(accounts);
      return;
    }
  
    const filtered = accounts.filter(account =>
      account.staff_fname.toLowerCase().includes(keyword.toLowerCase()) ||
      account.staff_lname.toLowerCase().includes(keyword.toLowerCase()) ||
      account.staff_uname.toLowerCase().includes(keyword.toLowerCase()) ||
      account.role_name.toLowerCase().includes(keyword.toLowerCase()) ||
      account.staff_status.toLowerCase().includes(keyword.toLowerCase())
    );
  
    setFilteredAccounts(filtered);
  };
  
  // New function to handle sort icon clicks
  const handleSortClick = (column) => {
    // Determine the new sort state (0 = unsorted, 1 = ascending, 2 = descending)
    const currentState = sortStates[column];
    const newState = currentState === 2 ? 0 : currentState + 1;
    
    // Reset other sort states
    const newSortStates = { staff_fname: 0, staff_lname: 0, staff_uname: 0, staff_status: 0, role_name: 0 };
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
  
  
  // Helper to get the right icon based on sort state
  const getSortIcon = (column) => {
    switch (sortStates[column]) {
      case 1:
        return <FontAwesomeIcon icon={faArrowUp} className='ms-2'/>;
      case 2:
        return <FontAwesomeIcon icon={faArrowDown} className='ms-2'/>;
      default:
        return <FontAwesomeIcon icon={faArrowUpWideShort} className='ms-2'/>;
    }
  };

  useEffect(() => {
    let filteredResults = accounts;

    // Apply role filter if selected
    if (sortStates.role_name) {
      filteredResults = filteredResults.filter(
        item => item.role_name.toLowerCase() === sortStates.role_name.toLowerCase()
      );
    }

    // Apply status filter if selected
    if (sortStates.staff_status) {
      filteredResults = filteredResults.filter(
        item => item.staff_status.toLowerCase() === sortStates.staff_status.toLowerCase()
      );
    }

    // Set filtered accounts
    setFilteredAccounts(filteredResults);
  }, [sortStates.role_name, sortStates.staff_status, accounts]);

  const handleFilterDropdown = (e)=>{
    const {name, value} = e.target;

    setSortStates((prev)=>({
      ...prev,
      [name]:value
    }))
  }

  // Modify the clearFilter method
  const clearFilter = () => {
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

  console.log(sortStates)

  return (
    <div className="accounts-container bg-light">
      <h1>User accounts</h1>

      {/* Search and add */}
      <div className="search-add">
        {/* Search */}
      <div className="input-group w-50 z-0">
        <input 
          type="text"
          className='form-control shadow-sm' 
          value={keyword}
          placeholder='Search'
          onChange={(e)=>setKeyword(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSearch()
            }
          }}
        />
        <button className="btn search-btn px-3 shadow-sm" onClick={handleSearch} >
          <FontAwesomeIcon icon={faSearch} />
        </button>
        <button 
          className="btn btn-outline-secondary d-flex gap-2 justify-content-center align-items-center ms-2" 
          onClick={clearFilter}
        >
          <FontAwesomeIcon icon={faXmarkCircle}/>
          Clear filter
        </button>
      </div>
      {/* Add */}
      <button 
        className="btn create-btn shadow-sm" 
        onClick={() =>{ 
          setAccount({
            fname: '',
            lname: '',
            uname: '',
            email: '',
            role: '',
          });
          setOpenCreateUser(true);
      }}>
        <FontAwesomeIcon icon={faPlus} />
        Create account
      </button>
    </div>

      {/* Accounts Table */}
      <table>
        <thead>
          <tr>
            <td>
              First Name
              <span className="sort-icon" onClick={() => handleSortClick('staff_fname')}>
                {getSortIcon('staff_fname')}
              </span>
            </td>
            <td>
              Last Name
              <span className="sort-icon" onClick={() => handleSortClick('staff_lname')}>
                {getSortIcon('staff_lname')}
              </span>
            </td>
            <td>
              Username
              <span className="sort-icon" onClick={() => handleSortClick('staff_uname')}>
                {getSortIcon('staff_uname')}
              </span>
            </td>
            <td>
              Role
              <select name="role_name" id="" className='sort' onChange={handleFilterDropdown}>
                  <option value="" disabled selected></option>
                  <option value="admin">Admin</option>
                  <option value="staff">Staff</option>
              </select>
            </td>
            <td>
              Status
              <select name="staff_status" id="" className='sort' onChange={handleFilterDropdown}>
                  <option value="" disabled selected ></option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
              </select>
            </td>
            <td>Action</td>
          </tr>
        </thead>
        <tbody>
        {currentAccounts? currentAccounts.length > 0 ? (
          currentAccounts.map((item) => (
            <tr key={item.staff_id}>
              <td>{item.staff_fname}</td>
              <td>{item.staff_lname}</td>
              <td>{item.staff_uname}</td>
              <td>{item.role_name}</td>
              <td>
                <span className={item.staff_status=='active'?'bg-success text-light p-2 rounded fw-semibold':'bg-danger text-light p-2 rounded fw-semibold'}>{item.staff_status}</span>
              </td>
              <td className="action">
                {/* Edit user */}
                <button className="btn edit-btn" onClick={() => handleEdit(item.staff_id)} title='Edit user'>
                  <FontAwesomeIcon icon={faPen} />
                </button>
                {/* Deactivate / Activate */}
                {item.staff_status === 'active' ? (
                  <button className="btn deac-acc-btn" onClick={() => deactivateUser(item.staff_uname, item.staff_id)} title='Deactivate user'>
                    <FontAwesomeIcon icon={faUserSlash} />
                  </button>
                ) : (
                  <button className="btn deac-acc-btn" onClick={() => activateUser(item.staff_uname, item.staff_id)} title='Activate user'>
                    <FontAwesomeIcon icon={faUser} />
                  </button>
                )}
              </td>
            </tr>
          ))
        ) : !loading && currentAccounts.length === 0 ? (
          <tr>
            <td colSpan="6" className='no-data-box text-center'>
              <div className='d-flex flex-column align-items-center my-5'>
                <FontAwesomeIcon icon={faExclamationCircle} className="fs-2 no-data mb-2" />
                <span className='m-0 fw-semibold'>No accounts available.</span>
                <span className='m-0'>Please try a different filter.</span>
                <button className='btn btn-outline-secondary mt-2' onClick={clearFilter}>Clear Filter</button>
              </div>
            </td>
          </tr>
        ) : (
          <tr>
            <td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>
              <div className="spinner-box">
                <div className="spinner-grow text-danger" role="status">
                  <span className="sr-only">Loading...</span>
                </div>
              </div>
            </td>
          </tr>
        ):''}
        </tbody>
      </table>


      {/* Pagination */}
      <div className="pagination">
        {/* Pages */}
        <div className="pages">
          <p className="m-0">
            Page {currentPage} of {totalPages}
          </p>
        </div>
        {/* Buttons */}
        <div className="buttons">
          <button 
            className="btn prev-btn" 
            onClick={prevPage} 
            disabled={currentPage === 1}
          >
            <FontAwesomeIcon icon={faArrowLeft}/>
          </button>
          <button 
            className="btn next-btn" 
            onClick={nextPage} 
            disabled={currentPage === totalPages}
          >
            <FontAwesomeIcon icon={faArrowRight}/>
          </button>
        </div>
      </div>

      <EditUserModal
        open={openCreateUser}
        close={() => {
          setOpenCreateUser(false);
          setAccount({
            fname: '',
            lname: '',
            uname: '',
            role: '',
            email:''
          });
          setError({});
        }}
        title={'Create User Account'}
        account={account}
        handleChange={handleChange}
        error={error}
        save={saveInvitation}
        loading={loading}
      />
 
      <DeactivateModal open={openDeactivate} close={() => setOpenDeactivate(false)} uname={selectedUname} deactivateUser={deactivateUser} />
      <ActivateModal open={openActivate} close={() => setOpenActivate(false)} uname={selectedUname} activateUser={activateUser} />
    </div>
  );
};

export default Accounts;