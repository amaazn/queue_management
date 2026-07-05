import api from "./api.js";

export const getQueues = () => api.get("/api/queues").then((r) => r.data);

export const getQueue = (id) =>
  api.get(`/api/queues/${id}`).then((r) => r.data);

export const createQueue = (name) =>
  api.post("/api/queues", { name }).then((r) => r.data);

export const deleteQueue = (id) =>
  api.delete(`/api/queues/${id}`).then((r) => r.data);
