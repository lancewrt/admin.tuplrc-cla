import React, { useState, useEffect } from 'react';

export default function DesktopOnlyMessage() {
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    // Function to check if device is mobile
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Check on initial load
    checkIsMobile();
    
    // Add event listener for window resize
    window.addEventListener('resize', checkIsMobile);
    
    // Clean up
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);
  
  // Styles that follow your existing design
  const styles = {
    container: {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100vh',
      backgroundColor: 'rgba(0, 0, 0, 0.9)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 9999,
      fontFamily: "'Inter', Arial, sans-serif",
    },
    messageBox: {
      backgroundColor: '#fff',
      padding: '2rem',
      borderRadius: '8px',
      maxWidth: '90%',
      textAlign: 'center',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    },
    heading: {
      color: '#94152B',
      marginBottom: '1rem',
      fontWeight: 700,
    },
    message: {
      fontSize: '1rem',
      marginBottom: '1.5rem',
      color: '#1F1F1F',
    },
    logo: {
      display: 'flex',
      justifyContent: 'center',
      gap: '1rem',
      marginBottom: '1.5rem',
    },
    logoImage: {
      height: '50px',
    }
  };
  
  if (!isMobile) {
    return null; // Don't show anything on desktop
  }
  
  return (
    <div style={styles.container}>
      <div style={styles.messageBox}>
        <div style={styles.logo}>
          <img src="/tuplogo.png" alt="TUP Logo" style={styles.logoImage} />
          <img src="/clalogo.png" alt="CLA Logo" style={styles.logoImage} />
        </div>
        <h2 style={styles.heading}>Desktop Mode Required</h2>
        <p style={styles.message}>
          This application can only be accessed in desktop mode. 
          Please use a device with a larger screen or switch to desktop view.
        </p>
      </div>
    </div>
  );
}