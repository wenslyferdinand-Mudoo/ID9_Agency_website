import axios from "axios";

// Support both environment variable names used by the project over time.
// Vercel currently defines REACT_APP_API_URL; older local setups use
// REACT_APP_BACKEND_URL. Keep the API path stable and avoid a duplicated
// "/api" suffix when the configured URL already includes it.
const configuredBackendUrl =
  process.env.REACT_APP_BACKEND_URL || process.env.REACT_APP_API_URL || "";
const normalizedBackendUrl = configuredBackendUrl
  .trim()
  .replace(/\/+$/, "")
  .replace(/\/api$/i, "");

export const API_BASE = normalizedBackendUrl
  ? `${normalizedBackendUrl}/api`
  : "/api";

const api = axios.create({ baseURL: API_BASE });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("id9_token");
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;

/**
 * Guarantees an array from any API response.
 * Protects against crashes when a backend/CDN returns HTML, an object,
 * null, or is unreachable (e.g. CORS blocked on Vercel).
 */
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
