import React, { useState, useEffect } from 'react';
import { User2, Calendar, Clock, PlusCircle } from 'lucide-react';
import Modal from 'react-modal';
import { format } from 'date-fns';
import Navbar from '../components/Navbar';
import LeftSideBar from '../components/LeftSideBar';
import Footer from '../components/Footer';
import debateService from '../services/debateService';
import userService from '../services/userService';

Modal.setAppElement('#root');

function FutureEvents() {
  const [currentUser, setCurrentUser] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedDiscussion, setSelectedDiscussion] = useState(null);
  const [registrationData, setRegistrationData] = useState({
    stance: '',
    agreedToRules: false
  });
  const [registeredDiscussions, setRegisteredDiscussions] = useState(new Set());
  const [discussions, setDiscussions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Host Debate Modal State
  const [hostModalOpen, setHostModalOpen] = useState(false);
  const [hostForm, setHostForm] = useState({
    topic: '',
    description: '',
    date: '',
    time: ''
  });

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [upcomingDebates, user] = await Promise.all([
          debateService.getUpcomingDebates(),
          userService.getCurrentUser()
        ]);
        setDiscussions(upcomingDebates);
        setCurrentUser(user);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
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
        selectedDiscussion.id || selectedDiscussion._id,
        registrationData.stance,
        registrationData.agreedToRules
      );

      setRegisteredDiscussions(prev => new Set([...prev, selectedDiscussion.id]));
      setModalIsOpen(false);
      setRegistrationData({ stance: '', agreedToRules: false });

      alert('Successfully registered for the debate!');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to register for debate');
    }
  };

  const handleUnregister = async (debateId) => {
    try {
      await debateService.unregisterFromDebate(debateId);
      setRegisteredDiscussions(prev => {
        const updated = new Set(prev);
        updated.delete(debateId); // remove from registered set
        return updated;
      });
      alert("You have been unregistered from the debate.");
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to unregister');
    }
  };

  // Host Debate Handlers
  const openHostModal = () => setHostModalOpen(true);
  const closeHostModal = () => setHostModalOpen(false);

  const handleHostInputChange = (e) => {
    const { name, value } = e.target;
    setHostForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleHostSubmit = async (e) => {
    e.preventDefault();
    if (!hostForm.topic || !hostForm.description || !hostForm.date || !hostForm.time) {
      alert('Please fill in all fields.');
      return;
    }
    if (!currentUser || !currentUser._id) {
      alert('User info not loaded. Please log in again.');
      return;
    }
    // Combine date and time into ISO string
    const start_time = new Date(`${hostForm.date}T${hostForm.time}`);
    if (start_time < new Date()) {
      alert('Scheduled time must be in the future.');
      return;
    }
    try {
      // Create the debate room with host as initial participant
      const payload = {
        name: hostForm.topic,
        description: hostForm.description,
        scheduledAt: start_time.toISOString(),
        participants: [currentUser._id]
      };
      const response = await debateService.createDebateRoom(payload);
      alert('Debate room created successfully!');
      setHostModalOpen(false);
      setHostForm({ topic: '', description: '', date: '', time: '' });
      setDiscussions(prev => [response, ...prev]);
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to create debate room');
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
              <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold text-gray-800">Upcoming Discussions</h1>
                <button
                  onClick={openHostModal}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
                >
                  <PlusCircle className="w-5 h-5" />
                  Host a Debate
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {discussions.map(discussion => {
  // Use scheduledAt for the event time
  const isPast = new Date(discussion.scheduledAt) <= new Date();
  return (
    <div
      key={discussion.id || discussion._id}
      className="bg-white rounded-lg shadow-md p-6 border border-gray-100"
    >
      <h3 className="text-lg font-medium text-gray-900">{discussion.title}</h3>
      <p className="text-gray-600 mt-2">{discussion.description}</p>
      <div className="flex items-center mt-4 space-x-3 text-sm text-gray-500">
        <Calendar className="h-4 w-4" />
        {/* {discussion.start_time && !isNaN(new Date(discussion.start_time)) ? (
                        <span>{format(new Date(discussion.start_time), 'MMM dd, yyyy')}</span>
                      ) : (
                        <span>Invalid date</span>
                      )} */}
                      {discussion.scheduledAt && !isNaN(new Date(discussion.scheduledAt)) ? (
                    <span>{format(new Date(discussion.scheduledAt), 'MMM dd, yyyy')}</span>
                    ) : (
                  <span>Invalid date</span>
                      )}

                      <Clock className="h-4 w-4 ml-2" />
                      {discussion.scheduledAt && !isNaN(new Date(discussion.scheduledAt)) ? (
                        <span>{format(new Date(discussion.scheduledAt), 'hh:mm a')}</span>
                      ) : (
                        <span>Invalid time</span>
                      )}
                    </div>
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center space-x-2">
                        <User2 className="h-5 w-5 text-gray-400" />
                        <span className="text-sm text-gray-600">{discussion.host.username}</span>
                      </div>
                      {!isPast && (
                        registeredDiscussions.has(discussion.id || discussion._id) ? (
                          <button
                            onClick={() => handleUnregister(discussion.id || discussion._id)}
                            className="text-sm px-3 py-1 bg-gray-300 text-gray-700 rounded-full hover:bg-gray-400"
                          >
                            Unregister
                          </button>
                        ) : (
                          <button
                            onClick={() => openRegistrationModal(discussion)}
                            className="text-sm px-3 py-1 bg-green-100 text-green-700 rounded-full hover:bg-green-200"
                          >
                            Register
                          </button>
                        )
                      )}
                    </div>
                  </div>
                );
})}
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

      {/* Register Modal */}
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

      {/* Host Debate Modal */}
      <Modal
        isOpen={hostModalOpen}
        onRequestClose={closeHostModal}
        className="relative max-w-lg mx-auto mt-20"
        overlayClassName="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center"
      >
        <div className="bg-gradient-to-br from-blue-600 to-violet-600 p-[8px] rounded-xl">
          <div className="bg-white rounded-xl p-6 space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Host a Debate</h2>
            <form onSubmit={handleHostSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Debate Topic</label>
                <input
                  type="text"
                  name="topic"
                  value={hostForm.topic}
                  onChange={handleHostInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Enter debate topic"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  name="description"
                  value={hostForm.description}
                  onChange={handleHostInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Describe the debate"
                  required
                />
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">Date</label>
                  <input
                    type="date"
                    name="date"
                    value={hostForm.date}
                    onChange={handleHostInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                    required
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">Time</label>
                  <input
                    type="time"
                    name="time"
                    value={hostForm.time}
                    onChange={handleHostInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                    required
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={closeHostModal}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Host Debate
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
