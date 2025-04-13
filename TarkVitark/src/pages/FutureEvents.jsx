import React, { useState } from 'react';
import { User2, Calendar, Clock } from 'lucide-react';
import Modal from 'react-modal';
import { format } from 'date-fns';
import LeftSideBar from '../components/LeftSideBar';
import Footer from '../components/Footer';

Modal.setAppElement('#root');

function FutureEvents() {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedDiscussion, setSelectedDiscussion] = useState(null);
  const [registrationData, setRegistrationData] = useState({
    stance: '',
    agreedToRules: false
  });
  const [registeredDiscussions, setRegisteredDiscussions] = useState(new Set());

  const discussions = [
    {
      id: 1,
      title: 'Is AI a Threat to Humanity?',
      description: 'A debate on the ethical and existential risks of artificial intelligence.',
      start_time: new Date().toISOString(),
      moderator: 'Dr. Smith'
    },
    {
      id: 2,
      title: 'Should College Be Free?',
      description: 'An open forum on the pros and cons of free higher education.',
      start_time: new Date(Date.now() + 86400000).toISOString(),
      moderator: 'Prof. Johnson'
    }
  ];

  const openRegistrationModal = (discussion) => {
    setSelectedDiscussion(discussion);
    setModalIsOpen(true);
  };

  const handleRegistration = (e) => {
    e.preventDefault();
    if (!registrationData.stance || !registrationData.agreedToRules) {
      alert('Please fill in all required fields and agree to the rules.');
      return;
    }
    setRegisteredDiscussions(prev => new Set([...prev, selectedDiscussion.id]));
    setModalIsOpen(false);
    setRegistrationData({ stance: '', agreedToRules: false });
  };
  
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="w-64">
        <LeftSideBar />
      </div>
  
      {/* Main content + footer */}
      <div className="flex-1 flex flex-col">
        {/* Main Content */}
        <div className="flex-1 container mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-8">Live Discussions</h1>
  
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
  
        {/* Footer */}
        <Footer />
      </div>
  
      {/* Modal */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        className="max-w-lg mx-auto mt-20 bg-white rounded-xl shadow-lg p-6"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
      >
        <div className="space-y-6">
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
      </Modal>
    </div>
  );
  
}

export default FutureEvents;
