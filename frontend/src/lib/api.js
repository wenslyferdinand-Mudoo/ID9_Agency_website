import axios from "axios";

// Support both the documented legacy variable and the Vercel project variable.
const configuredBackendUrl =
  process.env.REACT_APP_BACKEND_URL || process.env.REACT_APP_API_URL || "";
const BACKEND_URL = configuredBackendUrl.replace(/\/+$/, "");
export const API_BASE = BACKEND_URL
  ? BACKEND_URL.endsWith("/api")
    ? BACKEND_URL
    : `${BACKEND_URL}/api`
  : null;

const api = axios.create({ baseURL: API_BASE });

api.interceptors.request.use((config) => {
  if (!BACKEND_URL) {
    return Promise.reject(
      new Error(
        "Backend URL is not configured. Set REACT_APP_API_URL or REACT_APP_BACKEND_URL."
      )
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
