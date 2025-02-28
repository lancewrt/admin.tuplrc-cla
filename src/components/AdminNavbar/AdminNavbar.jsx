import React, { useEffect, useState } from 'react';
import './AdminNavbar.css';
import tuplogo from '../../assets/tuplogo.png';
import clalogo from '../../assets/clalogo.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFile, faChartSimple, faFileLines, faCartShopping, faUser, faList, faFileExcel, faUsersGear, faUserPlus, faBookOpenReader, faLayerGroup, faBook, faArrowDown, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Loading from '../Loading/Loading';
import axios from 'axios';


const AdminNavbar = () => {
    const [role, setRole] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isCatalogingOpen, setIsCatalogingOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const currentPathname = '/' + location.pathname.split('/')[1];

    console.log(currentPathname)

    useEffect(() => {
        const fetchUserRole = async () => {
            try {
                const response = await axios.get('https://api.tuplrc-cla.com/api/user/check-session', { withCredentials: true });
                if (response.data.loggedIn) {
                    setRole(response.data.userRole);
                } else {
                    setRole(null);
                }
            } catch (error) {
                console.error('Error verifying session:', error);
                setRole(null);
            } finally {
                setLoading(false);
            }
        };
        fetchUserRole();
    }, [navigate]);

    if (loading) {
        return <Loading />;
    }

    return (
        <div className='admin-navbar-container'>
            {/* Logo and Heading */}
            <div className="navbar-logo-heading">
                <div className="navbar-logos">
                    <img src={tuplogo} alt="tup-logo" />
                    <img src={clalogo} alt="cla-logo" />
                </div>
                <div className="navbar-heading">
                    <p className='navbar-heading-text navbar-heading-cla'>College of Liberal Arts</p>
                    <p className='navbar-heading-text navbar-heading-lrc'>Learning Resource Center</p>
                </div>
            </div>

            {/* Menu */}
            <div className="navbar-menu">
                <ul>
                    {/* Dashboard */}
                    <li className={currentPathname=='/dashboard'?'selected':''}>
                        <Link to='/dashboard' className='menu'>
                            <div><FontAwesomeIcon icon={faChartSimple} className='menu-icon'/></div>
                            <div><p>Dashboard</p></div>
                        </Link>
                    </li>

                    {/* Logbook */}
                    <li className={currentPathname=='/logbook'?'selected':''}>
                        <Link to='/logbook' className="menu">
                            <div><FontAwesomeIcon icon={faFileLines} className='menu-icon'/></div>
                            <div><p>Logbook</p></div>
                        </Link>
                    </li>

                    {/* Circulation */}
                    <li className={currentPathname=='/circulation'?'selected':''}>
                        <Link to='/circulation' className="menu">
                            <div><FontAwesomeIcon icon={faCartShopping} className='menu-icon'/></div>
                            <div><p>Circulation</p></div>
                        </Link>
                    </li>

                    {/* Patrons */}
                    <li className={currentPathname=='/patron'?'selected':''}>
                        <Link to='/patron' className="menu">
                            <div><FontAwesomeIcon icon={faUser} className='menu-icon' /></div>
                            <div><p>Patrons</p></div>
                        </Link>
                    </li>

                    {/* Cataloging */}
                    <li className={currentPathname=='/catalog'?'selected':''}>
                        <Link to='/catalog'className='d-flex align-items-center gap-3'>
                            <div className='menu'>
                               <div><FontAwesomeIcon icon={faList} className='menu-icon'/></div>
                                <div><p>Cataloging</p></div>
                            </div>
                        </Link>
                    </li>

                    {/* Conditionally Render Menu Items Based on Role */}
                    {role !== 'staff' && (
                        <>
                            <li className={currentPathname=='/reports'?'selected':''}>
                                <Link to='/reports' className="menu">
                                    <div><FontAwesomeIcon icon={faFileExcel} className='menu-icon'/></div>
                                    <div><p>Reports</p></div>
                                </Link>
                            </li>

                            <li className={currentPathname=='/audit'?'selected':''}>
                                <Link to='/audit' className="menu">
                                    <div><FontAwesomeIcon icon={faFile} className='menu-icon'/></div>
                                    <div><p>Audit Logs</p></div>
                                </Link>
                            </li>

                            <li className={currentPathname=='/accounts'?'selected':''}>
                                <Link to='/accounts' className="menu">
                                    <div><FontAwesomeIcon icon={faUsersGear} className='menu-icon'/></div>
                                    <div><p>Accounts</p></div>
                                </Link>
                            </li>
                        </>
                    )}
                </ul>
            </div>
        </div>
    );
};

export default AdminNavbar;
