import React, { useEffect, useState } from 'react'
import AdminNavbar from '../../components/AdminNavbar/AdminNavbar'
import AdminTopNavbar from '../../components/AdminTopNavbar/AdminTopNavbar'
import Dashboard from '../../components/Dashboard/Dashboard'
import './DashboardPage.css'


const DashboardPage = () => {
  
  return (
    <div className='dashpage'>
      <div className=''>
       <AdminNavbar/>
      </div> 
      <div className='p-0 m-0 h-100'>
        <AdminTopNavbar/>
        <Dashboard/>
      </div>
    </div>
  )
}

export default DashboardPage
