import React from 'react'


const DashBox = ({icon, title,total}) => {
  return (
    <div className="dash-box col">
        <div className="total-box">
            <span className='total'>{total}</span>
            <span className='label'>{title}</span>
        </div>
        {icon}
    </div>
  )
}

export default DashBox
