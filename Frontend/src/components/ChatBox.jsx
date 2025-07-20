// import React from 'react';

// export default function ChatBody({ messages, currentUserStance }) {
//   return (
//     <div className="flex-1 overflow-y-auto p-4 space-y-4">
//       {messages.map((message) => {
//         const isCurrentUser = message.user.stance === currentUserStance;
//         const isInFavor = message.user.stance === 'in-favor';
        
//         return (
//           <div
//             key={message.id}
//             className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
//           >
//             <div className="flex space-x-2 max-w-[70%]">
//               {!isCurrentUser && (
//                 <img
//                   src={message.user.image}
//                   alt={message.user.name}
//                   className="w-8 h-8 rounded-full object-cover"
//                 />
//               )}
              
//               <div className="flex flex-col">
//                 {!isCurrentUser && (
//                   <span className="text-sm text-gray-600 mb-1">
//                     {message.user.name}
//                   </span>
//                 )}
                
//                 <div
//                   className={`rounded-lg p-3 ${
//                     isInFavor
//                       ? 'bg-blue-100 text-blue-900'
//                       : 'bg-pink-100 text-pink-900'
//                   }`}
//                 >
//                   <p className="text-sm">{message.text}</p>
//                   <span className="text-xs opacity-70 mt-1 block">
//                     {message.timestamp}
//                   </span>
//                 </div>
//               </div>
              
//               {isCurrentUser && (
//                 <img
//                   src={message.user.image}
//                   alt={message.user.name}
//                   className="w-8 h-8 rounded-full object-cover"
//                 />
//               )}
//             </div>
//           </div>
//         );
//       })}
//     </div>
//   );
// }




import React, { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';

const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const ChatBox = ({ user, debateId, isRegistered }) => {
  const [socket, setSocket] = useState(null);
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);
  const bottomRef = useRef(null);

  useEffect(() => {
    const newSocket = io(VITE_API_BASE_URL, {
      withCredentials: true,
    });

    newSocket.emit('join-room', { debateId, user });
    setSocket(newSocket);

    newSocket.on('receive-message', (data) => {
      setChat((prev) => [...prev, data]);
    });

    newSocket.on('message-deleted', (data) => {
      alert('A message was removed by AI moderator.');
    });

    return () => {
      newSocket.disconnect();
    };
  }, [debateId, user]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chat]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      socket.emit('send-message', { debateId, user, message });
      setMessage('');
    }
  };

  return (
    <div className="border rounded-lg p-4 max-h-[400px] overflow-y-auto bg-gray-50">
      <h3 className="font-bold mb-2">Live Chat</h3>
      <div className="space-y-2 mb-4 max-h-64 overflow-y-auto">
        {/* {chat.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.user.id === user.id ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`px-4 py-2 rounded-lg max-w-xs text-sm ${msg.user.id === user.id ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-800'}`}>
              <span className="block font-medium">{msg.user.username}</span>
              <span>{msg.message}</span>
            </div>
          </div>
        ))} */}

        {chat.map((msg, index) => {
  const isSender = msg.user.id === user.id;
  return (
    <div
      key={index}
      className={`flex ${isSender ? 'justify-end' : 'justify-start'}`}
    >
      <div className={`px-4 py-2 rounded-lg max-w-xs text-sm shadow ${isSender ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-900'}`}>
        <p className="text-xs font-semibold mb-1">
          {msg.user.username || 'Unknown'}
        </p>
        <p>{msg.message}</p>
      </div>
    </div>
  );
})}

        <div ref={bottomRef} />
      </div>

      {isRegistered ? (
        <form onSubmit={sendMessage} className="flex gap-2">
          <input
            type="text"
            placeholder="Type your message..."
            className="flex-1 px-3 py-2 border rounded"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
            Send
          </button>
        </form>
      ) : (
        <p className="text-sm text-gray-600">You must register to participate in the chat.</p>
      )}
    </div>
  );
};

export default ChatBox;
