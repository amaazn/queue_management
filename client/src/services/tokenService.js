import api from "./api.js";

export const getTokens = (queueId) =>
  api.get(`/api/tokens/${queueId}`).then((r) => r.data);

export const addToken = (queueId, personName) =>
  api.post("/api/tokens", { queueId, personName }).then((r) => r.data);

export const moveTokenUp = (id) =>
  api.put(`/api/tokens/${id}/up`).then((r) => r.data);

export const moveTokenDown = (id) =>
  api.put(`/api/tokens/${id}/down`).then((r) => r.data);

export const serveNext = (queueId) =>
  api.put(`/api/tokens/serve/${queueId}`).then((r) => r.data);

export const cancelToken = (id) =>
  api.put(`/api/tokens/${id}/cancel`).then((r) => r.data);
