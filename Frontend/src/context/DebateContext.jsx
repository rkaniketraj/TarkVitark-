import React, { createContext, useContext, useState, useEffect } from 'react';
import io from 'socket.io-client';
import { useAuth } from './AuthContext';
import debateService from '../services/debateService';

const DebateContext = createContext();

export const DebateProvider = ({ children }) => {
  const { isLoggedIn, accessToken } = useAuth();
  const [socket, setSocket] = useState(null);
  const [currentDebate, setCurrentDebate] = useState(null);
  const [messages, setMessages] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Initialize socket connection
  useEffect(() => {
    if (isLoggedIn && accessToken) {
      const newSocket = io(process.env.VITE_SOCKET_URL || 'http://localhost:3000', {
        auth: { token: accessToken },
        transports: ['websocket'],
        autoConnect: true
      });

      // Socket event handlers
      newSocket.on('connect', () => {
        console.log('Socket connected');
      });

      newSocket.on('error', (error) => {
        console.error('Socket error:', error);
        setError(error.message);
      });

      setSocket(newSocket);

      return () => {
        newSocket.close();
      };
    }
  }, [isLoggedIn, accessToken]);

  // Join a debate room
  const joinDebate = async (debateId) => {
    try {
      setLoading(true);
      setError(null);

      // Get debate details from API
      const debate = await debateService.getDebateDetails(debateId);
      setCurrentDebate(debate);

      // Join socket room
      if (socket) {
        socket.emit('joinRoom', { roomId: debateId });

        // Set up room-specific event listeners
        socket.on('roomState', ({ debate, messages, activeUsers, typingUsers }) => {
          setCurrentDebate(debate);
          setMessages(messages);
          setParticipants(activeUsers);
          setTypingUsers(typingUsers);
        });

        socket.on('newMessage', (message) => {
          setMessages(prev => [...prev, message]);
        });

        socket.on('userJoined', ({ user }) => {
          setParticipants(prev => [...prev, user]);
        });

        socket.on('userLeft', ({ userId }) => {
          setParticipants(prev => prev.filter(p => p._id !== userId));
        });

        socket.on('userTyping', ({ userId, username }) => {
          setTypingUsers(prev => [...prev, { userId, username }]);
        });

        socket.on('userStoppedTyping', ({ userId }) => {
          setTypingUsers(prev => prev.filter(user => user.userId !== userId));
        });

        socket.on('debateUpdate', ({ type, data }) => {
          switch (type) {
            case 'status':
              setCurrentDebate(prev => ({ ...prev, status: data.status }));
              break;
            case 'vote':
              setCurrentDebate(prev => ({ ...prev, statistics: { ...prev.statistics, ...data } }));
              break;
            default:
              break;
          }
        });
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Leave current debate
  const leaveDebate = () => {
    if (socket && currentDebate) {
      socket.emit('leaveRoom', { roomId: currentDebate._id });
      socket.off('roomState');
      socket.off('newMessage');
      socket.off('userJoined');
      socket.off('userLeft');
      socket.off('userTyping');
      socket.off('userStoppedTyping');
      socket.off('debateUpdate');
    }
    setCurrentDebate(null);
    setMessages([]);
    setParticipants([]);
    setTypingUsers([]);
  };

  // Send a message
  const sendMessage = async (content, voiceUrl = null) => {
    if (!socket || !currentDebate) {
      throw new Error('Not connected to debate room');
    }

    socket.emit('sendMessage', {
      roomId: currentDebate._id,
      content,
      voiceUrl
    });
  };

  // Handle typing indicators
  const startTyping = () => {
    if (socket && currentDebate) {
      socket.emit('typing', { roomId: currentDebate._id });
    }
  };

  const stopTyping = () => {
    if (socket && currentDebate) {
      socket.emit('stopTyping', { roomId: currentDebate._id });
    }
  };

  // Vote on debate
  const vote = async (stance) => {
    if (!currentDebate) return;
    
    try {
      const response = await debateService.voteOnDebate(currentDebate._id, stance);
      setCurrentDebate(prev => ({
        ...prev,
        statistics: response.statistics
      }));
    } catch (error) {
      setError(error.message);
    }
  };

  const value = {
    socket,
    currentDebate,
    messages,
    participants,
    typingUsers,
    loading,
    error,
    joinDebate,
    leaveDebate,
    sendMessage,
    startTyping,
    stopTyping,
    vote
  };

  return (
    <DebateContext.Provider value={value}>
      {children}
    </DebateContext.Provider>
  );
};

export const useDebate = () => {
  const context = useContext(DebateContext);
  if (!context) {
    throw new Error('useDebate must be used within a DebateProvider');
  }
  return context;
};
