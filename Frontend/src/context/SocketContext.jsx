import React, { createContext, useContext, useEffect, useState } from 'react';
import { socketService } from '../services/socketService';
import { useAuth } from './AuthContext';

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const { token } = useAuth();
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (token) {
      socketService.connect(token);
      const socket = socketService.socket;

      if (socket) {
        socket.on('connect', () => {
          setIsConnected(true);
          setError(null);
        });

        socket.on('disconnect', () => {
          setIsConnected(false);
        });

        socket.on('connect_error', (error) => {
          setError(error.message);
        });

        socket.on('authError', () => {
          setError('Authentication failed');
        });

        socket.on('maxReconnectAttemptsReached', () => {
          setError('Unable to connect to server');
        });
      }

      return () => {
        if (socket) {
          socket.off('connect');
          socket.off('disconnect');
          socket.off('connect_error');
          socket.off('authError');
          socket.off('maxReconnectAttemptsReached');
        }
        socketService.disconnect();
      };
    }
  }, [token]);

  const value = {
    socket: socketService,
    isConnected,
    error,
    clearError: () => setError(null)
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};
