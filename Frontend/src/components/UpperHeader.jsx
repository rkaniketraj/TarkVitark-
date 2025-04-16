import React from 'react';
import { ChevronDown, Users, ThumbsUp, ThumbsDown } from 'lucide-react';

export default function UpperHeader({
  title,
  totalUsers,
  inFavorCount,
  againstCount,
  hostName,
  hostImage,
}) {
  return (
    <div className="bg-white shadow-sm p-4 flex justify-between items-center">
      <div className="flex items-center space-x-4">
        <h1 className="text-xl font-semibold text-gray-800">{title}</h1>
        
        <div className="relative group">
          <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-800">
            <span>Stats</span>
            <ChevronDown size={16} />
          </button>
          
          <div className="absolute hidden group-hover:block w-48 bg-white border rounded-lg shadow-lg mt-2 p-2 z-10">
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-gray-600">
                <Users size={16} />
                <span>Total Users: {totalUsers}</span>
              </div>
              <div className="flex items-center space-x-2 text-blue-600">
                <ThumbsUp size={16} />
                <span>In Favor: {inFavorCount}</span>
              </div>
              <div className="flex items-center space-x-2 text-pink-600">
                <ThumbsDown size={16} />
                <span>Against: {againstCount}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex items-center space-x-3">
        <span className="text-gray-700">{hostName}</span>
        <img
          src={hostImage}
          alt={hostName}
          className="w-8 h-8 rounded-full object-cover"
        />
      </div>
    </div>
  );
}