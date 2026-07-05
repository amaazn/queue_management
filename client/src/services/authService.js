import api from "./api.js";

export const loginRequest = (email, password) =>
  api.post("/api/auth/login", { email, password }).then((r) => r.data);

export const fetchMe = () => api.get("/api/auth/me").then((r) => r.data);

export const logoutRequest = () =>
  api.post("/api/auth/logout").then((r) => r.data);
