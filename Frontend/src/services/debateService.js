import api from '../lib/axios';

const debateService = {  // Get list of active debates
  getActiveDebates: async () => {
    const response = await api.get('/debates/active');
    return response.data.data;
  },
  // Get list of upcoming debates
  getUpcomingDebates: async () => {
    const response = await api.get('/debates/upcoming');
    return response.data.data;
  },

  // Get details for a specific debate
  getDebateDetails: async (debateId) => {
    const response = await axios.get(`${API_URL}/debates/${debateId}`);
    return response.data.data;
  },
  // Register for a debate
  registerForDebate: async (debateId, stance, agreedToRules) => {
    const response = await api.post('/debates/register', {
      debateId,
      stance,
      agreedToRules
    });
    return response.data;
  },

  // Create a new debate
  createDebate: async (debateData) => {
    const response = await axios.post(
      `${API_URL}/debates/create`, 
      debateData,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      }
    );
    return response.data;
  },

  // Get debates hosted by the current user
  getHostedDebates: async () => {
    const response = await axios.get(
      `${API_URL}/debates/hosted`,
      { withCredentials: true }
    );
    return response.data.data;
  },

  // Get debates participated in by the current user
  getParticipatedDebates: async () => {
    const response = await axios.get(
      `${API_URL}/debates/participated`,
      { withCredentials: true }
    );
    return response.data.data;
  },
};

export default debateService;
