import React from 'react'
import './JournalInput.css'
import AuthorInput from '../AuthorInput/AuthorInput'

const JournalInputOffline = ({disabled,handleChange,bookData,addAuthor,setBookData,formValidation,error,publishers,authorOptions,handleAddAuthor,selectedOptions,deleteAuthor,authorList}) => {
    
  return (
    <div className='row'>
        {/* author */}
        <div className="col-6 info-input-box">
            <label htmlFor="">Author/s *</label>
            {/* author box */}
            <AuthorInput disabled={disabled} handleChange={handleChange} bookData={bookData} addAuthor={addAuthor} authorOptions={authorOptions} setBookData={setBookData} handleAddAuthor={handleAddAuthor} selectedOptions={selectedOptions} deleteAuthor={deleteAuthor} authorList={authorList}/>
        </div>

        {/* volume, issue, publish date */}
        <div className="col-6 info-input-box">
            <div className="row">
                {/* volume */}
                <div className="col-12 info-input-box mb-3">
                    <label htmlFor="">Volume</label>
                    <input type="text" placeholder='Enter volume' disabled={disabled?true:false} name='volume' onChange={handleChange} value={bookData.volume?bookData.volume:''}/>
                </div>
                {/* issue */}
                <div className="col-12 info-input-box mb-3">
                    <label htmlFor="">Issue</label>
                    <input type="text" placeholder='Enter issue' disabled={disabled?true:false} name='issue' onChange={handleChange} value={bookData.issue?bookData.issue:''}/>  
                </div>
                {/* publisher date*/}
                <div className="col-12 info-input-box mb-3">
                    <label htmlFor="">Publish Date *</label>
                    <input type="text" name="publishedDate" id="" placeholder='Select date' disabled={disabled?true:false} onChange={handleChange} value={bookData.publishedDate?bookData.publishedDate:''}/>
                </div>
            </div>
        </div>
    </div>
  )
}

export default JournalInputOffline
