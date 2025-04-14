import React, { createContext, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { io } from 'socket.io-client';

export const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const { isOnline } = useSelector((state) => state.isOnline);
  const [socket, setSocket] = useState(null);
  
  useEffect(() => {
    if (!isOnline) return;

    // Clean up previous socket if exists
    if (socket) {
      socket.disconnect();
    }

    const newSocket = io('https://api.tuplrc-cla.com', {
      transports: ['polling'],
      upgrade: false,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    });
    
    newSocket.on('connect', () => {
      console.log('Connected to socket server', newSocket.id);
    });
    
    newSocket.on('disconnect', (reason) => {
      console.log('Disconnected from socket server:', reason);
    });
    
    newSocket.on('connect_error', (error) => {
      console.error('Connection error:', error);
    });
    
    newSocket.on('error', (error) => {
      console.error('Socket error:', error);
    });
    
    setSocket(newSocket);
    
    // Clean up when unmounting or when isOnline changes
    return () => {
      console.log('Cleaning up socket connection');
      newSocket.disconnect();
    };
  }, [isOnline]);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};