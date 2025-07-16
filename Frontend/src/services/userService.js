import api from '../lib/axios';

const userService = {
  // Get user's stance for a debate room
  getDebateStance: async (roomId) => {
    const response = await api.get(`/discussions/${roomId}/registration`);
    return response.data.stance;
  },
  // Login user
  login: async (email, password) => {
    const response = await api.post('/users/login', {
      email,
      password
    });
    const { accessToken } = response.data.data;
    localStorage.setItem('accessToken', accessToken);
    return response.data;
  },

  // Register user
  register: async (userData) => {
    const formData = new FormData();
    Object.keys(userData).forEach(key => {
      formData.append(key, userData[key]);
    });
    
    const response = await api.post('/users/register', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },

  // Logout user
  logout: async () => {
    const response = await api.post('/users/logout');
    localStorage.removeItem('accessToken');
    return response.data;
  },

  // Get current user
  getCurrentUser: async () => {
    const response = await api.get('/users/current');
    return response.data.data;
  },

  // Update user profile
  updateProfile: async (userData) => {
    const response = await api.patch('/users/update', userData);
    return response.data;
  },

  // Change password
  changePassword: async (oldPassword, newPassword) => {
    const response = await api.post('/users/change-password', {
      oldPassword,
      newPassword
    });
    return response.data;
  }
};

export default userService;
