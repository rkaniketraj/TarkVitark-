import React from 'react';
import { Calendar } from 'lucide-react';

function UpcomingDebates({ onClick }) {
  return (
    <div
      onClick={() => onClick('/upcoming-debates')}
      className="group cursor-pointer bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 max-w-3xl"
    >
      <div className="flex items-center gap-4 mb-4 ">
        <Calendar className="h-8 w-8 text-blue-500 group-hover:text-blue-600 transition-colors" />
        <h2 className="text-3xl font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
          Upcoming Debates
        </h2>
      </div>
      <p className="text-gray-600 text-lg">
        Explore upcoming debate topics and register to participate in future discussions.
      </p>
    </div>
  );
}

export default UpcomingDebates;
