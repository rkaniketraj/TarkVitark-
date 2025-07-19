import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import debateService from '../services/debateService';
import RegisterForDebateButton from '../components/RegisterForDebateButton';

function UpcomingDebatesPage() {
    const [debates, setDebates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchUpcomingDebates();
        // Set up interval to check for debate status changes
        const interval = setInterval(fetchUpcomingDebates, 60000); // Check every minute
        return () => clearInterval(interval);
    }, []);

    const fetchUpcomingDebates = async () => {
        try {
            const upcomingDebates = await debateService.getUpcomingDebates();
            setDebates(upcomingDebates);
            setLoading(false);
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    const handleRegisterSuccess = async (debateId) => {
        // Refresh the debates list after successful registration
        await fetchUpcomingDebates();
    };

    const handleDebateClick = (debate) => {
        const now = new Date();
        const debateStart = new Date(debate.startTime);
        
        if (debateStart <= now) {
            // If debate has started, navigate to active discussion
            navigate(`/discussion/${debate._id}`);
        }
    };

    if (loading) return <div className="text-center py-8">Loading upcoming debates...</div>;
    if (error) return <div className="text-red-500 text-center py-8">{error}</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Upcoming Debates</h1>
            <div className="grid gap-6">
                {debates.map((debate) => (
                    <div 
                        key={debate._id}
                        className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
                        onClick={() => handleDebateClick(debate)}
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h2 className="text-xl font-semibold mb-2">{debate.title}</h2>
                                <p className="text-gray-600">{debate.description}</p>
                            </div>
                            <RegisterForDebateButton
                                debate={debate}
                                isRegistered={debate.participants.some(p => p.user === userId)}
                                onRegisterSuccess={() => handleRegisterSuccess(debate._id)}
                                registerForDebate={debateService.registerForDebate}
                            />
                        </div>
                        <div className="flex gap-4 text-sm text-gray-500">
                            <div>
                                <span className="font-medium">Starts:</span>{' '}
                                {new Date(debate.startTime).toLocaleString()}
                            </div>
                            <div>
                                <span className="font-medium">Duration:</span>{' '}
                                {debate.duration} minutes
                            </div>
                            <div>
                                <span className="font-medium">Category:</span>{' '}
                                {debate.category}
                            </div>
                            <div>
                                <span className="font-medium">Participants:</span>{' '}
                                {debate.participants.length}/{debate.maxParticipants}
                            </div>
                        </div>
                    </div>
                ))}
                {debates.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                        No upcoming debates found. Check back later!
                    </div>
                )}
            </div>
        </div>
    );
}

export default UpcomingDebatesPage;
