import React, { useEffect, useState } from 'react'
import AdminNavbar from '../../components/AdminNavbar/AdminNavbar'
import AdminTopNavbar from '../../components/AdminTopNavbar/AdminTopNavbar'
import './ResourceStatus.css'
import axios from 'axios'
import { useSelector } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch, faXmarkCircle, faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons'

const ResourceStatus = () => {
    const [resources, setResources] = useState([])
    const [filteredResources, setFilteredResources] = useState([])
    const [loading, setLoading] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 10
    const { status } = useSelector(state => state.status)

    useEffect(() => {
        fetchResource()
    }, [])

    const fetchResource = async () => {
        try {
            setLoading(true)
            const response = await axios.get('https://api.tuplrc-cla.com/api/catalog/resource-status')
            setResources(response.data)
            setFilteredResources(response.data)
        } catch (error) {
            console.log('Cannot fetch resources for resource status page. An error occurred:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleStatusChange = async (resourceId, newStatusId, origResourceId) => {
        try {
            setLoading(true)
            await axios.put(`https://api.tuplrc-cla.com/api/catalog/resource-status/${resourceId}`, {
                availId: newStatusId,
                resourceId:origResourceId
            })
            const updated = resources.map(resource =>
                resource.rc_id === resourceId ? { ...resource, avail_id: newStatusId } : resource
            )
            setResources(updated)
            setFilteredResources(updated)
            window.toast?.fire({ icon: "success", title: "Resource updated successfully" })
        } catch (error) {
            console.error('Failed to update resource status:', error)
            alert('Failed to update resource status. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    const handleSearch = () => {
        const filtered = resources.filter(resource =>
            (resource.resource_title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (resource.author_names || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (resource.dept_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (resource.topic_name || '').toLowerCase().includes(searchTerm.toLowerCase())
        )        
        setFilteredResources(filtered)
        setCurrentPage(1)
    }

    const handleClear = () => {
        setSearchTerm('')
        setFilteredResources(resources)
        setCurrentPage(1)
    }

    const indexOfLastItem = currentPage * itemsPerPage
    const indexOfFirstItem = indexOfLastItem - itemsPerPage
    const currentItems = filteredResources.slice(indexOfFirstItem, indexOfLastItem)
    const totalPages = Math.ceil(filteredResources.length / itemsPerPage)

    const handlePreviousButton = () => {
        if (currentPage > 1) setCurrentPage(currentPage => currentPage - 1)
    }

    const handleNextButton = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage => currentPage + 1)
    }

    return (
        <div className='resourcestats bg-light'>
            <div>
                <AdminNavbar />
            </div>
            <div>
                <AdminTopNavbar />
                <div className='cat-container'>
                    <h1>Resource Status</h1>

                    {/* search */}
                    <div className='input-group z-0 w-50 mb-3'>
                    <input
                        type="text"
                        className='form-control shadow-sm'
                        placeholder='Search by title, author, department, or topic...'
                        value={searchTerm}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                handleSearch();
                            }
                        }}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                        <button
                            className="btn cat-button shadow-sm px-3"
                            onClick={handleSearch}
                        >
                            <FontAwesomeIcon icon={faSearch} />
                        </button>
                        <button
                            className="btn btn-outline-secondary d-flex gap-2 justify-content-center align-items-center ms-2"
                            onClick={handleClear}
                        >
                            <FontAwesomeIcon icon={faXmarkCircle} />
                            Clear filter
                        </button>
                    </div>

                    <table className="cat-table">
                        <thead>
                            <tr>
                                <td>Accession Number</td>
                                <td>Title</td>
                                <td>Type</td>
                                <td>Authors</td>
                                <td>Department</td>
                                <td>Topic</td>
                                <td>Status</td>
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems.length > 0 ? currentItems.map(resource => (
                                <tr key={resource.rc_id}>
                                    <td>{resource.rc_id}</td>
                                    <td>{resource.resource_title}</td>
                                    <td>{resource.type_name}</td>
                                    <td>{resource.author_names}</td>
                                    <td>{resource.dept_name}</td>
                                    <td>{resource.topic_name}</td>
                                    <td>
                                        <select
                                            name="status"
                                            className='form-select'
                                            value={resource.avail_id || ''}
                                            onChange={(e) => handleStatusChange(resource.rc_id, e.target.value, resource.resource_id)}
                                            disabled={loading || resource.avail_id == 4}
                                        >
                                            <option disabled value=''>Select item status</option>
                                            {status && status.map(item => (
                                                <option 
                                                    key={item.avail_id} 
                                                    value={item.avail_id}
                                                    disabled={item.avail_id==4||item.avail_id==5}
                                                >
                                                    {item.avail_name}
                                                </option>
                                            ))}
                                        </select>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="7" className="text-center py-4">No resources found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    {/* pagination controls */}
                    <nav aria-label="Page navigation" className="d-flex align-items-center justify-content-between mt-3">
                        <div className="d-flex align-items-center justify-content-between pagination w-100">
                            <span>
                                Page {currentPage} of {totalPages || 1}
                            </span>
                            <div className='buttons ms-3'>
                                <button
                                    className="btn btn-outline-secondary me-2"
                                    onClick={handlePreviousButton}
                                    disabled={currentPage === 1 || totalPages === 0}
                                    aria-label="Go to previous page"
                                >
                                    <FontAwesomeIcon icon={faArrowLeft} />
                                </button>
                                <button
                                    className='btn btn-outline-secondary'
                                    onClick={handleNextButton}
                                    disabled={currentPage === totalPages || totalPages === 0}
                                    aria-label="Go to next page"
                                >
                                    <FontAwesomeIcon icon={faArrowRight} />
                                </button>
                            </div>
                        </div>
                    </nav>
                </div>
            </div>
        </div>
    )
}

export default ResourceStatus
