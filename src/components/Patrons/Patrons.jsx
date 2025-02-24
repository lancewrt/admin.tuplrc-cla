import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Patrons.css';
import edit from '../../assets/Management System/patrons/edit-patron.svg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass,faPlus,faPen, faFile} from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

const Patrons = () => {
    const [patrons, setPatrons] = useState([]);
    const [filteredPatrons, setFilteredPatrons] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [loading,setLoading] = useState(false)
    const [userRole, setUserRole] = useState(null);
   
    useEffect(() => {
      // Fetch user role from the server via cookies (JWT stored in HttpOnly cookie)
      const fetchUserRole = async () => {
        try {
          // Request server to verify the JWT token
          const response = await axios.get('https://api.tuplrc-cla.com/api/user/check-session', { withCredentials: true });
  
          // If session is valid, set the role
          if (response.data.loggedIn) {
            setUserRole(response.data.userRole);
          } else {
            setUserRole(null); // If not logged in, clear the role
          }
        } catch (error) {
          console.error('Error verifying session:', error);
          setUserRole(null); // Set null if there's an error
        }
      };
  
      fetchUserRole();
    }, []);

    useEffect(() => {
        getPatron();
    }, []);

    const getPatron = async ()=>{
        // Fetch data from backend API
        setLoading(true)
        axios.get(`https://api.tuplrc-cla.com/api/patron`) // Replace with your backend endpoint
            .then((response) => {
                setPatrons(response.data);
                setFilteredPatrons(response.data); // Initialize filtered patrons
            })
            .catch((error) => {
                console.error('Error fetching patron data:', error);
            })
            .finally(()=>{
                setLoading(false)
            });
    }

    // Handle search input change
    const handleSearchChange = (event) => {
        const term = event.target.value.toLowerCase();
        setSearchTerm(term);
        filterPatrons(term, categoryFilter);
    };

    // Handle category filter change
    const handleCategoryChange = (event) => {
        const selectedCategory = event.target.value;
        setCategoryFilter(selectedCategory);
        filterPatrons(searchTerm, selectedCategory);
    };

    // Filter patrons based on search term and category
    const filterPatrons = (term, category) => {
        const filtered = patrons.filter((patron) => {
            const matchesSearch =
                patron.tup_id.toString().includes(term) ||
                `${patron.patron_fname} ${patron.patron_lname}`.toLowerCase().includes(term) ||
                patron.patron_email.toLowerCase().includes(term);
            const matchesCategory =
                category === '' || patron.category.toLowerCase() === category.toLowerCase();
            return matchesSearch && matchesCategory;
        });
        setFilteredPatrons(filtered);
    };

    return (
        <div className="patrons-container">
            <h1>Patrons</h1>

            {/* search bar and category filter */}
            <div className="search-field-category-filter">
                <div className="patrons-category">
                    <label htmlFor="">Category</label>
                    <select
                        name=""
                        id=""
                        className="form-select"
                        value={categoryFilter}
                        onChange={handleCategoryChange}
                    >
                        <option value="">Any</option>
                        <option value="Student">Student</option>
                        <option value="Faculty">Faculty</option>
                    </select>
                </div>
            </div>

            {/* search bar */}
            <div className="search-bar-box">
                <input
                    type="text"
                    className="patrons-search-bar"
                    placeholder="Search"
                    value={searchTerm}
                    onChange={handleSearchChange}
                />
                <button className="patrons-search-button">
                    <FontAwesomeIcon icon={faMagnifyingGlass} />
                    Search
                </button>
                <Link to="/add-patron">
                    <button className="patrons-search-button">
                        <FontAwesomeIcon icon={faPlus} />
                        Add Patron
                    </button>
                </Link>    
            </div>

            {/* logbook table */}
            
                <table className="patrons-table">
                    <thead>
                        <tr>
                            <td>TUP ID</td>
                            <td>Name</td>
                            <td>Email</td>
                            <td>Category</td>
                            <td>Checkouts</td>
                            {/* <td>Fines</td> */}
                            <td></td>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredPatrons.length > 0 ? (
                            filteredPatrons.map((patron, index) => (
                                <tr key={index} style={{ borderBottom: '1px solid #ddd' }}>
                                    <td className='tup-id'>{patron.tup_id}</td>
                                    <td>
                                        {patron.patron_fname} {patron.patron_lname}
                                    </td>
                                    <td style={{ padding: '10px' }} className='email'>{patron.patron_email}</td>
                                    <td style={{ padding: '10px' }} className='category'>{patron.category}</td>
                                    <td style={{ padding: '10px' }}>{patron.total_checkouts}</td>
                                    {/* <td>₱<span>0.00</span></td> */}
                                    {userRole=='admin'?<td className="patron-edit-checkout d-flex align-items-center gap-1">
                                        <Link to={`/edit-patron/${patron.patron_id}`}>
                                            <button className="btn
                                            patron-edit-button">
                                                <FontAwesomeIcon icon={faPen} />
                                            </button>
                                        </Link>
                                        <Link to={`/view-patron/${patron.patron_id}`}>
                                            <button className="btn patron-view-button">
                                                <FontAwesomeIcon icon={faFile} />
                                            </button>
                                        </Link>
                                        
                                    </td>:(<td></td>)}
                                    
                                </tr>
                            ))
                        ) : filteredPatrons.length == 0 && !loading ? (
                            <tr>
                                <td colSpan="7" style={{ textAlign: 'center', padding: '10px' }}>
                                    No results found.
                                </td>
                            </tr>
                        ):(<tr>
                            <td colSpan="7" style={{ textAlign: 'center', padding: '20px' }}>
                              <div className="spinner-box">
                                <div className="spinner-grow text-danger" role="status">
                                  <span className="sr-only">Loading...</span>
                                </div>
                              </div>
                            </td>
                          </tr>)}
                    </tbody>
                </table>

                
        </div>
    );
};

export default Patrons;



