// src/socket.js
import { io } from 'socket.io-client';

// Replace with your backend URL
const SOCKET_URL = 'https://api.tuplrc-cla.com'; 

const socket = io(SOCKET_URL, {
  autoConnect: false, // Optional: prevent auto connect
  withCredentials: true,
});

export default socket;
