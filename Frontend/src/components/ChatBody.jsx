import React from 'react';

export default function ChatBody({ messages, currentUserStance }) {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message) => {
        const isCurrentUser = message.user.stance === currentUserStance;
        const isInFavor = message.user.stance === 'in-favor';
        
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
                    {message.user.name}
                  </span>
                )}
                
                <div
                  className={`rounded-lg p-3 ${
                    isInFavor
                      ? 'bg-blue-100 text-blue-900'
                      : 'bg-pink-100 text-pink-900'
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                  <span className="text-xs opacity-70 mt-1 block">
                    {message.timestamp}
                  </span>
                </div>
              </div>
              
              {isCurrentUser && (
                <img
                  src={message.user.image}
                  alt={message.user.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}