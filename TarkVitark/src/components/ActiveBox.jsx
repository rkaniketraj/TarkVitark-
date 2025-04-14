// components/Box.jsx
import React from 'react';
import { User2 } from 'lucide-react';

function Box({ title, description, author,onClick }) {
  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-100 p-6 transition-all hover:shadow-lg" 
    onClick={onClick}>
        
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        <p className="text-gray-600">{description}</p>
        <div className="flex items-center justify-between pt-4">
          <div className="flex items-center space-x-2">
            <User2 className="h-5 w-5 text-gray-400" />
            <span className="text-sm text-gray-600">{author}</span>
          </div>
          <button className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded-full font-medium flex items-center">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
            Live
          </button>
        </div>
      </div>
    </div>
  );
}

export default Box;
