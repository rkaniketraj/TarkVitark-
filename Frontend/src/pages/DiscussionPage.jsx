import React, { useState, useEffect, useRef } from 'react';
import UpperHeader from '../components/UpperHeader';
import ChatBody from '../components/ChatBody';
import MessageInput from '../components/MessageInput';
import Navbar from '../components/Navbar';
import LeftSideBar from '../components/LeftSideBar';
import { useLocation } from 'react-router-dom';
import { io } from 'socket.io-client';
import userService from '../services/userService';




const SOCKET_URL = 'http://localhost:3001'; // Change if needed

function DiscussionPage() {
  const [messages, setMessages] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [socketError, setSocketError] = useState('');
  const socketRef = useRef(null);

  const location = useLocation();
  const { roomId, title, description, author } = location.state || {};

  useEffect(() => {
    // Fetch current user info and stance for this debate room
    const fetchUserAndStance = async () => {
      try {
        const user = await userService.getCurrentUser();
        let stance = undefined;
        if (roomId) {
          try {
            stance = await userService.getDebateStance(roomId);
          } catch (err) {
            setSocketError('You are not registered for this debate room.');
            return;
          }
        }
        setCurrentUser({ ...user, stance });
      } catch (err) {
        setSocketError('Failed to load user info');
      }
    };
    fetchUserAndStance();
  }, [roomId]);

  useEffect(() => {
    if (!currentUser || !roomId) return;

    setLoading(true);
    setSocketError('');
    socketRef.current = io(SOCKET_URL);

    socketRef.current.emit('joinRoom', {
      roomId,
      userId: currentUser._id,
      username: currentUser.fullName || currentUser.username,
      stance: currentUser.stance, // You may need to fetch stance from registration
    });

    socketRef.current.on('roomUpdate', (data) => {
      setParticipants(data.participants);
    });

    socketRef.current.on('receiveMessage', (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    socketRef.current.on('error', (err) => {
      setSocketError(err.message || 'Socket error');
    });

    setLoading(false);

    return () => {
      socketRef.current.disconnect();
    };
  }, [currentUser, roomId]);

  const handleSendMessage = (text) => {
    if (!text.trim() || !currentUser) return;
    const msgData = {
      roomId,
      userId: currentUser._id,
      username: currentUser.fullName || currentUser.username,
      stance: currentUser.stance, // You may need to fetch stance from registration
      message: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    socketRef.current.emit('sendMessage', msgData);
    setMessages((prev) => [...prev, { user: { name: msgData.username, stance: msgData.stance }, text, timestamp: msgData.timestamp }]);
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }
  if (socketError) {
    return <div className="flex items-center justify-center min-h-screen text-red-600">{socketError}</div>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar - Fixed at top */}
      <div className="fixed top-0 w-full z-50">
        <Navbar />
      </div>
      <div className="flex flex-row pt-16 flex-grow">
        {/* Left Sidebar */}
        <div className="fixed left-0 top-16 bottom-0 w-64 overflow-y-auto bg-white border-r">
          <LeftSideBar />
        </div>
        {/* Main Chat Area */}
        <div className="ml-64 flex flex-col flex-grow bg-gray-50 relative">
          {/* Fixed Header in main area */}
          <div className="fixed left-64 right-0 top-16 bg-gray-50 z-40 shadow-md">
            <UpperHeader
              title={title}
              totalUsers={participants.length}
              inFavorCount={participants.filter(p => p.stance === 'in-favor').length}
              againstCount={participants.filter(p => p.stance === 'against').length}
              hostName={author}
              hostImage="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e"
            />
          </div>
          {/* ChatBody - Scrollable */}
          <div className="flex-1 mt-32 mb-20 overflow-y-auto px-4">
            <ChatBody
              messages={messages}
              currentUserStance={currentUser?.stance}
            />
          </div>
          {/* Fixed Footer Input */}
          <div className="fixed left-64 right-0 bottom-0 bg-gray-50 z-40 shadow-inner px-4 py-2">
            <MessageInput onSendMessage={handleSendMessage} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default DiscussionPage;
  