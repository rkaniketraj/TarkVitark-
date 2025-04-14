import React from 'react';
import Navbar from '../components/Navbar';
import NotificationBar from '../components/Notification';
import UpcomingDebates from '../components/UpcomingDebates';
import ActiveDebates from '../components/ActiveDebates';
import Footer from '../components/Footer';
import LeftSideBar from '../components/LeftSideBar';
import { Link,useNavigate } from 'react-router';

function HomePage() {
  const navigate = useNavigate(); 
  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar - Fixed at top */}
      <div className="fixed top-0 w-full z-50">
        <Navbar />
      </div>

      {/* Main container */}
      <div className="flex flex-col flex-grow">
        {/* Content wrapper with sidebars */}
        <div className="flex pt-16">
          {/* Left Sidebar - Fixed until footer */}
          <div className="fixed left-0 top-16 bottom-0 w-64 overflow-y-auto">
            <LeftSideBar />
          </div>

          {/* Main content - Between sidebars */}
          <div className="flex-1 ml-64 mr-80 p-8 min-h-screen">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-4xl font-bold mb-8 text-gray-800">
                Welcome 112! Ready to debate?
              </h1>
              <div className="flex flex-col w-full space-y-8">
                <UpcomingDebates />
                <ActiveDebates onClick={()=>handleNavigate('/active')} />
              </div>
            </div>
          </div>

          {/* Notification bar - Fixed until footer */}
          <div className="fixed right-0 top-16 bottom-0 w-80 overflow-y-auto">
            <NotificationBar />
          </div>
        </div>

        {/* Footer - Full width after content */}
        <div className="w-full mt-auto bg-gray-800">
          <div className="w-full max-w-7xl mx-auto py-6 px-8 text-white">
            <Footer />
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
