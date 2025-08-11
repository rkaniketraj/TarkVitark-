


import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { io } from 'socket.io-client';
import UpperHeader from '../components/UpperHeader';
import ChatBody from '../components/ChatBody';
import MessageInput from '../components/MessageInput';
import Navbar from '../components/Navbar';
import LeftSideBar from '../components/LeftSideBar';
import userService from '../services/userService';

const SOCKET_URL = `${import.meta.env.VITE_API_BASE_URL}`;

function DiscussionPage() {
  const [messages, setMessages] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const socketRef = useRef(null);
  // Ref to prevent effect from running twice in development's Strict Mode
  const effectRan = useRef(false);

  const location = useLocation();
  const { roomId, title, description, author } = location.state || {};

  // This single, robust useEffect handles all data loading and socket connections
  useEffect(() => {
    const fetchDataAndConnectSocket = async () => {
      try {
        setLoading(true);
        setError('');

        // 1. Get current user data
        const user = await userService.getCurrentUser();
        const stance = await userService.getDebateStance(roomId);
        const userData = { ...user, stance };
        setCurrentUser(userData);

        // 2. Fetch the persistent chat history
        // const historyResponse = await axios.get(`/messages/${roomId}`);
        const historyResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL}/messages/${roomId}`, {
        method: 'GET',
        credentials: 'include',
        body: payload
      });
        const history = historyResponse.data.data;
        setMessages(Array.isArray(history) ? history : []);

        // 3. Connect to WebSocket only after all data is loaded
        const socket = io(SOCKET_URL, {
          query: { userId: userData._id }
        });
        socketRef.current = socket;

        // --- Setup Socket Event Listeners ---
        socket.on('connect', () => {
          console.log('Socket connected, joining room...');
          socket.emit('joinRoom', { roomId });
        });

        socket.on('receiveMessage', (newMessage) => {
          setMessages(prev => [...prev, newMessage]);
        });

        socket.on('roomUpdate', (data) => {
          setParticipants(data.participants || []);
        });

        socket.on('error', (err) => {
          setError(err.message || 'A chat error occurred.');
        });

      } catch (err) {
        const errorMessage = err.response?.data?.message || 'Failed to load chat data or you are not registered.';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    // This condition ensures the setup runs only once, even in Strict Mode
    if (roomId && effectRan.current === false) {
      fetchDataAndConnectSocket();

      // The cleanup function is critical
      return () => {
        effectRan.current = true;
        if (socketRef.current) {
          console.log('Disconnecting socket...');
          socketRef.current.disconnect();
        }
      };
    }
  }, [roomId]); // Dependency array ensures this only re-runs if the room itself changes

  const handleSendMessage = (text) => {
    if (!text.trim() || !socketRef.current) return;
    
    // Send the correct, simplified payload to the backend
    const msgData = {
      roomId,
      content: text,
    };
    socketRef.current.emit('sendMessage', msgData);
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading Chat...</div>;
  }

  if (error) {
    return <div className="flex items-center justify-center min-h-screen text-red-600">{error}</div>;
  }

  if (!roomId || !title) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-600">
        Invalid discussion room. Please go back and try again.
      </div>
    );
  }

  // --- Your JSX structure remains unchanged ---
  return (
    <div className="flex flex-col min-h-screen">
      <div className="fixed top-0 w-full z-50">
        <Navbar />
      </div>
      <div className="flex flex-row pt-16 flex-grow">
        <div className="fixed left-0 top-16 bottom-0 w-64 overflow-y-auto bg-white border-r">
          <LeftSideBar />
        </div>
        <div className="ml-64 flex flex-col flex-grow bg-gray-50 relative">
          <div className="fixed left-64 right-0 top-16 bg-gray-50 z-40 shadow-md">
            <UpperHeader
              title={title}
              totalUsers={participants?.length || 0}
              inFavorCount={participants?.filter(p => p.stance === 'in-favor')?.length || 0}
              againstCount={participants?.filter(p => p.stance === 'against')?.length || 0}
              hostName={author}
              hostImage={`https://ui-avatars.com/api/?name=${encodeURIComponent(author || 'Host')}`}
            />
          </div>
          <div className="flex-1 mt-32 mb-20 overflow-y-auto px-4">
            <ChatBody
              messages={messages}
              currentUserStance={currentUser?.stance}
            />
          </div>
          <div className="fixed left-64 right-0 bottom-0 bg-gray-50 z-40 shadow-inner px-4 py-2">
            <MessageInput 
              onSendMessage={handleSendMessage}
              disabled={!!error || !currentUser}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default DiscussionPage;