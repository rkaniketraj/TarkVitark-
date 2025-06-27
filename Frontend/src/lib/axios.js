// import axios from 'axios';

// const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// // Create axios instance with default config 
// const api = axios.create({
//   baseURL: BASE_URL,
//   withCredentials: true,
//   headers: {
//     'Content-Type': 'application/json'
//   }
// });

// // Request interceptor - Add auth token
// api.interceptors.request.use(
//   async (config) => {
//     const token = localStorage.getItem('accessToken');
//     if (token) {
//       config.headers['Authorization'] = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// // Response interceptor - Handle errors & refresh token
// api.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;

//     // If error is 401 and we haven't tried to refresh token yet
//     if (error.response.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;

//       try {
//         // Call refresh token endpoint
//         const response = await api.post('/users/refresh-token');
//         const { accessToken } = response.data.data;
        
//         // Store new token
//         localStorage.setItem('accessToken', accessToken);
        
//         // Retry original request with new token
//         originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
//         return api(originalRequest);
//       } catch (error) {
//         // If refresh token also fails, logout user
//         localStorage.removeItem('accessToken');
//         window.location.href = '/login';
//         return Promise.reject(error);
//       }
//     }

//     return Promise.reject(error);
//   }
// );

// export default api;



import axios from 'axios';

// ✅ Use correct environment variable
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

// ✅ Append /api/v1 to base URL
const api = axios.create({
  baseURL: `${BASE_URL}/api/v1`,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// ✅ Request interceptor: Add auth token if present
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Response interceptor: Handle 401 and refresh token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const res = await api.post('/users/refresh-token');
        const { accessToken } = res.data.data;

        localStorage.setItem('accessToken', accessToken);

        originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('accessToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
