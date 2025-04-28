import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import "./AttendancePage.css";
import { io } from 'socket.io-client';

const AttendancePage = () => {
  // State management
  const [studentId, setStudentId] = useState("");
  const [studentName, setStudentName] = useState(null);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("idle"); // idle, loading, success, error
  const [lastScannedId, setLastScannedId] = useState(null);
  const [lastScanTime, setLastScanTime] = useState(null);
  
  // Create a ref for the input and set focus
  const searchInputRef = useRef(null);
  
  // Get current date and time in Philippines timezone
  const getCurrentDateTime = () => {
    const options = { timeZone: "Asia/Manila" };
    return {
      date: new Date().toLocaleDateString("en-CA", options),
      time: new Date().toLocaleTimeString("en-GB", options)
    };
  };

  // Current date and time display
  const [currentDateTime, setCurrentDateTime] = useState(getCurrentDateTime());

  useEffect(() => {
    const socket = io("https://api.tuplrc-cla.com", {
      withCredentials: true,
      transports: ["polling"],
    });
  
    socket.on('attendance-data', (incomingStudentId) => {
      console.log('Received serial data:', incomingStudentId);
  
      const cleanedId = incomingStudentId.trim();
      const currentTime = Date.now();
      const DEBOUNCE_TIME = 5000; // 5 seconds
  
      // Debounce HERE before submitting
      if (lastScannedId === cleanedId && lastScanTime && currentTime - lastScanTime < DEBOUNCE_TIME) {
        setMessage("This student ID was scanned recently. Please wait a few seconds.");
        setStatus("error");
        setStudentId("");
        return;  // Don't even call handleSubmit if recently scanned
      }
  
      // Only proceed if not in loading or success state
      if (status !== "loading" && status !== "success") {
        setStudentId(cleanedId);
        setLastScannedId(cleanedId);
        setLastScanTime(currentTime);
    
        handleSubmit(cleanedId);
      }
    });
  
    return () => {
      socket.off('attendance-data');
    };
  }, [lastScannedId, lastScanTime, status]);  // Add dependencies to ensure fresh checks
  
 

  // Update the time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(getCurrentDateTime());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Focus on input field when component mounts
  useEffect(() => {
    searchInputRef.current?.focus();
  }, [studentName]);

  // Auto-clear success or error messages after 5 seconds
  useEffect(() => {
    if (message && (status === "success" || status === "error")) {
      const timeout = setTimeout(() => {
        setMessage("");
        setStatus("idle");
        setStudentName('')
      }, 5000);
      return () => clearTimeout(timeout);
    }
  }, [message, status]);

  // Handle form submission
  const handleSubmit = async (id) => {
    try {
      const { date, time } = getCurrentDateTime();
      const response = await axios.post(
        "https://api.tuplrc-cla.com/api/attendance",
        { studentId: id, date, time },
        { headers: { "Content-Type": "application/json" } }
      );
  
      if (response.data.success) {
        setStudentName(response.data.studentName);
        setMessage("Attendance logged successfully.");
        setStatus("success");
        setStudentId("");
      } else {
        setStudentName(null);
        setMessage(response.data.message || "Unable to log attendance.");
        setStatus("error");
      }
    } catch (error) {
      console.error("Attendance logging error:", error);
      setMessage("An error occurred while processing the request.");
      setStatus("error");
    }
  };
  
  console.log('last scanned: ', lastScannedId)
  console.log('current id: ', studentId)

  return (
    <div className="attendance-container">
      <header className="header">
        <div className="header-content">
          <div className="logo-group">
            <img src="/tuplogo.png" className="header-logo" alt="TUP Logo" />
            <img src="/clalogo.png" className="header-logo" alt="CLA Logo" />
          </div>
          <div className="header-title">
            <h1>College of Liberal Arts</h1>
            <h2>Learning Resource Center</h2>
          </div>
          <div className="datetime-display">
            <div className="date">{currentDateTime.date}</div>
            <div className="time">{currentDateTime.time}</div>
          </div>
        </div>
      </header>
      
      <main className="content">
        <div className="attendance-card">
          <h2 className="card-title">Student Attendance</h2>
          
          {studentName ? (
            <div className="student-info success-panel">
              <div className="welcome-icon">✓</div>
              <div className="welcome-text">
                <h2 className="welcome-message">Welcome,</h2>
                <h2 className="student-name">{studentName}!</h2>
              </div>
            </div>
          ) : (
            <div className="instructions">
              <p>Please scan your student ID</p>
            </div>
          )}

          <div className="search-bar">
            <input
              type="text"
              className="form-input"
              id="studentId"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              ref={searchInputRef}
              placeholder="Student ID"
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit(studentId)}
              disabled={status === "loading"}
            />
            <button 
              onClick={() => handleSubmit(studentId)}
              className={`search-button ${status === "loading" ? "loading" : ""}`}
              aria-label="Search for student"
              disabled={status === "loading"}
            >
              {status === "loading" ? "Processing..." : "Submit"}
            </button>
          </div>
          
          {message && (
            <div className={`message ${status === "success" ? "success" : "error"}`}>
              <p className="status-message">{message}</p>
            </div>
          )}
        </div>
      </main>

      <footer className="footer">
        <p>&copy; TUP CLA Learning Resource Center {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
};

export default AttendancePage;