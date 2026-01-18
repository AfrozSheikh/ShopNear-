import axios from 'axios';
import { API_ENDPOINTS } from '../utils/constants';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// Request interceptor to add JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for token refresh and error handling
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle network errors
    if (!error.response) {
      console.error('Network error:', error.message);
      return Promise.reject({
        response: {
          data: {
            message: 'Network error. Please check your connection and try again.'
          }
        }
      });
    }

    // If error is 401 and we haven't tried to refresh yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        // Try to refresh the token
        const response = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'}/auth/refresh`,
          { refreshToken }
        );

        const { accessToken } = response.data.data;
        
        if (!accessToken) {
          throw new Error('No access token in refresh response');
        }

        localStorage.setItem('accessToken', accessToken);
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        
        return api(originalRequest);
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        
        // Clear auth data and redirect to login
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        
        // Redirect to login page
        if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
          window.location.href = '/login';
        }
        
        return Promise.reject(refreshError);
      }
    }

    // Handle other errors
    if (error.response?.status === 403) {
      console.error('Forbidden:', error.response.data);
    } else if (error.response?.status === 404) {
      console.error('Not found:', error.response.data);
    } else if (error.response?.status >= 500) {
      console.error('Server error:', error.response.data);
    }

    return Promise.reject(error);
  }
);

export default api;
