import axios, { type AxiosRequestHeaders } from "axios";

// API base URL 설정 (환경 변수 또는 기본값)
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

// axios 기본 설정
axios.defaults.baseURL = API_BASE_URL;

axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");

    if (token) {
      if (!config.headers) {
        config.headers = {} as AxiosRequestHeaders;
      }
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (status === 401 || status === 403) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");

      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);
