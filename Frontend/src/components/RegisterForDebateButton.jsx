import React, { useState } from 'react';
import Modal from 'react-modal';

Modal.setAppElement('#root');

function RegisterForDebateButton({
  debate,
  isRegistered,
  onRegisterSuccess,
  registerForDebate,
  buttonClass = '',
  buttonText = 'Register',
  disabled = false
}) {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [registrationData, setRegistrationData] = useState({ stance: '', agreedToRules: false });
  const [registering, setRegistering] = useState(false);

  const openModal = () => {
    setModalIsOpen(true);
    setRegistrationData({ stance: '', agreedToRules: false });
  };

  const closeModal = () => setModalIsOpen(false);

  const handleRegistration = async (e) => {
    e.preventDefault();
    if (!registrationData.stance || !registrationData.agreedToRules) {
      alert('Please select your stance and agree to the rules.');
      return;
    }
    setRegistering(true);
    try {
      await registerForDebate(
        debate.id || debate._id,
        registrationData.stance,
        registrationData.agreedToRules
      );
      setModalIsOpen(false);
      setRegistrationData({ stance: '', agreedToRules: false });
      if (onRegisterSuccess) onRegisterSuccess();
      alert('Successfully registered for the debate!');
    } catch (e) {
      alert('Registration failed.');
    } finally {
      setRegistering(false);
    }
  };

  if (isRegistered) {
    return (
      <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded text-xs font-semibold">Registered</span>
    );
  }

  return (
    <>
      <button
        className={buttonClass || 'px-3 py-1 bg-blue-600 text-white rounded text-xs font-semibold hover:bg-blue-700 disabled:opacity-50'}
        disabled={disabled || registering}
        onClick={openModal}
      >
        {buttonText}
      </button>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        className="relative max-w-lg mx-auto mt-20"
        overlayClassName="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center"
      >
        <div className="bg-gradient-to-br from-blue-600 to-violet-600 p-[8px] rounded-xl">
          <div className="bg-white rounded-xl p-6 space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Register for Debate</h2>
            <h3 className="text-lg font-medium">{debate?.title}</h3>
            <form onSubmit={handleRegistration} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Choose your stance:</label>
                <label className="inline-flex items-center mr-4">
                  <input
                    type="radio"
                    name="stance"
                    value="in_favor"
                    checked={registrationData.stance === 'in_favor'}
                    onChange={(e) => setRegistrationData({ ...registrationData, stance: e.target.value })}
                    className="form-radio text-blue-600"
                  />
                  <span className="ml-2">In Favor</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="stance"
                    value="against"
                    checked={registrationData.stance === 'against'}
                    onChange={(e) => setRegistrationData({ ...registrationData, stance: e.target.value })}
                    className="form-radio text-blue-600"
                  />
                  <span className="ml-2">Against</span>
                </label>
              </div>
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  checked={registrationData.agreedToRules}
                  onChange={(e) => setRegistrationData({ ...registrationData, agreedToRules: e.target.checked })}
                  className="form-checkbox text-blue-600"
                />
                <span className="ml-2 text-sm text-gray-600">
                  I agree to follow the debate rules
                </span>
              </label>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  disabled={registering}
                >
                  {registering ? 'Registering...' : 'Register'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default RegisterForDebateButton;
