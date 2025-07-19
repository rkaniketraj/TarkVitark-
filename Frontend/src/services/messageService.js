import api from '../lib/axios';

const messageService = {
  // Get messages for a debate
  getMessages: async (debateId) => {
    const response = await api.get(`/messages/${debateId}`);
    return response.data.data;
  },

  // Send a message
  sendMessage: async (debateId, text, voiceUrl = null) => {
    const response = await api.post('/messages/send', {
      debateId,
      text,
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
