import axios from "axios";

const BACKEND_URL = (
  process.env.REACT_APP_BACKEND_URL ||
  process.env.REACT_APP_API_URL ||
  ""
).trim().replace(/\/+$/, "");

export const API_BASE = BACKEND_URL ? `${BACKEND_URL}/api` : null;
export const apiConfigured = Boolean(BACKEND_URL);

const api = axios.create({
  ...(API_BASE ? { baseURL: API_BASE } : {}),
  timeout: 15000,
});

api.interceptors.request.use((config) => {
  if (!apiConfigured) {
    return Promise.reject(
      new Error("ID9 backend API is not configured. Set REACT_APP_BACKEND_URL in the Vercel project.")
    );
  }

  const token = localStorage.getItem("id9_token");
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;

export function safeArray(value) {
  return Array.isArray(value) ? value : [];
}

export function formatApiError(detail) {
  if (detail == null) return "Something went wrong. Please try again.";
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail))
    return detail.map((e) => (e && typeof e.msg === "string" ? e.msg : JSON.stringify(e))).join(" ");
  if (detail && typeof detail.msg === "string") return detail.msg;
  return String(detail);
}
