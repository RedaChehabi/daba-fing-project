import axios from 'axios';

// Create an axios instance with default config
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to add the auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Token ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Authentication services
export const authService = {
  login: async (username: string, password: string) => {
    const response = await api.post('/login/', { username, password });
    return response.data;
  },
  
  register: async (userData: any) => {
    const response = await api.post('/register/', userData);
    return response.data;
  },
  
  getProfile: async () => {
    const response = await api.get('/profile/');
    return response.data;
  },
};

// Fingerprint services
export const fingerprintService = {
  uploadFingerprint: async (formData: FormData) => {
    const response = await api.post('/fingerprints/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
  
  getFingerprints: async () => {
    const response = await api.get('/fingerprints/');
    return response.data;
  },
  
  getFingerprint: async (id: number) => {
    const response = await api.get(`/fingerprints/${id}/`);
    return response.data;
  },
  
  analyzeFingerprint: async (fingerprintId: number) => {
    const response = await api.post('/fingerprint/analyze/', { fingerprint_id: fingerprintId });
    return response.data;
  },
};

export default api;