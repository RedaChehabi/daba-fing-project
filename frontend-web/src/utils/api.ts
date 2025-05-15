// File: frontend-web/src/utils/api.ts

// Ensure your API_URL is correctly defined, possibly from an environment variable for flexibility
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

interface LoginResponse {
  token: string;
  user_id: string; // or number, adjust based on your backend User model's PK type
  email: string;
  username: string;
  role: string; // e.g., "Regular", "Expert", "Admin"
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
    const response = await fetch(`${API_URL}/login/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ detail: "Login failed due to a server error." }));
      // Prioritize more specific error messages from Django REST Framework
      const detail = errorData.detail || errorData.non_field_errors?.[0] || "Login failed. Please check your credentials.";
      throw new Error(detail);
    }

    const data: LoginResponse = await response.json();
    if (data.token) {
      localStorage.setItem("token", data.token);

      // Store essential user info received from login to avoid immediate re-fetch,
      // AuthContext can later fetch more details if needed.
      const basicUserData = {
        id: data.user_id,
        username: data.username,
        email: data.email,
        role: data.role,
      };
      localStorage.setItem("user_data", JSON.stringify(basicUserData));
    } else {
      throw new Error("Login successful, but no token was received from the server.");
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

  register: async (username: string, email: string, password: string): Promise<RegisterResponse> => {
    const response = await fetch(`${API_URL}/register/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      // Assuming backend register endpoint expects username, email, password
      // and potentially a 'role' if users can select it (default role is handled by backend)
      body: JSON.stringify({ username, email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ detail: "Registration failed due to a server error." }));
      let errorMessage = "Registration failed. Please try again.";
      // Provide more specific error feedback if available from backend
      if (errorData.username && Array.isArray(errorData.username)) errorMessage = `Username: ${errorData.username.join(", ")}`;
      else if (errorData.email && Array.isArray(errorData.email)) errorMessage = `Email: ${errorData.email.join(", ")}`;
      else if (errorData.password && Array.isArray(errorData.password)) errorMessage = `Password: ${errorData.password.join(", ")}`;
      else if (errorData.detail) errorMessage = errorData.detail;
      else if (errorData.non_field_errors && Array.isArray(errorData.non_field_errors)) errorMessage = errorData.non_field_errors.join(", ");
      throw new Error(errorMessage);
    }
    const data: RegisterResponse = await response.json();
      if (data.token) {
        localStorage.setItem("token", data.token); // Store token immediately after registration
        const basicUserData = {
          id: data.id, // Use 'id' from register response
          username: data.username,
          email: data.email,
          role: data.role,
      };
      localStorage.setItem("user_data", JSON.stringify(basicUserData));
    } else {
      // This case should ideally not happen if registration implies immediate login/token issuance
      console.warn("Registration successful, but no token was received. User may need to log in manually.");
    }
    return data;
  },
};