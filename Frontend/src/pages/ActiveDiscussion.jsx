export default ActiveDiscussion;

import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import LeftSideBar from '../components/LeftSideBar';
import Footer from '../components/Footer';
import Box from '../components/ActiveBox';
import debateService from '../services/debateService';
import userService from '../services/userService';

function ActiveDiscussion() {
  const navigate = useNavigate();
  const [activeDebates, setActiveDebates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const u = await userService.getCurrentUser();
        setUser(u);
      } catch (e) {
        setUser(null);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const fetchActiveDebates = async () => {
      try {
        const data = await debateService.getActiveDebates();
        setActiveDebates(data);
      } catch (error) {
        console.error('Error fetching active debates:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchActiveDebates();
    const interval = setInterval(fetchActiveDebates, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleBoxClick = (debate) => {
  try {
    navigate('/discuss', {
      state: {
        roomId: debate._id, // Pass debate id for DiscussionPage
        title: debate.title,
        description: debate.description,
        author: debate.host?.username || 'Unknown',
      },
    });
  } catch (error) {
    console.error('Navigation error:', error);
  }
};

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <div className="fixed top-0 w-full z-50">
        <Navbar />
      </div>

      {/* Main Content */}
      <div className="flex flex-col flex-grow">
        <div className="flex pt-16">
          {/* Sidebar */}
          <div className="fixed left-0 top-16 bottom-0 w-64 overflow-y-auto">
            <LeftSideBar />
          </div>

          {/* Main Area */}
          <div className="flex-1 ml-64 p-8 min-h-screen">
            <div className="max-w-7xl mx-auto">
              <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold text-gray-800">Active Discussions</h1>
                <button
                  onClick={() => {}}
                  disabled
                  className="flex items-center gap-2 px-4 py-2 bg-gray-400 text-white rounded-lg cursor-not-allowed"
                  title="Debates can only be started from the Host page"
                >
                  <Plus size={20} />
                  Add New Topic
                </button>
              </div>

              {loading ? (
                <div className="text-center text-gray-500">Loading active discussions...</div>
              ) : activeDebates.length === 0 ? (
                <div className="text-center text-gray-500">No active debates right now.</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1">
                  {activeDebates.map((debate) => (
                    <div key={debate._id} className="relative rounded-lg p-4 bg-white flex flex-col gap-2"
>
                      <Box
                        title={debate.title}
                        description={debate.description}
                        author={debate.host?.username || 'Unknown'}
                        onClick={() => handleBoxClick(debate)}
                      />
                    </div>
                  ))}
                </div>
              )}
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
