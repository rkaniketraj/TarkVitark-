import React from 'react';
import { Calendar } from 'lucide-react';
import { Link,useNavigate } from 'react-router';

function UpcomingDebates() {
  const navigate = useNavigate(); 
  const handleNavigate = (path) => {
    navigate(path);
  };
  return (
    <div
      //onClick={() => onClick()}
      onClick={()=>handleNavigate('/upcoming')}
      className="group cursor-pointer bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 max-w-3xl"
    >
      <div className="flex items-center gap-4 mb-4  ">
        <Calendar className="h-8 w-8 text-blue-500 group-hover:text-blue-600 transition-colors" />
        <h2 className="text-3xl font-semibold text-gray-800 group-hover:text-blue-600 transition-colors" data-translate="true">
          Upcoming Debates
        </h2>
      </div>
      <p className="text-gray-600 text-lg" data-translate="true">
        Explore upcoming debate topics and register to participate in future discussions.
      </p>
    </div>
  );
}

export default UpcomingDebates;
