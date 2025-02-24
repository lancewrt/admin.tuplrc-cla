import React, { useEffect, useState } from 'react'
import axios from 'axios'
import './Dashboard.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers ,faBook, faPlus, faBookBookmark, faTriangleExclamation} from '@fortawesome/free-solid-svg-icons';
import { VerticalBarChart } from '../VerticalBarChart';
import DashboardTable from '../DashboardTable/DashboardTable';
import DashboardTopChoices from '../DashboardTopChoices/DashboardTopChoices';
import DashBox from '../DashBox/DashBox';
import { Link } from 'react-router-dom';
import {useDispatch} from 'react-redux';
import { setBorrowedStats, setVisitorStats } from '../../features/chartSlice.js';


const Dashboard = () => {
  const [dateTime,setDateTime] = useState(new Date());
  const [uname, setUname] = useState(null)
  const [totalVisitors, setTotalVisitors] = useState("");
  const [totalBorrowed, setTotalBorrowed] = useState("");
  const [totalReturned, setTotalReturned] = useState("");
  const [totalOverdue, setTotalOverdue] = useState("");
  const [overdueBooks, setOverdueBooks] = useState([]);
  const [bookList, setBookList] = useState([]);
  const [issuedBooks, setIssuedBooks] = useState([]);
  const [popularChoices, setPopularChoices] = useState([]);
  const overdueListHeader = ["Tup ID","Borrower's Name","Book ID","Title","Overdue Days"];
  const bookListHeader = ["Book ID","Title","Author","Copies Available"];
  const bookIssuedHeader = ["Tup ID","Title","Return Date"];
  const dispatch = useDispatch()
  
  useEffect(() => {
    getUsername()
    getTotalVisitors();
    getTotalBorrowed();
    getTotalReturned();
    getTotalOverdue();
    getOverdueBooks();
    getBookList();
    getIssued();
    getPopularChoices();
    getBookTrends();
    getVisitorStats();
  }, []);

  const getUsername = async()=>{
    try {
      // Request server to verify the JWT token
      const response = await axios.get('https://api.tuplrc-cla.com/api/user/check-session', { withCredentials: true });
      console.log(response.data)
      // If session is valid, set the role
      if (response.data.loggedIn) {
        setUname(response.data.username);
      } else {
        setUname(null); // If not logged in, clear the role
      }
    } catch (error) {
      console.error('Error verifying session:', error);
      setUname(null); // Set null if there's an error
    }
  }

  //total visitors
  const getTotalVisitors = async () => {
    try {
      const response = await axios.get(`https://api.tuplrc-cla.com/api/dashboard/total-visitors`);
      setTotalVisitors(response.data.total_attendance); // Adjust based on your backend response
      console.log(response.data);
    } catch (err) {
      console.error("Error fetching total visitors:", err.message);
    }
  };

  //total borrowed
  const getTotalBorrowed = async () => {
    try {
      const response = await axios.get(`https://api.tuplrc-cla.com/api/dashboard/total-borrowed`);
      setTotalBorrowed(response.data.total_borrowed); // Adjust based on your backend response
      console.log(response.data);
    } catch (err) {
      console.error("Error fetching total borrowed books:", err.message);
    }
  };

  //total returned
  const getTotalReturned = async () => {
    try {
      const response = await axios.get(`https://api.tuplrc-cla.com/api/dashboard/total-returned`);
      setTotalReturned(response.data.total_returned); // Adjust based on your backend response
      console.log(response.data);
    } catch (err) {
      console.error("Error fetching total returned books:", err.message);
    }
  };

  //total overdue
  const getTotalOverdue = async () => {
    try {
      const response = await axios.get(`https://api.tuplrc-cla.com/api/dashboard/total-overdue`);
      setTotalOverdue(response.data.total_overdue); // Adjust based on your backend response
      console.log(response.data);
    } catch (err) {
      console.error("Error fetching total overdue books:", err.message);
    }
  };

  //overdue books
  const getOverdueBooks = async () => {
    try {
        await axios.get(`https://api.tuplrc-cla.com/api/dashboard/overdue-books`)
        .then(response=>{
          console.log(response.data)
          setOverdueBooks(response.data);
        })
    } catch (error) {
        console.error('Error fetching overdue books:', error);
    }
  };

  //get book trends
  const getBookTrends = async()=>{
    try{
      const response = await axios.get(`https://api.tuplrc-cla.com/api/dashboard/book-statistics`)
      const books = response.data;
      console.log(books)
      const borrowingTrends = books.map(item=>
        item.total_books_borrowed
      )
      dispatch(setBorrowedStats(borrowingTrends))
    }catch(err){
      console.log('Cannot get borrowed book trends. An error occurred: ', err.message)
    }
  }

  const getVisitorStats = async()=>{
    try{
      const response = await axios.get(`https://api.tuplrc-cla.com/api/dashboard/visitor-statistics`)
      const visitors = response.data;
      console.log(visitors)

      const visitorsStats = visitors.map(item=>
        item.total_attendance
      )
      dispatch(setVisitorStats(visitorsStats))
      
    }catch(err){
      console.log('Cannot get borrowed book trends. An error occurred: ', err.message)
    }
  }

  //books list
  const getBookList = async()=>{
    try {
      const response = await axios.get(`https://api.tuplrc-cla.com/api/dashboard/book-list`).then(res=>res.data);
      setBookList(response)
      console.log(response)
    } catch (err) {
        console.log(err.message);
    }
  }

   //book issued
   const getIssued = async()=>{
    try {
      const response = await axios.get(`https://api.tuplrc-cla.com/api/dashboard/issued-books`).then(res=>res.data);
      setIssuedBooks(response)
      console.log(response)
    } catch (err) {
        console.log(err.message);
    }
  }

  //book issued
  const getPopularChoices = async()=>{
    try {
      const response = await axios.get(`https://api.tuplrc-cla.com/api/dashboard/popular-choices`).then(res=>res.data);
      setPopularChoices(response)
      console.log(response)
    } catch (err) {
        console.log(err.message);
    }
  }

  return (
    <div className='dashboard-container'>
       {/* dashboard heading */}
       <div className="dashboard-heading">
          {/* Goodmorning,admin */}
          <p className='dashboard-heading-text'>{dateTime.getHours()>=1 && dateTime.getHours()<12?'Good morning, ':dateTime.getHours()>=12&&dateTime.getHours()<17?'Good afternoon, ':'Good evening,'} <span>{uname}</span></p>
      </div>

      {/* columns */}
      <div className="dashboard">
        {/* column 1 */}
        <div className="dashboard-1 row gap-3">
          {/* total visitors */}
          <DashBox icon={<FontAwesomeIcon icon={faUsers} className='icon'/>} title={"Total Visits"} total={totalVisitors}/>

          {/* borrowed resources */}
          <DashBox icon={<FontAwesomeIcon icon={faBookBookmark} className='icon'/>} title={"Borrowed Resources"} total={totalBorrowed}/>

          {/* returned resources */}
          <DashBox icon={<FontAwesomeIcon icon={faBook} className='icon'/>} title={"Returned Resources"} total={totalReturned}/>
          
          {/* overdue resources */}
          <DashBox icon={<FontAwesomeIcon icon={faTriangleExclamation} className='icon'/>} title={"Overdue Resources"} total={totalOverdue}/>

          {/* bar chart */}
          <div className="bar-chart col-12">
            <h5>Visitors and Borrowers Statistics</h5>
            <VerticalBarChart/>
          </div>

          {/* overdue book list */}
          <div className="overdue-table py-4">
            <div className='d-flex align-items-center justify-content-start gap-5 py-3'>
              <h5 className='m-0'>Overdue Book List</h5>
              {/* <button className='see-all btn'>See all</button> */}
            </div>
            <DashboardTable header={overdueListHeader} data={overdueBooks} type={"overdue"}/>
          </div>

          {/* book list */}
          <div className="book-table py-4">
            <div className='d-flex justify-content-between'>
              <div className='d-flex align-items-center justify-content-start gap-5 py-3'>
                <h5 className='m-0'>Book List</h5>
                <Link to='/catalog'>
                  <button className='see-all btn'>See all</button>
                </Link>
                
              </div>
              <Link to="/add-item">
                <button className="btn add-btn d-flex align-items-center justify-content-center gap-3">
                  <FontAwesomeIcon icon={faPlus} className='icon'/>
                  Add new
                </button>
              </Link>
              
            </div>
            
            <DashboardTable header={bookListHeader}  data={bookList} type={"books"}/>
          </div>
        </div>

        {/* column 2 */}
        <div className="dashboard-2">
          {/* top choices*/}
          <div className="top-choices d-flex flex-column gap-3">
            <h5>Popular Choices</h5>
            {popularChoices ? popularChoices.map((item, index) => (
              <DashboardTopChoices key={index} data={item} number={index + 1} />
            )) : ''} 
          </div>

          {/* books issued list */}
          <div className="issued-table px-3 py-5">
            <div className='d-flex align-items-center justify-content-between'>
              <div className='d-flex align-items-center justify-content-start gap-3 py-3'>
                <h5 className='m-0'>Books Issued</h5>
                <p className='books-issued-total m-0 d-flex align-items-center justify-content-center rounded-5'>{issuedBooks&&issuedBooks.length}</p>
              </div>
              <Link to='/circulation'>
                <button className='btn see-all'>See all</button>
              </Link>
              
            </div>
            
            <DashboardTable header={bookIssuedHeader} data={issuedBooks} type={"issued"}/>
          </div>

        </div>

      </div>
    </div>
  )
}

export default Dashboard
