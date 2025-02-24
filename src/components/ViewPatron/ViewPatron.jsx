import React, { useEffect, useState } from 'react'
import './ViewPatron.css'
import { Link, useParams } from 'react-router-dom'
import ViewPatronTable from '../ViewPatronTable/ViewPatronTable';
import axios from 'axios'

const ViewPatron = () => {
  const logHistoryHeader = ['Date', 'Time in'];
  const circulationHistoryHeader = ['Book/s Issued','Borrow Date','Due Date','Return Date','Overdue Days']
  const {id} = useParams();

  const [patron, setPatron] = useState([]);
  const [logHistory, setLogHistory] = useState([]);
  const [circulationHistory, setCirculationHistory] = useState([]);

  useEffect(()=>{
    getPatron();
    getLogHistory();
    getCirculationHistory()
  },[])

  const getPatron = async ()=>{
    axios.get(`https://api.tuplrc-cla.com/api/patron/${id}`) 
      .then((response) => {
         setPatron(response.data[0]);
      })
      .catch((error) => {
        console.error('Error fetching patron data:', error);
      })
  }

  const getLogHistory = async ()=>{
    axios.get(`https://api.tuplrc-cla.com/api/patron/log/${id}`) 
      .then((response) => {
         setLogHistory(response.data);
      })
      .catch((error) => {
        console.error('Error fetching patron data:', error);
      })
  }

  const getCirculationHistory = async ()=>{
    axios.get(`https://api.tuplrc-cla.com/api/patron/circulation/${id}`) 
      .then((response) => {
         setCirculationHistory(response.data);
      })
      .catch((error) => {
        console.error('Error fetching patron data:', error);
      })
  }

  return (
    <div className='viewpatron-container'>
      <div className=''>
          <Link to={'/patrons'}>
              <button className='view-patron-back-button'>
                <i className='fa-solid fa-arrow-left'></i>
                <p className='m-0'>Back</p>
              </button>
          </Link>
      </div>
      {/* user profile */}
      <div className='d-flex flex-column gap-2 py-3'>
        <div>
          <h1 className='m-0 fs-1'>{patron.patron_fname} {patron.patron_lname}</h1>
          <p  className='m-0 fs-3'>{patron.tup_id}</p>
        </div>
        <div className='row w-50 py-1'>
          <div className="col-2 fw-semibold">Category:</div>
          <div className="col-10">{patron.category}</div>
          
          <div className="col-2 fw-semibold">Sex:</div>
          <div className="col-10">{patron.patron_sex}</div>

          <div className="col-2 fw-semibold">Email:</div>
          <div className="col-10">{patron.patron_email}</div>

          <div className="col-2 fw-semibold">Mobile:</div>
          <div className="col-10">{patron.patron_mobile}</div>

          <div className="col-2 fw-semibold">College:</div>
          <div className="col-10">{patron.college_name}</div>

          <div className="col-2 fw-semibold">Program:</div>
          <div className="col-10">{patron.course_name}</div>
        </div>  
      </div>

      <hr />

      {/* log history */}
      <ViewPatronTable header={logHistoryHeader} title={'Log History'} data={logHistory}></ViewPatronTable>

      <hr />

      {/* Circulation history */}
      <ViewPatronTable header={circulationHistoryHeader} title={'Circulation History'} data={circulationHistory}></ViewPatronTable>
    </div>
  )
}

export default ViewPatron
