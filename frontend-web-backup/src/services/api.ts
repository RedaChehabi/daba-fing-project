// File: frontend-web/src/services/api.ts
import axios from 'axios';

// Create an axios instance with default config
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api', // Ensure this matches your setup
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

// Define interfaces used by authService
interface LoginResponse {
  token: string;
  user_id: string; // or number depending on your backend
  email: string;
  username: string;
  role: string;
}

interface UserData {
  id: string; // or number
  username: string;
  email: string;
  role: string;
}

// Authentication services
export const authService = {
  login: async (username: string, password: string): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>('/login/', { username, password });
    // Store token and basic user data after successful login
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      const basicUserData = { 
        id: response.data.user_id, 
        username: response.data.username, 
        email: response.data.email, 
        role: response.data.role 
      };
      localStorage.setItem('user_data', JSON.stringify(basicUserData));
    }
    return response.data;
  },

  register: async (username: string, email: string, password: string): Promise<LoginResponse> => {
    const userData = { username, email, password };
    const response = await api.post<LoginResponse>('/register/', userData);
    // Store token and basic user data after successful registration
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      const basicUserData = { 
        id: response.data.user_id, // Assuming register also returns user_id, or response.data.id
        username: response.data.username, 
        email: response.data.email, 
        role: response.data.role 
      };
      localStorage.setItem('user_data', JSON.stringify(basicUserData));
    }
    return response.data;
  },

  getProfile: async (): Promise<UserData> => { // Assuming profile endpoint returns UserData structure
    const response = await api.get<UserData>('/userprofile/'); // Changed from /profile/ to match views.py
    return response.data;
  },

  // Add the migrated functions:
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user_data");
    // Optionally call a backend logout endpoint if you have one
    // api.post('/logout/'); 
  },

  isAuthenticated: (): boolean => {
    const token = localStorage.getItem("token");
    // Optional: Add more robust token validation (e.g., check expiration if JWT)
    return !!token;
  },

  getCurrentUser: (): UserData | null => {
    const userDataString = localStorage.getItem("user_data");
    if (!userDataString) return null;
    try {
      return JSON.parse(userDataString) as UserData;
    } catch (error) {
      console.error("Failed to parse user_data from localStorage:", error);
      localStorage.removeItem("user_data"); // Clear corrupted data
      return null;
    }
  },
};

// Fingerprint services (remains the same)
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

// Add these functions to the existing api.ts file

// Expert Application interfaces
export interface ExpertApplication {
  id: number;
  status: 'pending' | 'approved' | 'rejected';
  application_date: string;
  motivation: string;
  experience: string;
  qualifications?: string;
  review_date?: string;
  review_notes?: string;
}

export interface ExpertApplicationSubmission {
  motivation: string;
  experience: string;
  qualifications?: string;
}

export interface ExpertApplicationReview {
  action: 'approve' | 'reject';
  review_notes?: string;
}

// Expert Application API functions
export const expertApplicationService = {
  // Submit expert application
  submit: async (applicationData: ExpertApplicationSubmission): Promise<any> => {
    const response = await api.post('/expert-application/submit/', applicationData);
    return response.data;
  },

  // Get user's expert application status
  getStatus: async (): Promise<ExpertApplication> => {
    const response = await api.get('/expert-application/status/');
    return response.data;
  },

  // Get all expert applications (admin only)
  getAll: async (): Promise<{ applications: ExpertApplication[]; total_count: number }> => {
    const response = await api.get('/expert-applications/');
    return response.data;
  },

  // Review expert application (admin only)
  review: async (applicationId: number, reviewData: ExpertApplicationReview): Promise<any> => {
    const response = await api.post(`/expert-application/${applicationId}/review/`, reviewData);
    return response.data;
  },
};

export default api;