import React, { useEffect, useState } from 'react';
import './Accounts.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faUser, faPen, faUserSlash, faArrowLeft, faArrowRight, faSearch, faArrowUp, faArrowDown, faArrowUpWideShort, faExclamationCircle, faXmarkCircle } from '@fortawesome/free-solid-svg-icons';
import EditUserModal from '../EditUserModal/EditUserModal';
import DeactivateModal from '../DeactivateModal/DeactivateModal';
import ActivateModal from '../ActivateModal/ActivateModal';
import { useSelector } from 'react-redux';
import { activateUser, clearFilter, deactivateUser, getSortIcon, getToEdit, handleChange, handleEdit, handleFilterDropdown, handleSearch, handleSortClick, nextPage, prevPage, saveInvitation, userAccounts } from '../../functions/accountsFunctions';
import { updateAccount, validateUsername } from '../../functions/profileFunctions';

const Accounts = () => {
  // const [staffUname, setStaffUname] = useState(null);
  const uname = useSelector(state=>state.username.username)
  const [openCreateUser, setOpenCreateUser] = useState(false);
  const [openEditUser, setEditUser] = useState(false);
  const [openDeactivate, setOpenDeactivate] = useState(false);
  const [openActivate, setOpenActivate] = useState(false);
  const [accounts, setAccounts] = useState([]);
  const [filteredAccounts, setFilteredAccounts] = useState([]);
  const [account, setAccount] = useState({
    userId: '',
    username: '',
    firstName: '',
    lastName: '',
    role: '',
    role_id:'',
    email:'',
    status:''
  });
  const [originalAccount, setOriginalAccount] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({});
  const [selectedUname, setSelectedUname] = useState('');
  const [keyword, setKeyword] = useState('');
  // New state to track sort directions
  const [sortStates, setSortStates] = useState({
    firstName: 0, // 0 = unsorted, 1 = ascending (A-Z), 2 = descending (Z-A)
    lastName: 0,
    username: 0,
    role:0,
    status:0
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

  // Reset current page when filtered accounts change
  useEffect(() => {
    setCurrentPage(1);
  }, [filteredAccounts]);

  useEffect(()=>{
    if(keyword==''){
      userAccounts(setAccounts,setFilteredAccounts,uname);
    }
  },[keyword])

  useEffect(() => {
    let filteredResults = accounts;

    // Apply role filter if selected
    if (sortStates.role) {
      filteredResults = filteredResults.filter(
        item => item.role.toLowerCase() === sortStates.role.toLowerCase()
      );
    }

    // Apply status filter if selected
    if (sortStates.status) {
      filteredResults = filteredResults.filter(
        item => item.status.toLowerCase() === sortStates.status.toLowerCase()
      );
    }

    // Set filtered accounts
    setFilteredAccounts(filteredResults);
  }, [sortStates.role, sortStates.status, accounts]);

  console.log(filteredAccounts)

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
              handleSearch(keyword,setFilteredAccounts,accounts)
            }
          }}
        />
        <button className="btn search-btn px-3 shadow-sm" onClick={()=>handleSearch(keyword,setFilteredAccounts,accounts)} >
          <FontAwesomeIcon icon={faSearch} />
        </button>
        <button 
          className="btn btn-outline-secondary d-flex gap-2 justify-content-center align-items-center ms-2" 
          onClick={()=>clearFilter(setSortStates,setKeyword,setFilteredAccounts,accounts)}
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
            userId: null,
            username: '',
            firstName: '',
            lastName: '',
            role: '',
            role_id:'',
            email:'',
            status:''
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
              <span className="sort-icon" onClick={() => handleSortClick('firstName',sortStates,setSortStates,accounts,setFilteredAccounts)}>
                {getSortIcon('firstName',sortStates)}
              </span>
            </td>
            <td>
              Last Name
              <span className="sort-icon" onClick={() => handleSortClick('lastName',sortStates,setSortStates,accounts,setFilteredAccounts)}>
                {getSortIcon('lastName',sortStates)}
              </span>
            </td>
            <td>
              Username
              <span className="sort-icon" onClick={() => handleSortClick('username',sortStates,setSortStates,accounts,setFilteredAccounts)}>
                {getSortIcon('username',sortStates)}
              </span>
            </td>
            <td>
              Role
              <select name="role" id="" className='sort' onChange={(e)=>handleFilterDropdown(e,setSortStates)}>
                  <option value="" disabled selected></option>
                  <option value="admin">Admin</option>
                  <option value="staff">Staff</option>
              </select>
            </td>
            <td>
              Status
              <select name="status" id="" className='sort' onChange={(e)=>handleFilterDropdown(e,setSortStates)}>
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
            <tr key={item.userId}>
              <td>{item.firstName}</td>
              <td>{item.lastName}</td>
              <td>{item.username}</td>
              <td>{item.role}</td>
              <td>
                <span className={item.status=='active'?'bg-success text-light p-2 rounded fw-semibold':'bg-danger text-light p-2 rounded fw-semibold'}>{item.status}</span>
              </td>
              <td className="action">
                {/* Edit user */}
                <button 
                  className="btn edit-btn" 
                  onClick={() => {
                    setEditUser(true);
                    getToEdit(item.userId, setAccount,setOriginalAccount,uname)
                  }} 
                  title='Edit user'
                >
                  <FontAwesomeIcon icon={faPen} />
                </button>
                {/* Deactivate / Activate */}
                {item.status === 'active' ? (
                  <button 
                    className="btn deac-acc-btn" 
                    onClick={()=>
                      deactivateUser(item.username, item.userId, setLoading, uname)
                    } 
                    title='Deactivate user'>
                    <FontAwesomeIcon icon={faUserSlash} />
                  </button>
                ) : (
                  <button 
                    className="btn deac-acc-btn" 
                    onClick={()=>
                      activateUser(item.username, item.userId,setLoading,uname)
                    } 
                    title='Activate user'
                  >
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
                <button 
                  className='btn btn-outline-secondary mt-2' onClick={()=>
                  clearFilter(setSortStates,setKeyword,setFilteredAccounts,accounts)
                }>
                  Clear Filter
                </button>
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
            onClick={()=>prevPage(currentPage,totalPages,setCurrentPage)} 
            disabled={currentPage === 1}
          >
            <FontAwesomeIcon icon={faArrowLeft}/>
          </button>
          <button 
            className="btn next-btn" 
            onClick={()=>nextPage(currentPage,setCurrentPage)} 
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
            userId: null,
            username: '',
            firstName: '',
            lastName: '',
            role: '',
            role_id:'',
            email:'',
            status:''
          });
          setError({});
        }}
        title={'Create User Account'}
        account={account}
        originalAccount={originalAccount}
        handleChange={(e)=>handleChange(e,setAccount)}
        error={error}
        save={()=>saveInvitation(uname,setLoading,setOpenCreateUser,setAccount,account,setError)}
        loading={loading}
        isCreate={openCreateUser}
      />
      <EditUserModal
        open={openEditUser}
        close={() => setEditUser(false)}
        title={'Edit User Account'}
        account={account}
        originalAccount={originalAccount}
        handleChange={(e)=>handleChange(e,setAccount)}
        error={error}
        save={()=>updateAccount(account.userId, account)}
        isCreate={openCreateUser}
      />
      <DeactivateModal open={openDeactivate} close={() => setOpenDeactivate(false)} uname={selectedUname} deactivateUser={deactivateUser} />
      <ActivateModal open={openActivate} close={() => setOpenActivate(false)} uname={selectedUname} activateUser={activateUser} />
    </div>
  );
};

export default Accounts;