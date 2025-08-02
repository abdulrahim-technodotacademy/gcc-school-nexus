import axios from "axios";
import { jwtDecode } from "jwt-decode";

const baseURL = import.meta.env.VITE_API_BASE_URL;

export const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Function to check and refresh token if needed
const checkAndRefreshToken = async () => {
  const accessToken = localStorage.getItem("accessToken");
  const refreshToken = localStorage.getItem("refreshToken");

  if (!accessToken || !refreshToken) return null;

  try {
    const decoded: { exp: number } = jwtDecode(accessToken);
    const isExpired = decoded.exp * 1000 < Date.now();

    if (isExpired) {
      const response = await axios.post(`${baseURL}/accounts/token/refresh/`, {
        refresh: refreshToken,
      });

      const newAccessToken = response.data.access;
      localStorage.setItem("accessToken", newAccessToken);
      return newAccessToken;
    }
    
    return accessToken;
  } catch (error) {
    console.error("Token refresh failed:", error);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userData");
    window.location.href = "/login";
    return null;
  }
};

// Set up periodic token check (every 30 minutes)
const TOKEN_CHECK_INTERVAL = 30 * 60 * 1000; // 30 minutes
setInterval(checkAndRefreshToken, TOKEN_CHECK_INTERVAL);

// Request interceptor
api.interceptors.request.use(
  async (config) => {
    // Skip token check for certain endpoints
    if (config.url?.includes('/accounts/token/refresh') || 
        config.url?.includes('/accounts/login')) {
      return config;
    }

    const token = await checkAndRefreshToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      const newToken = await checkAndRefreshToken();
      if (newToken) {
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      }
    }
    
    return Promise.reject(error);
  }
);