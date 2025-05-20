// File: frontend-web/src/utils/api.ts

// Ensure your API_URL is correctly defined, possibly from an environment variable for flexibility
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_BASE_URL) {
  console.error("FATAL ERROR: NEXT_PUBLIC_API_URL is not defined. Please set it in your .env.local file.");
  // You might throw an error here or have a default for local dev, but failing loudly is often better for misconfigurations.
  // For local development, you could have a fallback, but ensure production builds have it set.
  // For example: API_BASE_URL = "http://localhost:8000/api"; // Fallback for local dev if .env is missing
}

interface LoginResponse { // Keep your interfaces
  token: string;
  user_id: string;
  email: string;
  username: string;
  role: string;
}

interface RegisterResponse extends LoginResponse { // Registration might return similar data upon success
    id: string; // or number
}

interface UserData {
    id: string;
    username: string;
    email: string;
    role: string;
    token?: string; // Token is part of LoginResponse, not usually stored with user_data directly
}


export const auth = {
  login: async (username: string, password: string): Promise<LoginResponse> => {
    if (!API_BASE_URL) { // Check if API_BASE_URL was resolved
        throw new Error("API URL is not configured. Login cannot proceed.");
    }
    const fullLoginUrl = `${API_BASE_URL}/login/`;
    console.log(`Attempting to login user: ${username} to URL: ${fullLoginUrl}`);

    const response = await fetch(fullLoginUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });
    // ... rest of your login logic from the previous confirmed good version ...
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ detail: "Login failed due to a server error." }));
      const detail = errorData.detail || errorData.non_field_errors?.[0] || "Login failed. Please check your credentials.";
      throw new Error(detail);
    }
    const data: LoginResponse = await response.json();
    if (data.token) {
      localStorage.setItem("token", data.token);
      const basicUserData = { id: data.user_id, username: data.username, email: data.email, role: data.role };
      localStorage.setItem("user_data", JSON.stringify(basicUserData));
    } else {
      throw new Error("Login successful, but no token was received.");
    }
    return data;
    },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken"); // Retain in case you implement refresh tokens
    localStorage.removeItem("user_data");
  },

  isAuthenticated: (): boolean => {
    // Check for the presence of a token
    const token = localStorage.getItem("token");
    // Optional: Add token expiration check here if tokens are JWTs with an expiry
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

  register: async (username: string, email: string, password: string): Promise<any> => { // Adjust 'any' to RegisterResponse
    if (!API_BASE_URL) {
        throw new Error("API URL is not configured. Registration cannot proceed.");
    }
    const fullRegisterUrl = `${API_BASE_URL}/register/`;
    console.log(`Attempting to register user: ${username} to URL: ${fullRegisterUrl}`);

    const response = await fetch(fullRegisterUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, email, password }),
    });
    // ... rest of your register logic from the previous confirmed good version ...
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: "Registration failed due to a server error." }));
        let errorMessage = "Registration failed. Please try again.";
        if (errorData.username && Array.isArray(errorData.username)) errorMessage = `Username: ${errorData.username.join(", ")}`;
        else if (errorData.email && Array.isArray(errorData.email)) errorMessage = `Email: ${errorData.email.join(", ")}`;
        else if (errorData.password && Array.isArray(errorData.password)) errorMessage = `Password: ${errorData.password.join(", ")}`;
        else if (errorData.detail) errorMessage = errorData.detail;
        else if (errorData.non_field_errors && Array.isArray(errorData.non_field_errors)) errorMessage = errorData.non_field_errors.join(", ");
        throw new Error(errorMessage);
    }
    const data = await response.json();
    if (data.token) {
        localStorage.setItem("token", data.token);
        const basicUserData = { id: data.id, username: data.username, email: data.email, role: data.role };
        localStorage.setItem("user_data", JSON.stringify(basicUserData));
    } else {
        console.warn("Registration successful, but no token received.");
    }
    return data;
  },

};