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

interface ExpertApplicationSubmitResponse {
  detail: string;
  status: string;
  application_id?: number;
}

interface ExpertApplicationReviewResponse {
  detail: string;
  status: string;
  message?: string;
}

// Expert Application API functions
export const expertApplicationService = {
  // Submit expert application
  submit: async (applicationData: ExpertApplicationSubmission): Promise<ExpertApplicationSubmitResponse> => {
    const response = await api.post<ExpertApplicationSubmitResponse>('/expert-application/submit/', applicationData);
    return response.data;
  },

  // Get user's expert application status
  getStatus: async (): Promise<ExpertApplication> => {
    const response = await api.get<ExpertApplication>('/expert-application/status/');
    return response.data;
  },

  // Get all expert applications (admin only)
  getAll: async (): Promise<{ applications: ExpertApplication[]; total_count: number }> => {
    const response = await api.get<{ applications: ExpertApplication[]; total_count: number }>('/expert-applications/');
    return response.data;
  },

  // Review expert application (admin only)
  review: async (applicationId: number, reviewData: ExpertApplicationReview): Promise<ExpertApplicationReviewResponse> => {
    const response = await api.post<ExpertApplicationReviewResponse>(`/expert-application/${applicationId}/review/`, reviewData);
    return response.data;
  },
};

// Define interfaces for user management
interface UserListResponse {
  users: {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    full_name: string;
    role: string;
    status: string;
    last_active: string;
    join_date: string;
    analyses: number;
    date_joined: string;
    is_staff: boolean;
    is_superuser: boolean;
  }[];
  total_count: number;
}

interface CreateUserResponse {
  id: number;
  username: string;
  email: string;
  role: string;
  message: string;
}

interface UserDetailResponse {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  is_active: boolean;
  date_joined: string;
  last_login: string | null;
  analyses_count: number;
  is_staff: boolean;
  is_superuser: boolean;
}

interface UpdateUserResponse {
  id: number;
  username: string;
  email: string;
  role: string;
  message: string;
}

interface DeleteUserResponse {
  message: string;
  status: string;
}

interface BulkDeleteResponse {
  message: string;
  deleted_count: number;
  status: string;
}

// User Management (Admin only)
export const adminService = {
  listUsers: async (): Promise<UserListResponse> => {
    const response = await api.get<UserListResponse>('/admin/users/');
    return response.data;
  },

  createUser: async (userData: {
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    password: string;
    role: string;
  }): Promise<CreateUserResponse> => {
    const response = await api.post<CreateUserResponse>('/admin/users/create/', userData);
    return response.data;
  },

  getUser: async (userId: number): Promise<UserDetailResponse> => {
    const response = await api.get<UserDetailResponse>(`/admin/users/${userId}/`);
    return response.data;
  },

  updateUser: async (userId: number, userData: {
    username?: string;
    email?: string;
    first_name?: string;
    last_name?: string;
    role?: string;
    is_active?: boolean;
  }): Promise<UpdateUserResponse> => {
    const response = await api.put<UpdateUserResponse>(`/admin/users/${userId}/update/`, userData);
    return response.data;
  },

  deleteUser: async (userId: number): Promise<DeleteUserResponse> => {
    const response = await api.delete<DeleteUserResponse>(`/admin/users/${userId}/delete/`);
    return response.data;
  },

  bulkDeleteUsers: async (userIds: number[]): Promise<BulkDeleteResponse> => {
    const response = await api.post<BulkDeleteResponse>('/admin/users/bulk-delete/', { user_ids: userIds });
    return response.data;
  },

  exportUsers: async (): Promise<UserListResponse> => {
    // This would need to be implemented on the backend if needed
    const response = await api.get<UserListResponse>('/admin/users/', { 
      params: { format: 'csv' } 
    });
    return response.data;
  },
};

// Role Management interfaces and services
interface Role {
  id: number;
  role_name: string;
  description: string;
  access_level: number;
  can_provide_expert_feedback: boolean;
  can_manage_users: boolean;
  can_access_analytics: boolean;
  user_count: number;
}

interface RoleListResponse {
  roles: Role[];
  total_count: number;
}

interface CreateRoleResponse {
  id: number;
  role_name: string;
  description: string;
  message: string;
}

interface UpdateRoleResponse {
  id: number;
  role_name: string;
  description: string;
  message: string;
}

interface Permission {
  id: string;
  name: string;
  description: string;
  category: string;
}

interface PermissionsResponse {
  permissions: Permission[];
  role_permissions: {
    [roleName: string]: {
      can_provide_expert_feedback: boolean;
      can_manage_users: boolean;
      can_access_analytics: boolean;
    };
  };
}

interface UserGroup {
  id: string;
  name: string;
  type: string;
  description: string;
  user_count: number;
  users: {
    id: number;
    username: string;
    email: string;
    full_name: string;
  }[];
}

interface UserGroupsResponse {
  groups: UserGroup[];
  total_groups: number;
}

// Role Management API
export const roleService = {
  listRoles: async (): Promise<RoleListResponse> => {
    const response = await api.get<RoleListResponse>('/admin/roles/');
    return response.data;
  },

  createRole: async (roleData: {
    role_name: string;
    description: string;
    access_level: number;
    can_provide_expert_feedback: boolean;
    can_manage_users: boolean;
    can_access_analytics: boolean;
  }): Promise<CreateRoleResponse> => {
    const response = await api.post<CreateRoleResponse>('/admin/roles/create/', roleData);
    return response.data;
  },

  updateRole: async (roleId: number, roleData: {
    description?: string;
    access_level?: number;
    can_provide_expert_feedback?: boolean;
    can_manage_users?: boolean;
    can_access_analytics?: boolean;
  }): Promise<UpdateRoleResponse> => {
    const response = await api.put<UpdateRoleResponse>(`/admin/roles/${roleId}/update/`, roleData);
    return response.data;
  },

  deleteRole: async (roleId: number): Promise<{ message: string; status: string }> => {
    const response = await api.delete<{ message: string; status: string }>(`/admin/roles/${roleId}/delete/`);
    return response.data;
  },
};

// Permission Management API
export const permissionService = {
  getPermissions: async (): Promise<PermissionsResponse> => {
    const response = await api.get<PermissionsResponse>('/admin/permissions/');
    return response.data;
  },
};

// User Groups API
export const userGroupService = {
  getUserGroups: async (): Promise<UserGroupsResponse> => {
    const response = await api.get<UserGroupsResponse>('/admin/user-groups/');
    return response.data;
  },
};

// Analysis History interfaces
interface AnalysisHistoryItem {
  id: string;
  date: string;
  classification: string;
  ridge_count: number;
  confidence: number;
  status: string;
  image_id: number;
  processing_time: string;
}

interface AnalysisHistoryResponse {
  history: AnalysisHistoryItem[];
  total_count: number;
  status: string;
}

interface AnalysisDetail {
  id: string;
  type: string;
  status: string;
  upload_date: string;
  analyzed_date: string;
  user: string;
  pattern: string;
  pattern_subtype: string;
  confidence_score: number;
  minutiae_count: number;
  notes: string;
  image_url?: string;
  processing_time: string;
  analysis_results: Record<string, unknown>;
}

interface AnalysisDetailResponse {
  analysis: AnalysisDetail;
  status: string;
}

interface DeleteAnalysisResponse {
  message: string;
  status: string;
}

interface BulkDeleteAnalysisResponse {
  message: string;
  deleted_count: number;
  status: string;
}

// Analysis History API
export const analysisService = {
  getUserHistory: async (): Promise<AnalysisHistoryResponse> => {
    const response = await api.get<AnalysisHistoryResponse>('/user/analysis-history/');
    return response.data;
  },

  getAnalysisDetail: async (analysisId: string): Promise<AnalysisDetailResponse> => {
    const response = await api.get<AnalysisDetailResponse>(`/analysis/${analysisId}/`);
    return response.data;
  },

  deleteAnalysis: async (analysisId: string): Promise<DeleteAnalysisResponse> => {
    const response = await api.delete<DeleteAnalysisResponse>(`/analysis/${analysisId}/delete/`);
    return response.data;
  },

  bulkDeleteAnalyses: async (analysisIds: string[]): Promise<BulkDeleteAnalysisResponse> => {
    const response = await api.post<BulkDeleteAnalysisResponse>('/user/analysis/bulk-delete/', { 
      analysis_ids: analysisIds 
    });
    return response.data;
  },

  exportHistory: async (): Promise<AnalysisHistoryResponse> => {
    // For CSV export, we'll just get the data and format it client-side
    const response = await api.get<AnalysisHistoryResponse>('/user/analysis-history/');
    return response.data;
  },
};

// ==================== EXPORT SERVICES ====================

export interface ExportService {
  exportAnalysisPDF: (analysisId: number) => Promise<Blob>;
  exportUserHistoryCSV: () => Promise<Blob>;
  exportBulkAnalysisPDF: (analysisIds: number[]) => Promise<Blob>;
}

export const exportService: ExportService = {
  exportAnalysisPDF: async (analysisId: number): Promise<Blob> => {
    const response = await api.get(`/export/analysis/${analysisId}/pdf/`, {
      responseType: 'blob',
    });
    return response.data;
  },

  exportUserHistoryCSV: async (): Promise<Blob> => {
    const response = await api.get('/export/user/history/csv/', {
      responseType: 'blob',
    });
    return response.data;
  },

  exportBulkAnalysisPDF: async (analysisIds: number[]): Promise<Blob> => {
    const response = await api.post('/export/bulk/pdf/', 
      { analysis_ids: analysisIds },
      { responseType: 'blob' }
    );
    return response.data;
  },
};

// ==================== FEEDBACK SERVICES ====================

export interface FeedbackSubmission {
  analysis_id: number;
  feedback_type: 'correction' | 'validation' | 'improvement';
  correction_details?: string;
  corrected_ridge_count?: number;
  corrected_classification?: string;
  helpfulness_rating?: number; // 1-5 scale
}

export interface FeedbackItem {
  id: number;
  user: string;
  feedback_type: string;
  correction_details?: string;
  corrected_ridge_count?: number;
  corrected_classification?: string;
  feedback_date: string;
  helpfulness_rating?: number;
  is_expert_feedback: boolean;
}

export interface FeedbackResponse {
  feedback: FeedbackItem[];
  total_count: number;
  status: string;
}

export interface FeedbackSubmissionResponse {
  message: string;
  feedback_id: number;
  is_expert_feedback: boolean;
  status: string;
}

export interface UserFeedbackHistory {
  id: number;
  analysis_id: number;
  fingerprint_title: string;
  feedback_type: string;
  correction_details?: string;
  corrected_ridge_count?: number;
  corrected_classification?: string;
  feedback_date: string;
  helpfulness_rating?: number;
  is_expert_feedback: boolean;
}

export interface UserFeedbackHistoryResponse {
  feedback_history: UserFeedbackHistory[];
  total_count: number;
  status: string;
}

export const feedbackService = {
  submitFeedback: async (feedbackData: FeedbackSubmission): Promise<FeedbackSubmissionResponse> => {
    const response = await api.post<FeedbackSubmissionResponse>('/feedback/submit/', feedbackData);
    return response.data;
  },

  getAnalysisFeedback: async (analysisId: number): Promise<FeedbackResponse> => {
    const response = await api.get<FeedbackResponse>(`/feedback/analysis/${analysisId}/`);
    return response.data;
  },

  getUserFeedbackHistory: async (): Promise<UserFeedbackHistoryResponse> => {
    const response = await api.get<UserFeedbackHistoryResponse>('/feedback/user/history/');
    return response.data;
  },
};

// ==================== UTILITY FUNCTIONS ====================

export const downloadUtils = {
  downloadBlob: (blob: Blob, filename: string) => {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  },

  downloadAnalysisPDF: async (analysisId: number, filename?: string) => {
    try {
      const blob = await exportService.exportAnalysisPDF(analysisId);
      const downloadFilename = filename || `analysis_${analysisId}_report.pdf`;
      downloadUtils.downloadBlob(blob, downloadFilename);
    } catch (error) {
      console.error('Failed to download analysis PDF:', error);
      throw error;
    }
  },

  downloadUserHistoryCSV: async (username?: string) => {
    try {
      const blob = await exportService.exportUserHistoryCSV();
      const downloadFilename = `fingerprint_analysis_history_${username || 'user'}.csv`;
      downloadUtils.downloadBlob(blob, downloadFilename);
    } catch (error) {
      console.error('Failed to download user history CSV:', error);
      throw error;
    }
  },

  downloadBulkAnalysisPDF: async (analysisIds: number[], filename?: string) => {
    try {
      const blob = await exportService.exportBulkAnalysisPDF(analysisIds);
      const downloadFilename = filename || `bulk_analysis_report_${analysisIds.length}_items.pdf`;
      downloadUtils.downloadBlob(blob, downloadFilename);
    } catch (error) {
      console.error('Failed to download bulk analysis PDF:', error);
      throw error;
    }
  },
};

export default api;