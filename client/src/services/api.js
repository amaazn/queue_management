import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const url = error.config?.url || "";
    const onLoginPage = window.location.pathname.startsWith("/login");

    if (status === 401 && !url.endsWith("/api/auth/me") && !onLoginPage) {
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
