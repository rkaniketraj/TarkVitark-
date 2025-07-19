import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

export default function ChatBody({ messages, currentUser, loading = false, error = null }) {
  const messagesEndRef = useRef(null);
  const containerRef = useRef(null);

  const scrollToBottom = () => {
    // Use RAF to ensure DOM is ready
    requestAnimationFrame(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    });
  };

  useEffect(() => {
    if (messages?.length > 0) {
      scrollToBottom();
    }
  }, [messages]);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  if (!Array.isArray(messages)) {
    console.error('Messages prop is not an array:', messages);
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-red-500">Error loading messages</div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message) => {
        if (!message || !message.sender) {
          console.error('Invalid message object:', message);
          return null;
        }

        const isCurrentUser = message.sender._id === currentUser?._id;
        const stance = message.stance || 'neutral';
        
        return (
          <div
            key={message.id}
            className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
          >
            <div className="flex space-x-2 max-w-[70%]">
              {!isCurrentUser && (
                <img
                  src={message.user.image}
                  alt={message.user.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
              )}
              
              <div className="flex flex-col">
                {!isCurrentUser && (
                  <span className="text-sm text-gray-600 mb-1">
                    {message.sender.username}
                  </span>
                )}
                
                <div
                  className={`rounded-lg p-3 ${
                    stance === 'for'
                      ? 'bg-blue-100 text-blue-900'
                      : stance === 'against'
                      ? 'bg-pink-100 text-pink-900'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <span className="text-xs opacity-70 mt-1 block">
                    {new Date(message.createdAt).toLocaleTimeString()}
                  </span>
                </div>
              </div>
              
              {isCurrentUser && (
                <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                  <span className="text-sm font-medium text-gray-600">
                    {message.sender.username.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>
          </div>
        );
      })}
      <div ref={messagesEndRef} />
    </div>
  );
}

ChatBody.propTypes = {
  messages: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string,
      content: PropTypes.string.isRequired,
      sender: PropTypes.shape({
        _id: PropTypes.string.isRequired,
        username: PropTypes.string.isRequired
      }).isRequired,
      stance: PropTypes.string,
      createdAt: PropTypes.string.isRequired
    })
  ).isRequired,
  currentUser: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired
  })
};