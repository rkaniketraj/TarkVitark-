import api from '../lib/axios';

const messageService = {


  // Get messages for a debate (correct backend route)
  getDebateMessages: async (debateId) => {
    const response = await api.get(`/debates/messages/debate/${debateId}`);
    return response.data.data;
  },


  // Send a message (correct backend route)
  sendMessage: async (debateId, text, voiceUrl = null) => {
    const response = await api.post(`/debates/messages/debate/${debateId}`, {
      content: text,
      voiceUrl
    });
    return response.data;
  },

  // Delete a message (if user is owner or moderator)
  deleteMessage: async (messageId) => {
    const response = await api.delete(`/messages/${messageId}`);
    return response.data;
  }
};

export default messageService;
