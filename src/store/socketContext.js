import React, { createContext, useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { io } from 'socket.io-client';

export const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const { isOnline } = useSelector((state) => state.isOnline);
  const socketRef = useRef(null);
  
  useEffect(() => {
    if (!isOnline) return;
  
    if (socketRef.current) {
      socketRef.current.disconnect();
    }
  
    const newSocket = io('https://api.tuplrc-cla.com', {
      transports: ['polling'],
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
  
    socketRef.current = newSocket;
  
    return () => {
      console.log('Cleaning up socket connection');
      socketRef.current?.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={socketRef.current}>
      {children}
    </SocketContext.Provider>
  );
};