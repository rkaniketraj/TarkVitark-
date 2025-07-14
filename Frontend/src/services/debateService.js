
// import axios from 'axios';

// import api from '../lib/axios';
// const API_URL = import.meta.env.VITE_API_URL;

// const debateService = {  // Get list of active debates
//   getActiveDebates: async () => {
//     const response = await api.get('/debates/active');
//     return response.data.data;
//   },
//   // Get list of upcoming debates
//   getUpcomingDebates: async () => {
//     const response = await api.get('/debates/upcoming');
//     return response.data.data;
//   },

//   // Get details for a specific debate
//   getDebateDetails: async (debateId) => {
//     const response = await axios.get(`${API_URL}/debates/${debateId}`);
//     return response.data.data;
//   },
//   // Register for a debate
//   registerForDebate: async (debateId, stance, agreedToRules) => {
//     const response = await api.post('/debates/register', {
//       debateId,
//       stance,
//       agreedToRules
//     });
//     return response.data;
//   },

//   // Create a new debate
//   createDebate: async (debateData) => {
//     const response = await axios.post(
//       `${API_URL}/debates/create`, 
//       debateData,
//       {
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         withCredentials: true,
//       }
//     );
//     return response.data;
//   },

//   // Get debates hosted by the current user
//   getHostedDebates: async () => {
//     const response = await axios.get(
//       `${API_URL}/debates/hosted`,
//       { withCredentials: true }
//     );
//     return response.data.data;
//   },

//   // Get debates participated in by the current user
//   getParticipatedDebates: async () => {
//     const response = await axios.get(
//       `${API_URL}/debates/participated`,
//       { withCredentials: true }
//     );
//     return response.data.data;
//   },
// };

// export default debateService;


import api from '../lib/axios';

const debateService = {
  // Get list of active debates
  getActiveDebates: async () => {
    const response = await api.get('/debates/active');
    return response.data.data;
  },


  // Create a debate room (new endpoint)
  createDebateRoom: async (roomData) => {
    const response = await api.post('/debates/debate-room', roomData);
    return response.data;
  },

  // Get list of upcoming debates
  getUpcomingDebates: async () => {
    const response = await api.get('/debates/upcoming');
    return response.data.data;
  },

  // Get details for a specific debate
  getDebateDetails: async (debateId) => {
    const response = await api.get(`/debates/${debateId}`);
    return response.data.data;
  },

  unregisterFromDebate: async (debateId) => {
  const response = await api.post('/debates/unregister', { debateId });
  return response.data;
},

  // Register for a debate
  registerForDebate: async (debateId, stance, agreedToRules) => {
    const response = await api.post('/discussions/register', {
      debateId,
      stance,
      agreedToRules
    });
    return response.data;
  },

  // Create (host) a new debate
  createDebate: async (debateData) => {
    const response = await api.post('/debates/create', debateData);
    return response.data;
  },

  // Get debates hosted by the current user
  getHostedDebates: async () => {
    const response = await api.get('/debates/hosted');
    return response.data.data;
  },

  // Get debates the current user has participated in
  getParticipatedDebates: async () => {
    const response = await api.get('/debates/participated');
    return response.data.data;
  },
};

export default debateService;
