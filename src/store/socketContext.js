// SocketContext.js
import React, { createContext, useState, useEffect } from 'react';
import { io } from 'socket.io-client';

export const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  
  useEffect(() => {
    const newSocket = io('https://api.tuplrc-cla.com', {
        transports: ['polling'],  // Force long-polling only
        upgrade: false  // Prevent transport upgrade attempts
    });
    
    // Listen for connection event
    newSocket.on('connect', () => {
      console.log('Connected to socket server');
    });
    
    // Listen for disconnect event
    newSocket.on('disconnect', () => {
      console.log('Disconnected from socket server');
    });
    
    setSocket(newSocket);
    
    return () => {
      newSocket.disconnect();
    };
  }, []);
  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};
