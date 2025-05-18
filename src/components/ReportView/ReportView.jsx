import React, { useEffect, useState } from 'react';
import ReactDom from 'react-dom';
import './ReportView.css';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faExclamationCircle, faX, faFilePdf } from '@fortawesome/free-solid-svg-icons';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import * as XLSX from 'xlsx';

// Configure dayjs plugins
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(localizedFormat);

const ReportView = ({open, close, id}) => {
  const [report, setReport] = useState([]);
  const [generatedReport, setGeneratedReport] = useState([]);
  const [exporting, setExporting] = useState(false);
  const [pdfError, setPdfError] = useState(false);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    if (id) {
      getReport();
    }
  }, [id]);
  
  useEffect(() => {
    if (report && Object.keys(report).length > 0) {
      fetchExcel();
    }
  }, [report]);
  
  const getReport = async() => {
    try {
        const response = await axios.get(`https://api.tuplrc-cla.com/api/reports/view/${id}`);
        console.log(response.data);
        
        // Convert dates to local timezone in the report data
        const processedData = response.data.map(item => ({
          ...item,
          report_start_date: item.report_start_date 
            ? dayjs.utc(item.report_start_date).local().format("YYYY-MM-DD") 
            : dayjs().format("YYYY-MM-DD"), // Default to today if null
          report_end_date: item.report_end_date 
            ? dayjs.utc(item.report_end_date).local().format("YYYY-MM-DD") 
            : dayjs().format("YYYY-MM-DD"), // Default to today if null
          // Format created_at for display
          created_at: item.created_at 
            ? dayjs.utc(item.created_at).local().format("MMM DD, YYYY HH:mm A")
            : dayjs().format("MMM DD, YYYY HH:mm A")
        }));
        
        setReport(processedData);
    } catch (error) {
        console.log('Cannot fetch details. ', error);
    }
  };

  const fetchExcel = async () => {
    try {
        const response = await axios.get(`https://api.tuplrc-cla.com/api/reports/fetch-excel?filePath=${encodeURIComponent(report[0].excel_filepath)}`, {
            responseType: 'arraybuffer', // Retrieve as binary data
        });

        // Convert binary data to a readable format
        const workbook = XLSX.read(new Uint8Array(response.data), { type: 'array' });
        const sheetName = workbook.SheetNames[0]; // Get the first sheet
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet); // Convert sheet to JSON

        setGeneratedReport(jsonData);
    } catch (error) {
        console.error('Error fetching Excel file:', error);
    }
  };

  const exportToExcel = () => {
      if (generatedReport.length === 0) return;
      
      // Create workbook and worksheet
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(generatedReport);
      
      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(wb, ws, report[0].report_name || 'Report');
      
      // Generate filename with timestamp
      const timestamp = dayjs().format('YYYY-MM-DD_HH-mm-ss');
      const filename = `${report[0].report_name || 'Report'}_${timestamp}.xlsx`;
      
      // Write and download
      XLSX.writeFile(wb, filename);
    };
  
  // Function to download PDF
  const downloadPDF = async () => {
    if (!report[0]?.filepath) return;
    
    try {
      setDownloading(true);
      
      // Get the PDF file
      const response = await axios.get(`https://api.tuplrc-cla.com/api/reports/fetch-pdf?filePath=${encodeURIComponent(report[0].filepath)}`, {
        responseType: 'blob', // Set response type to blob
      });
      
      // Create a blob URL for the file
      const pdfBlob = new Blob([response.data], { type: 'application/pdf' });
      const blobUrl = window.URL.createObjectURL(pdfBlob);
      
      // Create a temporary link element to trigger download
      const link = document.createElement('a');
      link.href = blobUrl;
      
      // Generate filename with timestamp
      const timestamp = dayjs().format('YYYY-MM-DD_HH-mm-ss');
      const filename = `${report[0].report_name || 'Report'}_${timestamp}.pdf`;
      link.download = filename;
      
      // Append to the document, click it, and remove it
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up the blob URL
      window.URL.revokeObjectURL(blobUrl);
      
      setDownloading(false);
    } catch (error) {
      console.error('Error downloading PDF:', error);
      setDownloading(false);
      // Could add an alert or notification here for the user
    }
  };

  // Add debugging for the report data
  useEffect(() => {
    if (report && report.length > 0) {
      console.log("Report data:", report);
      console.log("PDF filepath:", report[0]?.filepath);
    }
  }, [report]);

  if(!open){
    return null
  }

  return ReactDom.createPortal(
    <div className='reports-view-container'>
      {/* overlay */}
      <div className="reports-view-overlay"></div>
  
      {/* Modal Box */}
      <div className="reports-view-box">
        <div className="header w-100 d-flex justify-content-between align-items-center p-0">
          <span className='fw-semibold'>Generated Report</span>
          <button className="btn" onClick={close}>
            <FontAwesomeIcon icon={faX}/>
          </button>
        </div>
  
        {generatedReport.length > 0 ? (
          <div className="body">
            {/* details */}
            {report.map((item, index) => (
              <div className="details" key={item.id || index}>
                <div className="row mt-3">
                  <div className="col-2 fw-semibold">Report status:</div>
                  <div className={`col-10 fw-semibold ${item.is_archived==1?'text-danger':'text-success'}`}>{item.is_archived==1?'Archived':'Unarchived'}</div>
  
                  <div className="col-2 fw-semibold">Report name:</div>
                  <div className="col-10">{item.report_name}</div>
  
                  <div className="col-2 fw-semibold">Report description:</div>
                  <div className="col-10">{item.report_description}</div>
  
                  <div className="col-2 fw-semibold">Report category:</div>
                  <div className="col-10">{item.cat_name}</div>
  
                  <div className="col-2 fw-semibold">Report detail:</div>
                  <div className="col-10">{item.detail_name}</div>
  
                  {item.cat_name !== 'inventory' && item.cat_name !== 'patron' && item.detail_name !=='most borrowed books' && item.detail_name !== 'least borrowed books' &&(
                    <>
                      <div className="col-2 fw-semibold">Report start date:</div>
                      <div className="col-10">{item.report_start_date || 'N/A'}</div>
  
                      <div className="col-2 fw-semibold">Report end date:</div>
                      <div className="col-10">{item.report_end_date || 'N/A'}</div>
                    </>
                  )}
                  <div className="col-2 fw-semibold">Report created at:</div>
                  <div className="col-10">{item.created_at}</div>
                </div>
              </div>
            ))}
  
            {/* PDF preview section with download button */}
            {report[0]?.filepath && (
              <div className="pdf-preview mt-4">
                <div className="mb-2">
                  {!pdfError && (
                    <button 
                      className="btn btn-primary d-flex align-items-center gap-2"
                      onClick={downloadPDF}
                      disabled={downloading}
                    >
                      <FontAwesomeIcon icon={faFilePdf} />
                      <span>{downloading ? 'Downloading...' : 'Download PDF'}</span>
                    </button>
                  )}
                </div>
                
                {pdfError ? (
                  <div className="alert alert-danger">
                    <FontAwesomeIcon icon={faExclamationCircle} className="me-2" />
                    Unable to load PDF. The file may be missing or inaccessible.
                  </div>
                ) : (
                  <iframe
                    src={`https://api.tuplrc-cla.com/api/reports/fetch-pdf?filePath=${encodeURIComponent(report[0].filepath)}`}
                    width="100%"
                    height="600px"
                    title="PDF Preview"
                    style={{ border: '1px solid #ccc', borderRadius: '8px' }}
                    onLoad={(e) => console.log("PDF loaded successfully")}
                    onError={(e) => {
                      console.error("PDF loading error");
                      setPdfError(true);
                    }}
                  />
                )}
              </div>
            )}
  
            {/* Excel Export and Table */}
            <button 
              className="btn d-flex align-items-center gap-2 btn-success mt-4 text-end"
              disabled={exporting || generatedReport.length === 0}
              onClick={exportToExcel}
            >
              <FontAwesomeIcon icon={faDownload}/>
              <span className='m-0'>{exporting ? 'Exporting...' : 'Export to Excel'}</span>
            </button>
  
            <table className='mt-3 report-view-table'>
              <thead>
                <tr>
                  {Object.keys(generatedReport[0]).map((key) => (
                    <th key={key}>{key}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {generatedReport.map((row, index) => (
                  <tr key={index}>
                    {Object.values(row).map((value, i) => (
                      <td key={i}>{value}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className='d-flex flex-column justify-content-center align-items-center gap-2 my-5'>
            <FontAwesomeIcon icon={faExclamationCircle} className='no-data'/>
            <p>No report data available.</p>
          </div>
        )}
      </div>     
    </div>,
    document.getElementById('portal')
  );
  
}

export default ReportView