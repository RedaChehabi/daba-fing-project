import AsyncStorage from '@react-native-async-storage/async-storage';
import { LoginRequest, RegisterRequest, AuthResponse, User } from '../types';

// For React Native, localhost doesn't work. Use your computer's IP address
// Find your IP with: `ipconfig getifaddr en0` (macOS) or `hostname -I` (Linux)
// Or use your computer's network IP (check in System Preferences > Network)
const API_BASE_URL = __DEV__ 
  ? 'http://192.168.1.33:8000/api' // Your actual local network IP
  : 'https://your-production-server.com/api'; // Your production API URL

class ApiService {
  private async getAuthToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem('authToken');
    } catch (error) {
      console.error('Error getting auth token:', error);
      return null;
    }
  }

  private async setAuthToken(token: string): Promise<void> {
    try {
      await AsyncStorage.setItem('authToken', token);
    } catch (error) {
      console.error('Error setting auth token:', error);
    }
  }

  private async removeAuthToken(): Promise<void> {
    try {
      await AsyncStorage.removeItem('authToken');
    } catch (error) {
      console.error('Error removing auth token:', error);
    }
  }

  async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/login/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });
      
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || data.message || 'Login failed');
      }
      
      await this.setAuthToken(data.token);
      return {
        token: data.token,
        user_id: data.user_id,
        username: data.username,
        email: data.email,
        role: data.role
      };
    } catch (error) {
      console.error('Login error:', error);
      throw new Error('Login failed. Please check your credentials.');
    }
  }

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/register/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || data.message || 'Registration failed');
      }
      
      await this.setAuthToken(data.token);
      return {
        token: data.token,
        user_id: data.id,
        username: data.username,
        email: data.email,
        role: data.role
      };
    } catch (error) {
      console.error('Registration error:', error);
      throw new Error('Registration failed. Please try again.');
    }
  }

  async logout(): Promise<void> {
    try {
      await this.removeAuthToken();
      
      // Optional: Call backend logout endpoint if you have one
      // const token = await this.getAuthToken();
      // if (token) {
      //   await fetch(`${API_BASE_URL}/logout/`, {
      //     method: 'POST',
      //     headers: { 'Authorization': `Token ${token}` },
      //   });
      // }
    } catch (error) {
      console.error('Logout error:', error);
    }
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      const token = await this.getAuthToken();
      if (!token) return null;

      const response = await fetch(`${API_BASE_URL}/userprofile/`, {
        headers: { 'Authorization': `Token ${token}` },
      });
      
      if (!response.ok) return null;
      
      const data = await response.json();
      return {
        id: data.id,
        username: data.username,
        email: data.email,
        role: data.role
      };
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }

  async getProfile(): Promise<User> {
    try {
      const token = await this.getAuthToken();
      if (!token) throw new Error('No auth token');

      const response = await fetch(`${API_BASE_URL}/userprofile/`, {
        headers: { 'Authorization': `Token ${token}` },
      });
      
      if (!response.ok) throw new Error('Failed to get profile');
      
      const data = await response.json();
      return {
        id: data.id,
        username: data.username,
        email: data.email,
        role: data.role
      };
    } catch (error) {
      console.error('Error getting profile:', error);
      throw error;
    }
  }

  async updateProfile(profileData: { username?: string; email?: string; first_name?: string; last_name?: string }): Promise<User> {
    try {
      const token = await this.getAuthToken();
      if (!token) throw new Error('No auth token');

      const response = await fetch(`${API_BASE_URL}/userprofile/update/`, {
        method: 'PUT',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to update profile');
      }
      
      const data = await response.json();
      return {
        id: data.id,
        username: data.username,
        email: data.email,
        role: data.role
      };
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  }

  async isAuthenticated(): Promise<boolean> {
    try {
      const token = await this.getAuthToken();
      if (!token) return false;
      
      // Simple check - if token exists, assume authenticated
      // You could add a verify endpoint on backend if needed
      const response = await fetch(`${API_BASE_URL}/userprofile/`, {
        headers: { 'Authorization': `Token ${token}` },
      });
      
      return response.ok;
    } catch (error) {
      console.error('Error checking authentication:', error);
      return false;
    }
  }

  // Fingerprint analysis methods
  async uploadFingerprint(formData: FormData): Promise<any> {
    try {
      const token = await this.getAuthToken();
      if (!token) throw new Error('No auth token');

      const response = await fetch(`${API_BASE_URL}/fingerprints/`, {
        method: 'POST',
        headers: {
          'Authorization': `Token ${token}`,
        },
        body: formData,
      });
      
      if (!response.ok) throw new Error('Upload failed');
      return await response.json();
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  }

  async analyzeFingerprint(fingerprintId: number): Promise<any> {
    try {
      const token = await this.getAuthToken();
      if (!token) throw new Error('No auth token');

      const response = await fetch(`${API_BASE_URL}/fingerprint/analyze/`, {
        method: 'POST',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fingerprint_id: fingerprintId }),
      });
      
      if (!response.ok) throw new Error('Analysis failed');
      return await response.json();
    } catch (error) {
      console.error('Analysis error:', error);
      throw error;
    }
  }

  async getAnalysisHistory(): Promise<any> {
    try {
      const token = await this.getAuthToken();
      if (!token) throw new Error('No auth token');

      const response = await fetch(`${API_BASE_URL}/user/analysis-history/`, {
        headers: { 'Authorization': `Token ${token}` },
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: Failed to get history`);
      }
      
      const data = await response.json();
      console.log('Analysis history response:', data);
      
      // Ensure we return the expected format
      return {
        history: data.history || [],
        total_count: data.total_count || 0,
        status: data.status || 'success'
      };
    } catch (error) {
      console.error('Error getting analysis history:', error);
      throw new Error(`Failed to load analysis history: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Dashboard stats method to match other frontends
  async getDashboardStats(): Promise<any> {
    try {
      const token = await this.getAuthToken();
      if (!token) throw new Error('No auth token');

      const response = await fetch(`${API_BASE_URL}/dashboard/stats/`, {
        headers: { 'Authorization': `Token ${token}` },
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: Failed to get dashboard stats`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error getting dashboard stats:', error);
      throw error;
    }
  }

  // Analytics data method for admin users
  async getAnalyticsData(): Promise<any> {
    try {
      const token = await this.getAuthToken();
      if (!token) throw new Error('No auth token');

      const response = await fetch(`${API_BASE_URL}/admin/analytics/`, {
        headers: { 'Authorization': `Token ${token}` },
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: Failed to get analytics data`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error getting analytics data:', error);
      throw error;
    }
  }
}

export const authService = new ApiService();
