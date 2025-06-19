import api from '../lib/axios';

const paymentService = {
  // Get available plans
  getPlans: async () => {
    const response = await api.get('/payments/plans');
    return response.data.data;
  },

  // Subscribe to a plan
  subscribe: async (planId, paymentMethod) => {
    const response = await api.post('/payments/subscribe', {
      planId,
      paymentMethod
    });
    return response.data;
  },

  // Get payment history
  getHistory: async () => {
    const response = await api.get('/payments/history');
    return response.data.data;
  },

  // Cancel subscription
  cancelSubscription: async () => {
    const response = await api.post('/payments/cancel');
    return response.data;
  }
};

export default paymentService;
