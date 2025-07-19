import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import debateService from '../services/debateService';
import messageService from '../services/messageService';
import ChatBody from '../components/ChatBody';
import MessageInput from '../components/MessageInput';
import RegisterForDebateButton from '../components/RegisterForDebateButton';
import ErrorBoundary from '../components/ErrorBoundary';
import { useSocket } from '../context/SocketContext';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';


function ActiveDiscussion() {
    const { debateId } = useParams();
    const navigate = useNavigate();
    const { socket, isConnected } = useSocket();
    const { user } = useAuth();
    const [debate, setDebate] = useState(null);
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isSocketReady, setIsSocketReady] = useState(false);

    useEffect(() => {
        if (!debateId || !user) {
            setError('No debate selected or user not authenticated.');
            setLoading(false);
            return;
        }

        let isMounted = true;

        const fetchDebateAndMessages = async () => {
            try {
                setLoading(true);
                setError(null);

                // Get debate details and messages in parallel
                const [debateData, messageData] = await Promise.all([
                    debateService.getDebateDetails(debateId),
                    messageService.getDebateMessages(debateId)
                ]);

                if (!isMounted) return;

                if (!debateData) {
                    throw new Error('Debate not found');
                }

                // Sort messages by timestamp
                const sortedMessages = messageData.sort((a, b) => 
                    new Date(a.createdAt) - new Date(b.createdAt)
                );

                setDebate(debateData);
                setMessages(sortedMessages);
            } catch (err) {
                if (!isMounted) return;
                console.error('Error fetching debate data:', err);
                setError(err.message || 'Failed to load debate');
                toast.error(err.message || 'Failed to load debate');
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchDebateAndMessages();

        return () => {
            isMounted = false;
        };
    }, [debateId, user]);

    useEffect(() => {
        if (!socket || !debateId || !isConnected || !user) return;

        const handleNewMessage = (message) => {
            if (!message || !message._id) return;
            
            setMessages(prev => {
                // Prevent duplicate messages
                if (prev.some(m => m._id === message._id)) return prev;
                return [...prev].concat([message]).sort((a, b) => 
                    new Date(a.createdAt) - new Date(b.createdAt)
                );
            });
        };

        const handleDebateUpdate = (updatedDebate) => {
            if (!updatedDebate || !updatedDebate._id) return;

            setDebate(prev => {
                if (prev?._id !== updatedDebate._id) return prev;
                return { ...prev, ...updatedDebate };
            });

            // Show status change notification
            if (updatedDebate.status !== debate?.status) {
                toast.info(`Debate status changed to ${updatedDebate.status}`);
            }
        };

        const handleError = (error) => {
            const message = error?.message || 'An error occurred';
            toast.error(message);
            console.error('Socket error:', error);
        };

        const handleUserJoined = (data) => {
            if (!data?.username) return;
            toast.success(`${data.username} joined the debate`);
        };

        const handleUserLeft = (data) => {
            if (!data?.username) return;
            toast.info(`${data.username} left the debate`);
        };

        // Join debate room
        socket.emit('joinDebate', { 
            debateId,
            userId: user._id,
            username: user.username
        });

        // Set up event listeners with error handling
        const setupListeners = () => {
            try {
                socket.on('newMessage', handleNewMessage);
                socket.on('debateStatusUpdate', handleDebateUpdate);
                socket.on('error', handleError);
                socket.on('userJoined', handleUserJoined);
                socket.on('userLeft', handleUserLeft);
            } catch (error) {
                console.error('Error setting up socket listeners:', error);
                toast.error('Failed to connect to debate room');
            }
        };

        setupListeners();

        // Cleanup function
        return () => {
            try {
                if (socket && isConnected) {
                    socket.emit('leaveDebate', { 
                        debateId,
                        userId: user._id,
                        username: user.username
                    });

                    socket.off('newMessage', handleNewMessage);
                    socket.off('debateStatusUpdate', handleDebateUpdate);
                    socket.off('error', handleError);
                    socket.off('userJoined', handleUserJoined);
                    socket.off('userLeft', handleUserLeft);
                }
            } catch (error) {
                console.error('Error cleaning up socket listeners:', error);
            }
        };
    }, [socket?.socket, debateId, isConnected]);

        const handleSendMessage = useCallback(async (text) => {
        if (!socket || !isConnected || !user || !debate) {
            throw new Error('Cannot send message: connection not ready');
        }

        if (debate.status !== 'active') {
            throw new Error('Cannot send message: debate is not active');
        }

        try {
            // First try to emit through socket to validate connection
            const sent = socket.emit('sendMessage', { 
                debateId,
                content: text,
                userId: user._id,
                username: user.username,
                stance: debate.participants.find(p => p.user === user._id)?.stance
            });

            if (!sent) {
                throw new Error('Socket not connected');
            }

            // Then save to database
            const message = await messageService.sendMessage(debateId, text);
            return message;
        } catch (err) {
            console.error('Error sending message:', err);
            toast.error(err.message || 'Failed to send message. Please try again.');
            throw err;
        }
    }, [debateId, socket, isConnected, user, debate]);

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center p-8">
                    <h2 className="text-xl font-semibold mb-4">Please log in to access debates</h2>
                    <button
                        onClick={() => navigate('/login')}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Go to Login
                    </button>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-lg">
                    <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Debate</h2>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="w-full py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    if (!debate) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-xl font-semibold">Debate not found</div>
            </div>
        );
    }

    const isParticipant = debate.participants?.some(p => p.user === user._id) || false;
    const userStance = debate.participants?.find(p => p.user === user._id)?.stance;

    return (
        <div className="flex flex-col h-screen">
            <div className="bg-white shadow">
                <div className="container mx-auto px-4 py-4">
                    <h1 className="text-2xl font-bold">{debate.title}</h1>
                    <div className="mt-2 text-gray-600">
                        <span className={`inline-block px-3 py-1 rounded ${
                            debate.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100'
                        }`}>
                            {debate.status.charAt(0).toUpperCase() + debate.status.slice(1)}
                        </span>
                        <span className="mx-2">•</span>
                        <span>{debate.category}</span>
                        {userStance && (
                            <>
                                <span className="mx-2">•</span>
                                <span>Your stance: {userStance}</span>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {isParticipant ? (
                <div className="flex-1 overflow-hidden flex flex-col">
                    <ChatBody messages={messages} currentUser={user} />
                    <MessageInput onSendMessage={handleSendMessage} disabled={debate.status !== 'active'} />
                </div>
            ) : (
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <p className="text-xl mb-4">You need to register to participate in this debate</p>
                        <RegisterForDebateButton
                            debate={debate}
                            onRegisterSuccess={() => window.location.reload()}
                            registerForDebate={debateService.registerForDebate}
                        />
                    </div>
                </div>
            )}
        </div>
    );



  const isRegistered = (debate) => {
    if (!user) return false;
    return debate.participants?.some((p) => p._id === user._id);
  };

  // Open registration modal
  const openRegistrationModal = (debate) => {
    setSelectedDebate(debate);
    setModalIsOpen(true);
    setRegistrationData({ stance: '', agreedToRules: false });
  };

  // Registration handled by RegisterForDebateButton

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
                {/* Optional Add Button */}
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {activeDebates.map((debate) => {
                    const registered = isRegistered(debate);
                    return (
                    <div key={debate._id} className="relative border rounded-lg shadow p-4 bg-white flex flex-col gap-2">
                      <Box
                        title={debate.title}
                        description={debate.description}
                        author={debate.host?.username || 'Unknown'}
                        onClick={() => handleBoxClick(debate)}
                      />
                      <div className="absolute bottom-4 right-4">
                        <RegisterForDebateButton
                          debate={debate}
                          isRegistered={debate.isRegistered}
                          registerForDebate={debateService.registerForDebate}
                          onRegisterSuccess={async () => {
                            const data = await debateService.getActiveDebates();
                            setActiveDebates(data);
                          }}
                        />
                      </div>
                    </div>
                    );
                  })}
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




const WrappedActiveDiscussion = () => (
    <ErrorBoundary>
        <ActiveDiscussion />
    </ErrorBoundary>
);

export default WrappedActiveDiscussion;



