// This is a suggested implementation for your auth utility

const API_URL = "http://localhost:8000/api";

export const auth = {
  login: async (username: string, password: string) => {
    const response = await fetch(`${API_URL}/token/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || "Login failed");
    }

    const data = await response.json();
    
    // Store the token
    localStorage.setItem("token", data.access);
    if (data.refresh) {
      localStorage.setItem("refreshToken", data.refresh);
    }

    // Get user data
    const userResponse = await fetch(`${API_URL}/userprofile/`, {
      headers: {
        Authorization: `Bearer ${data.access}`,
      },
    });

    if (!userResponse.ok) {
      throw new Error("Failed to fetch user data");
    }

    const userData = await userResponse.json();
    
    // Store user data
    localStorage.setItem("user_data", JSON.stringify(userData));
    
    return userData;
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user_data");
  },

  isAuthenticated: () => {
    return !!localStorage.getItem("token");
  },

  getCurrentUser: () => {
    const userData = localStorage.getItem("user_data");
    return userData ? JSON.parse(userData) : null;
  },

  register: async (username: string, email: string, password: string) => {
    const response = await fetch(`${API_URL}/register/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || "Registration failed");
    }

    return await response.json();
  },
};
