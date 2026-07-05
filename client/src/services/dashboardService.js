import api from "./api.js";

export const getDashboard = () =>
  api.get("/api/dashboard").then((r) => r.data);
