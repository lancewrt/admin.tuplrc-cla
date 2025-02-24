import React from 'react';
import './DashboardTable.css';
import { useNavigate } from "react-router";

const DashboardTable = ({ header, data, type }) => {
  const navigate = useNavigate();
  
  const handleClick = (id)=>{
    if(type=='overdue'){
      navigate(`/view-patron/${id}`)
    }else if(type=='books'){
      navigate(`/view-item/${id}`)
    }
  }

  const displayData = (item)=>{
    if(type=='overdue'){
      return(
        <>
          <td>{item.tup_id}</td>
          <td>{item.pname}</td>
          <td>{item.resource_id}</td>
          <td>{item.resource_title}</td>
          <td>{item.overdue_days}</td>
        </>
      )
    }else if(type=='books'){
      return(
        <>
          <td>{item.resource_id}</td>
          <td>{item.resource_title}</td>
          <td>{item.authors}</td>
          <td>{item.resource_quantity}</td>
        </>
      )
    }else{
      return(
        <>
          <td>{item.tup_id}</td>
          <td>{item.resource_title}</td>
          <td>{item.duedate}</td>
        </>
      )
    }
  }

  return (
    <table className='dashboard-table'>
      <thead>
        <tr>
          {header.map((item, index) => (
            <td key={index}>{item}</td>
          ))}
        </tr>
      </thead>
      <tbody>
        {Array.isArray(data) && data.length !== 0 ? (
          data.map((item, rowIndex) => (
            <tr key={rowIndex} className={type!='issued'?'clickable':''} onClick={()=>{
              if(type=='overdue'){
                handleClick(item.patron_id)
              }else if(type=='books'){
                handleClick(item.resource_id)
              }
            }}>
              {displayData(item)}
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={header.length}>No records found</td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default DashboardTable;
