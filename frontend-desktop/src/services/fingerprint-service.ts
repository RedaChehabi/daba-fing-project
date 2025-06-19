import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

// Create an axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
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

interface FingerprintUploadResponse {
  id: number;
  message?: string;
  upload_date: string;
  image: string;
  title?: string;
  [key: string]: any;
}

interface AnalysisResult {
  id: number;
  fingerprint_id: number;
  classification: string;
  ridge_count: number;
  confidence: number;
  processing_time: string;
  message?: string;
  status: string;
  additional_details?: any;
  [key: string]: any;
}

const fingerprintService = {
  /**
   * Uploads a fingerprint image and its metadata.
   * @param formData - The FormData object containing the image and metadata.
   * @returns A promise that resolves with the upload response.
   */
  async uploadFingerprint(formData: FormData): Promise<FingerprintUploadResponse> {
    console.log("fingerprintService.uploadFingerprint called with:", formData);
    
    try {
      const response = await api.post('/api/fingerprints/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log("Upload response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Upload error:", error);
      throw error;
    }
  },

  /**
   * Requests analysis for a previously uploaded fingerprint.
   * @param fingerprintId - The ID of the fingerprint to analyze.
   * @returns A promise that resolves with the analysis result.
   */
  async analyzeFingerprint(fingerprintId: number | string): Promise<AnalysisResult> {
    console.log(`fingerprintService.analyzeFingerprint called for ID: ${fingerprintId}`);
    
    try {
      const response = await api.post('/api/fingerprint/analyze/', { 
        fingerprint_id: fingerprintId 
      });
      console.log("Analysis result:", response.data);
      return response.data;
    } catch (error) {
      console.error("Analysis error:", error);
      throw error;
    }
  },

  /**
   * Get all fingerprints for the current user
   */
  async getFingerprints() {
    try {
      const response = await api.get('/api/fingerprints/');
      return response.data;
    } catch (error) {
      console.error("Error fetching fingerprints:", error);
      throw error;
    }
  },

  /**
   * Get details of a specific fingerprint
   */
  async getFingerprintDetails(fingerprintId: number) {
    try {
      const response = await api.get(`/api/fingerprints/${fingerprintId}/`);
      return response.data;
    } catch (error) {
      console.error("Error fetching fingerprint details:", error);
      throw error;
    }
  },

  /**
   * Download analysis PDF report
   */
  async exportAnalysisPDF(analysisId: number | string): Promise<Blob> {
    const response = await api.get(`/api/export/analysis/${analysisId}/pdf/`, {
      responseType: 'blob',
    });
    return response.data as Blob;
  },
};

console.log(process.env.NEXT_PUBLIC_API_URL);

export default fingerprintService;