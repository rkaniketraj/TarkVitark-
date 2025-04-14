import React, { useState } from 'react';
import { Send, Mic, X } from 'lucide-react';

export default function MessageInput({ onSendMessage }) {
  const [message, setMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  
  const handleSendMessage = () => {
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };
  
  const startVoiceRecording = () => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new window.webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      
      recognition.onstart = () => {
        setIsRecording(true);
      };
      
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setMessage((prev) => prev + ' ' + transcript);
      };
      
      recognition.onend = () => {
        setIsRecording(false);
      };
      
      recognition.start();
    }
  };
  
  return (
    <div className="border-t bg-white p-4">
      <div className="flex items-center space-x-2">
        <div className="flex-1 relative">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            className="w-full p-3 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            rows={1}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
          />
          
          {isRecording && (
            <button
              onClick={() => setIsRecording(false)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-red-500 hover:text-red-600"
            >
              <X size={20} />
            </button>
          )}
        </div>
        
        <button
          onClick={startVoiceRecording}
          className={`p-2 rounded-full ${
            isRecording
              ? 'bg-red-100 text-red-500'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <Mic size={20} />
        </button>
        
        <button
          onClick={handleSendMessage}
          className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600"
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
}