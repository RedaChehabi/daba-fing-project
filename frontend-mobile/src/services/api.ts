import AsyncStorage from '@react-native-async-storage/async-storage';
import { LoginRequest, RegisterRequest, AuthResponse, User } from '../types';
import { Platform } from 'react-native';
import Constants from 'expo-constants';

/*
 * Resolve the API base URL for React-Native.  "localhost" only works when the
 * JS bundle runs *inside* the same host machine (e.g. a web browser).  On a
 * mobile device / emulator it maps back to the device itself, not your Mac.
 *
 * Rules we implement:
 *   • If an explicit env var is provided (EXPO_PUBLIC_API_URL), always use it.
 *   • On Android emulator we can reach the host through http://10.0.2.2
 *   • On iOS simulator we can still use your Mac's LAN IP
 *   • Fallback to localhost – useful when you run the web build
 */

const explicitApi = Constants.expoConfig?.extra?.API_URL || process.env.EXPO_PUBLIC_API_URL;

const guessDevApi = () => {
  // 1) Android emulator has a magic address to the host machine.
  if (Platform.OS === 'android') {
    return 'http://192.168.1.34:8000/api';
  }

  // 2) Try to extract the host of the Metro server which Expo embeds in the manifest.
  const hostCandidate =
    // Classic manifest during dev (expo start)
    (Constants.manifest as any)?.debuggerHost?.split(':')?.[0] ||
    // Modern Expo SDK 49+ (expoConfig.hostUri)
    Constants.expoConfig?.hostUri?.split(':')?.[0] ||
    // Fallback to IP embedded in manifest2 (EAS updates)
    (Constants as any)?.manifest2?.extra?.expoGo?.developer?.hostUri?.split(':')?.[0] ||
    null;

  if (hostCandidate) {
    return `http://${hostCandidate}:8000/api`;
  }

  // 3) Running in the web build or we couldn't guess – localhost works there.
  return 'http://localhost:8000/api';
};

const API_BASE_URL = __DEV__
  ? (explicitApi || guessDevApi())
    : (explicitApi || 'http://192.168.1.34:8000/api');

// Give us a heads-up in the console so we can verify quickly
// eslint-disable-next-line no-console
console.log('[API] base URL =', API_BASE_URL);

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

      const contentType = response.headers.get('content-type') || '';

      // Try to parse JSON only if the server says it's JSON
      const maybeJson = async () => {
        if (contentType.includes('application/json')) {
          try {
            return await response.json();
          } catch (_) {
            return null;
          }
        }
        return null;
      };

      const data = await maybeJson();

      if (!response.ok) {
        const message = data?.detail || data?.message || `HTTP ${response.status}`;
        throw new Error(message || 'Login failed');
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
      if (error instanceof TypeError && error.message === 'Network request failed') {
        throw new Error('Cannot connect to the server. Please check your internet connection and try again.');
      }
      throw error;
    }
  }

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/register/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });

      const contentType = response.headers.get('content-type') || '';
      const maybeJson = async () => {
        if (contentType.includes('application/json')) {
          try {
            return await response.json();
          } catch (_) {
            return null;
          }
        }
        return null;
      };

      const data = await maybeJson();

      if (!response.ok) {
        const message = data?.detail || data?.message || `HTTP ${response.status}`;
        throw new Error(message || 'Registration failed');
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
        role: data.role,
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

      // Quick verification: hit a lightweight endpoint
      const response = await fetch(`${API_BASE_URL}/userprofile/`, {
        headers: { 'Authorization': `Token ${token}` },
      });

      return response.ok;
    } catch (error) {
      console.error('Error checking authentication:', error);
      return false;
    }
  }

  // ------------ Fingerprint & analytics helpers ------------

  async uploadFingerprint(formData: FormData): Promise<any> {
    try {
      const token = await this.getAuthToken();
      if (!token) throw new Error('No auth token');

      formData.append('title', 'Mobile Upload');
      formData.append('hand_type', 'Right');      // or 'Left'
      formData.append('finger_position', 'Thumb'); // e.g. Thumb, Index, …

      const response = await fetch(`${API_BASE_URL}/fingerprints/`, {
        method: 'POST',
        headers: { 'Authorization': `Token ${token}` },
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
      return {
        history: data.history || [],
        total_count: data.total_count || 0,
        status: data.status || 'success',
      };
    } catch (error) {
      console.error('Error getting analysis history:', error);
      throw new Error(
        `Failed to load analysis history: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

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