import React, { createContext, useRef, useEffect } from 'react';
import { io } from 'socket.io-client';

export const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const socketRef = useRef(null);

  useEffect(() => {
    if (!socketRef.current) {
      socketRef.current = io('https://api.tuplrc-cla.com', {
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000
      });

      socketRef.current.on('connect', () => {
        console.log('Connected to socket server', socketRef.current.id);
      });

      socketRef.current.on('disconnect', (reason) => {
        console.log('Disconnected from socket server:', reason);
      });

      socketRef.current.on('connect_error', (error) => {
        console.error('Connection error:', error);
      });

      socketRef.current.on('error', (error) => {
        console.error('Socket error:', error);
      });
    }

    // Clean up when component unmounts
    return () => {
      if (socketRef.current) {
        console.log('Cleaning up socket connection');
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, []);

  return (
    <SocketContext.Provider value={socketRef.current}>
      {children}
    </SocketContext.Provider>
  );
};
