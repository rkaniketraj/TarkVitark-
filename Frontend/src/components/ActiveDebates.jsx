import React from 'react';
import { MessageSquare } from 'lucide-react';

function ActiveDebates({ onClick }) {
  return (
    <div
      onClick={() => onClick()}
      className="group cursor-pointer bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1  max-w-3xl"
    >
      <div className="flex items-center gap-4 mb-4">
        <MessageSquare className="h-8 w-8 text-green-500 group-hover:text-green-600 transition-colors" />
        <h2 className="text-3xl font-semibold text-gray-800 group-hover:text-green-600 transition-colors">
          Active Debates
        </h2>
      </div>
      <p className="text-gray-600 text-lg">
        Join ongoing debates and engage in real-time discussions with other participants.
      </p>
    </div>
  );
}

export default ActiveDebates;
