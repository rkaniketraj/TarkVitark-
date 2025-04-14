import React, { useState } from 'react';
import UpperHeader from '../components/UpperHeader';
import ChatBody from '../components/ChatBody';
import MessageInput from '../components/MessageInput';
import Navbar from '../components/Navbar';
import LeftSideBar from '../components/LeftSideBar';
import { useLocation } from 'react-router-dom';

// Mock data - replace with real data when integrating with backend
const mockMessages = [
  {
    id: '1',
    text: 'I strongly believe we should consider the environmental impact.',
    user: {
      name: 'Alice Johnson',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
      stance: 'in-favor',
    },
    timestamp: '2:30 PM',
  },
  {
    id: '2',
    text: 'The economic factors cannot be ignored in this discussion.',
    user: {
      name: 'Bob Smith',
      image: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36',
      stance: 'against',
    },
    timestamp: '2:32 PM',
  },
];

function DiscussionPage() {
  const [messages, setMessages] = useState(mockMessages);

  // Mock user stance - replace with real user data
  const currentUserStance = 'in-favor';

  //  Correct usage of useLocation
  const location = useLocation();
  const { title, description, author } = location.state || {};

  const handleSendMessage = (text) => {
    const newMessage = {
      id: Date.now().toString(),
      text,
      user: {
        name: 'Current User',
        image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e',
        stance: currentUserStance,
      },
      timestamp: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    setMessages((prev) => [...prev, newMessage]);
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar - Fixed at top */}
      <div className="fixed top-0 w-full z-50">
        <Navbar />
      </div>

      {/* Content Area starts below the fixed navbar */}
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
              totalUsers={125}
              inFavorCount={75}
              againstCount={50}
              hostName={author}
              hostImage="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e"
            />
          </div>

          {/* ChatBody - Scrollable */}
          <div className="flex-1 mt-32 mb-20 overflow-y-auto px-4">
            <ChatBody
              messages={messages}
              currentUserStance={currentUserStance}
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
  