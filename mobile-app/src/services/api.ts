import AsyncStorage from '@react-native-async-storage/async-storage';
import { LoginRequest, RegisterRequest, AuthResponse, User } from '../types';

const API_BASE_URL = 'http://localhost:8000/api'; // Replace with your actual API URL

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
      // Mock implementation for development
      const mockResponse: AuthResponse = {
        token: 'mock_token_' + Date.now(),
        user_id: '1',
        username: credentials.username,
        email: 'user@example.com',
        role: 'Regular'
      };

      await this.setAuthToken(mockResponse.token);
      return mockResponse;

      // Real implementation would be:
      // const response = await fetch(`${API_BASE_URL}/auth/login/`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(credentials),
      // });
      // const data = await response.json();
      // if (!response.ok) throw new Error(data.message || 'Login failed');
      // await this.setAuthToken(data.token);
      // return data;
    } catch (error) {
      console.error('Login error:', error);
      throw new Error('Login failed. Please check your credentials.');
    }
  }

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    try {
      // Mock implementation for development
      const mockResponse: AuthResponse = {
        token: 'mock_token_' + Date.now(),
        user_id: '2',
        username: userData.username,
        email: userData.email,
        role: 'Regular'
      };

      await this.setAuthToken(mockResponse.token);
      return mockResponse;

      // Real implementation would be:
      // const response = await fetch(`${API_BASE_URL}/auth/register/`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(userData),
      // });
      // const data = await response.json();
      // if (!response.ok) throw new Error(data.message || 'Registration failed');
      // await this.setAuthToken(data.token);
      // return data;
    } catch (error) {
      console.error('Registration error:', error);
      throw new Error('Registration failed. Please try again.');
    }
  }

  async logout(): Promise<void> {
    try {
      await this.removeAuthToken();
      
      // Real implementation would also call backend:
      // const token = await this.getAuthToken();
      // if (token) {
      //   await fetch(`${API_BASE_URL}/auth/logout/`, {
      //     method: 'POST',
      //     headers: { 'Authorization': `Bearer ${token}` },
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

      // Mock implementation
      return {
        id: '1',
        username: 'testuser',
        email: 'user@example.com',
        role: 'Regular'
      };

      // Real implementation would be:
      // const response = await fetch(`${API_BASE_URL}/auth/user/`, {
      //   headers: { 'Authorization': `Bearer ${token}` },
      // });
      // if (!response.ok) return null;
      // return await response.json();
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }

  async getProfile(): Promise<User> {
    try {
      const token = await this.getAuthToken();
      if (!token) throw new Error('No auth token');

      // Mock implementation
      return {
        id: '1',
        username: 'testuser',
        email: 'user@example.com',
        role: 'Regular'
      };

      // Real implementation would be:
      // const response = await fetch(`${API_BASE_URL}/auth/profile/`, {
      //   headers: { 'Authorization': `Bearer ${token}` },
      // });
      // if (!response.ok) throw new Error('Failed to get profile');
      // return await response.json();
    } catch (error) {
      console.error('Error getting profile:', error);
      throw error;
    }
  }

  async isAuthenticated(): Promise<boolean> {
    try {
      const token = await this.getAuthToken();
      return !!token;

      // Real implementation would verify with backend:
      // if (!token) return false;
      // const response = await fetch(`${API_BASE_URL}/auth/verify/`, {
      //   headers: { 'Authorization': `Bearer ${token}` },
      // });
      // return response.ok;
    } catch (error) {
      console.error('Error checking authentication:', error);
      return false;
    }
  }
}

export const authService = new ApiService();
