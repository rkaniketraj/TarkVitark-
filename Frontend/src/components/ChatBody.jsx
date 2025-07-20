// import React from 'react';

// export default function ChatBody({ messages = [], currentUserStance }) {
//   if (!Array.isArray(messages)) {
//     return <div className="flex-1 overflow-y-auto p-4">No messages yet</div>;
//   }

//   return (
//     <div className="flex-1 overflow-y-auto p-4 space-y-4">
//       {messages.map((message, idx) => {
//         if (!message) return null;
        
//         // Normalize message data structure
//         const messageData = {
//           text: message.text || message.message || '',
//           user: {
//             name: message.user?.name || message.username || 'User',
//             stance: message.user?.stance || message.stance || 'neutral',
//             image: `https://ui-avatars.com/api/?name=${message.user?.name || message.username || 'U'}`
//           },
//           timestamp: message.timestamp || new Date().toLocaleTimeString()
//         };
        
//         const isCurrentUser = messageData.user.stance === currentUserStance;
//         const isInFavor = messageData.user.stance === 'in-favor';
//         return (
//           <div
//             key={message.id || idx}
//             className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
//           >
//             <div className="flex space-x-2 max-w-[70%]">
//               {!isCurrentUser && (
//                 <img
//                   src={userImage}
//                   alt={userName}
//                   className="w-8 h-8 rounded-full object-cover"
//                 />
//               )}
//               <div className="flex flex-col">
//                 {!isCurrentUser && (
//                   <span className="text-sm text-gray-600 mb-1">
//                     {userName}
//                   </span>
//                 )}
//                 <div
//                   className={`rounded-lg p-3 ${
//                     isInFavor
//                       ? 'bg-blue-100 text-blue-900'
//                       : 'bg-pink-100 text-pink-900'
//                   }`}
//                 >
//                   <p className="text-sm">{messageData.text}</p>
//                   <span className="text-xs opacity-70 mt-1 block">
//                     {messageData.timestamp}
//                   </span>
//                 </div>
//               </div>
//               {isCurrentUser && (
//                 <div className="flex-shrink-0">
//                   <img
//                     src={messageData.user.image}
//                     alt={messageData.user.name}
//                     className="w-8 h-8 rounded-full object-cover"
//                   />
//                 </div>
//               )}
//             </div>
//           </div>
//         );
//       })}
//     </div>
//   );
// }

import React from 'react';

export default function ChatBody({ messages = [], currentUserStance }) {
  if (!Array.isArray(messages)) {
    return <div className="flex-1 overflow-y-auto p-4">No messages yet</div>;
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message, idx) => {
        if (!message) return null;
        
        const messageData = {
          text: message.text || message.message || '',
          user: {
            name: message.user?.name || message.username || 'User',
            stance: message.user?.stance || message.stance || 'neutral',
            image: `https://ui-avatars.com/api/?name=${encodeURIComponent(message.user?.name || message.username || 'U')}`
          },
          timestamp: message.timestamp || new Date().toLocaleTimeString()
        };
        
        const isCurrentUser = messageData.user.stance === currentUserStance;
        const isInFavor = messageData.user.stance === 'in-favor';

        return (
          <div
            key={message.id || idx}
            className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
          >
            <div className="flex space-x-2 max-w-[70%]">
              {!isCurrentUser && (
                <img
                  src={messageData.user.image}
                  alt={messageData.user.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
              )}
              <div className="flex flex-col">
                {!isCurrentUser && (
                  <span className="text-sm text-gray-600 mb-1">
                    {messageData.user.name}
                  </span>
                )}
                <div
                  className={`rounded-lg p-3 ${
                    isInFavor
                      ? 'bg-blue-100 text-blue-900'
                      : 'bg-pink-100 text-pink-900'
                  }`}
                >
                  <p className="text-sm">{messageData.text}</p>
                  <span className="text-xs opacity-70 mt-1 block">
                    {messageData.timestamp}
                  </span>
                </div>
              </div>
              {isCurrentUser && (
                <div className="flex-shrink-0">
                  <img
                    src={messageData.user.image}
                    alt={messageData.user.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}