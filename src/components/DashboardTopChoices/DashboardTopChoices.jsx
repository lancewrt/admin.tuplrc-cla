import React, { useEffect, useState } from 'react'
import './DashboardTopChoices.css'
import { Link, useNavigate } from 'react-router-dom'

const DashboardTopChoices = ({data, number}) => {
  const [preview, setPreview] = useState(null)
  const navigate = useNavigate()

  useEffect(()=>{
          if(!data.book_cover) return;
  
          let objectUrl;
          try{
              objectUrl = URL.createObjectURL(data.book_cover);
              setPreview(objectUrl);
          }catch{
              const blob = new Blob([new Uint8Array(data.book_cover.data)], { type: 'image/jpeg' });
              objectUrl = URL.createObjectURL(blob);
              setPreview(objectUrl)
          }
            
           // Cleanup function to revoke the Object URL
           return () => {
              if (objectUrl) {
                  URL.revokeObjectURL(objectUrl);
              }
            };
        },[data.book_cover])

        const handleClick = ()=>{
            navigate(`/view-item/${data.resource_id}`)
        }
        
  return (
    <div className='top-choices-container d-flex align-items-center gap-3' onClick={handleClick}>
        {/* top number */}
        <div>
            <span className='m-0 top-number d-flex align-items-center justify-content-center'>{number}</span>
        </div>
        {/* book content */}
        <div className='top-choices-content'>
            {/* book cover */}
            <div>
              <img src={preview} alt="" className='top-choices-cover'/>
            </div>

            {/* book details */}
            <div className='top-choices-details'>
                <p className='m-0 fw-semibold'>
                    {data.resource_title.length>=50
                    ?(data.resource_title.slice(0,50))+"..."
                    :data.resource_title}
                </p>
                <p className='m-0'>By {data.authors}</p>
                <p className='mt-2'>Published in {data.resource_published_date}</p>
            </div>
        </div>
    </div>
  )
}

export default DashboardTopChoices
