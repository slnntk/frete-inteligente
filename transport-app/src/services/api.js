import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Configure the base URL - adjust this to your backend URL
const API_BASE_URL = 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('userToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid, logout user
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('userData');
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getProfile: () => api.get('/auth/profile'),
};

// Trips API
export const tripsAPI = {
  getTrips: (params) => api.get('/trips', { params }),
  getTripById: (id) => api.get(`/trips/${id}`),
  createTrip: (tripData) => api.post('/trips', tripData),
  updateTrip: (id, tripData) => api.put(`/trips/${id}`, tripData),
  deleteTrip: (id) => api.delete(`/trips/${id}`),
  updateLocation: (id, location) => api.post(`/trips/${id}/location`, location),
};

// CheckIns API
export const checkInsAPI = {
  createCheckIn: (checkInData) => api.post('/checkins', checkInData),
  getMyCheckIns: () => api.get('/checkins/my'),
  cancelCheckIn: (id) => api.put(`/checkins/${id}/cancel`),
  updatePayment: (id, paymentStatus) => api.put(`/checkins/${id}/payment`, { paymentStatus }),
  getTripCheckIns: (tripId) => api.get(`/checkins/trip/${tripId}`),
};

export default api;
