import React, { useState, useEffect } from 'react';
import { User2, Calendar, Clock } from 'lucide-react';
import Modal from 'react-modal';
import { format } from 'date-fns';
import Navbar from '../components/Navbar';
import LeftSideBar from '../components/LeftSideBar';
import Footer from '../components/Footer';
import debateService from '../services/debateService';

Modal.setAppElement('#root');

function FutureEvents() {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedDiscussion, setSelectedDiscussion] = useState(null);
  const [registrationData, setRegistrationData] = useState({
    stance: '',
    agreedToRules: false
  });
  const [registeredDiscussions, setRegisteredDiscussions] = useState(new Set());
  const [discussions, setDiscussions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDiscussions = async () => {
      try {
        const upcomingDebates = await debateService.getUpcomingDebates();
        setDiscussions(upcomingDebates);
      } catch (error) {
        console.error('Failed to fetch upcoming debates:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDiscussions();
  }, []);

  const openRegistrationModal = (discussion) => {
    setSelectedDiscussion(discussion);
    setModalIsOpen(true);
  };

  const handleRegistration = async (e) => {
    e.preventDefault();
    
    if (!registrationData.stance || !registrationData.agreedToRules) {
      alert('Please fill in all required fields and agree to the rules.');
      return;
    }

    try {
      const response = await debateService.registerForDebate(
        selectedDiscussion.id,
        registrationData.stance,
        registrationData.agreedToRules
      );

      // Update UI to show registered state
      setRegisteredDiscussions(prev => new Set([...prev, selectedDiscussion.id]));
      setModalIsOpen(false);
      setRegistrationData({ stance: '', agreedToRules: false });

      // Show success message
      alert('Successfully registered for the debate!');
    } catch (error) {
      // Show error message
      alert(error.response?.data?.message || 'Failed to register for debate');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="loader"></div>
      </div>
    );
  }

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

          {/* Main content - Between sidebars */}
          <div className="flex-1 ml-64 p-8 min-h-screen">
            <div className="max-w-7xl mx-auto">
              <h1 className="text-2xl font-bold text-gray-800 mb-8">Upcoming Discussions</h1>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {discussions.map(discussion => (
                  <div 
                    key={discussion.id}
                    className="bg-white rounded-lg shadow-md p-6 border border-gray-100"
                  >
                    <h3 className="text-lg font-medium text-gray-900">{discussion.title}</h3>
                    <p className="text-gray-600 mt-2">{discussion.description}</p>
                    <div className="flex items-center mt-4 space-x-3 text-sm text-gray-500">
                      <Calendar className="h-4 w-4" />
                      <span>{format(new Date(discussion.start_time), 'MMM dd, yyyy')}</span>
                      <Clock className="h-4 w-4 ml-2" />
                      <span>{format(new Date(discussion.start_time), 'hh:mm a')}</span>
                    </div>
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center space-x-2">
                        <User2 className="h-5 w-5 text-gray-400" />
                        <span className="text-sm text-gray-600">{discussion.moderator}</span>
                      </div>
                      {registeredDiscussions.has(discussion.id) ? (
                        <span className="text-sm px-3 py-1 bg-gray-200 rounded-full">Registered</span>
                      ) : (
                        <button
                          onClick={() => openRegistrationModal(discussion)}
                          className="text-sm px-3 py-1 bg-green-100 text-green-700 rounded-full hover:bg-green-200"
                        >
                          Register
                        </button>
                      )}
                    </div>
                  </div>
                ))}
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

      {/* Modal */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        className="relative max-w-lg mx-auto mt-20"
        overlayClassName="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center"
      >
        <div className="bg-gradient-to-br from-blue-600 to-violet-600 p-[8px] rounded-xl">
          <div className="bg-white rounded-xl p-6 space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Register for Discussion</h2>
            <h3 className="text-lg font-medium">{selectedDiscussion?.title}</h3>
            <form onSubmit={handleRegistration} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Choose your stance:</label>
                <label className="inline-flex items-center mr-4">
                  <input
                    type="radio"
                    name="stance"
                    value="in_favor"
                    onChange={(e) =>
                      setRegistrationData({ ...registrationData, stance: e.target.value })
                    }
                    className="form-radio text-blue-600"
                  />
                  <span className="ml-2">In Favor</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="stance"
                    value="against"
                    onChange={(e) =>
                      setRegistrationData({ ...registrationData, stance: e.target.value })
                    }
                    className="form-radio text-blue-600"
                  />
                  <span className="ml-2">Against</span>
                </label>
              </div>
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  checked={registrationData.agreedToRules}
                  onChange={(e) =>
                    setRegistrationData({ ...registrationData, agreedToRules: e.target.checked })
                  }
                  className="form-checkbox text-blue-600"
                />
                <span className="ml-2 text-sm text-gray-600">
                  I agree to follow the discussion rules
                </span>
              </label>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setModalIsOpen(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Register
                </button>
              </div>
            </form>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default FutureEvents;
