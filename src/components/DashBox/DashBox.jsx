import React from 'react'
import { useNavigate } from 'react-router-dom';
import './DashBox.css'

const DashBox = ({icon, title,total}) => {
  const navigate = useNavigate();

  const handleClick = ()=>{
    switch(title){
      case 'Total Visits': 
        navigate('/logbook');
        break;
      case 'Returned Resources':
      case 'Overdue Resources':
      case 'Borrowed Resources':
        navigate('/circulation');
        break;
      default: 
        console.log('Invalid. Please try again later')
    }
  }
  return (
    <div className="dash-box col" onClick={handleClick}>
        <div className="total-box">
            <span className='total'>{total}</span>
            <span className='label'>{title}</span>
        </div>
        {icon}
    </div>
  )
}

export default DashBox
