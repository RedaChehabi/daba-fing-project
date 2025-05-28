export interface User {
  id: string;
  username: string;
  email: string;
  role: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user_id: string;
  email: string;
  username: string;
  role: string;
}

export interface FingerprintUpload {
  id: string;
  image: string;
  finger_position: string;
  hand_type: string;
  title: string;
  description?: string;
}

export interface AnalysisResult {
  id: string;
  fingerprint_id: string;
  classification: string;
  ridge_count: number;
  confidence: number;
  analysis_date: string;
  status: string;
  processing_time: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface NavigationProps {
  navigation: any;
  route?: any;
}
