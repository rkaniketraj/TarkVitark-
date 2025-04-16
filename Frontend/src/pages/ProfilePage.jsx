import React from 'react';
import Button from '../components/Button';
import { Users, UserCircle2 } from 'lucide-react';
import Navbar from '../components/Navbar';
import LeftSideBar from '../components/LeftSideBar';
import Footer from '../components/Footer';

export default function ProfilePage() {
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
          {/* Left Sidebar - Fixed */}
          <div className="fixed left-0 top-16 bottom-0 w-64 overflow-y-auto">
            <LeftSideBar />
          </div>

          {/* Main content - Profile Section */}
          <div className="flex-1 ml-64 p-8 min-h-screen">
            <div className="max-w-4xl mx-auto">
              {/* Profile Content */}
              <div className="bg-white rounded-2xl shadow-md p-8 w-full text-center">
                <div className="flex flex-col items-center space-y-4">
                  {/* Profile Picture with Gradient Border */}
                  <div className="relative bg-gradient-to-br from-blue-600 to-violet-600 p-2 rounded-full">
                    <div className="w-32 h-32 rounded-full bg-white overflow-hidden">
                      <img
                        src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=256"
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  {/* User Info */}
                  <div className="mt-6 text-center">
                    <h1 className="text-2xl font-bold text-gray-900">Sarah Anderson</h1>
                    <p className="text-gray-600 mt-1">@sarahanderson</p>
                  </div>

                  {/* Stats */}
                  <div className="flex gap-12 mt-6">
                    <div className="text-center">
                      <div className="flex items-center gap-2">
                        <Users size={20} className="text-gray-600" />
                        <span className="text-2xl font-bold text-gray-900">2.5k</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">Followers</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center gap-2">
                        <UserCircle2 size={20} className="text-gray-600" />
                        <span className="text-2xl font-bold text-gray-900">1.2k</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">Following</p>
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="flex justify-center gap-4 mt-6">
                    <Button
                      className="bg-gradient-to-br from-blue-600 to-violet-600 text-white"
                      onClick={() => {}}
                    >
                      Events Hosted
                    </Button>
                    <Button
                      className="bg-gradient-to-br from-blue-600 to-violet-600 text-white"
                      onClick={() => {}}
                    >
                      Events Participated
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="w-full mt-auto bg-gray-800">
          <div className="w-full max-w-7xl mx-auto py-6 px-8 text-white">
            <Footer />
          </div>
        </div>
      </div>
    </div>
  );
}
