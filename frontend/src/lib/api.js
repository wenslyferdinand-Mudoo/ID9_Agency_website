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

const api = axios.create({ baseURL: API_BASE, withCredentials: true });

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

// One refresh request is shared by concurrent API failures in this browser tab.
// The refresh credential itself is an HttpOnly cookie and is never read by JS.
let refreshPromise = null;
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    const url = original?.url || "";
    const isAuthEndpoint = /\/auth\/(login|refresh|logout)/.test(url);
    if (
      error.response?.status !== 401 ||
      !original ||
      original._retry ||
      original.skipAuthRefresh ||
      isAuthEndpoint ||
      !localStorage.getItem("id9_token")
    ) {
      return Promise.reject(error);
    }

    original._retry = true;
    try {
      const performRefresh = async () => {
        const currentToken = localStorage.getItem("id9_token");
        // Another tab may already have rotated the shared session cookie.
        if (currentToken && currentToken !== original.headers?.Authorization?.replace(/^Bearer\s+/i, "")) {
          return currentToken;
        }
        const { data } = await api.post("/auth/refresh", {}, { skipAuthRefresh: true });
        if (!data?.access_token) throw new Error("Refresh response did not include an access token.");
        localStorage.setItem("id9_token", data.access_token);
        return data.access_token;
      };

      let nextToken;
      if (navigator.locks?.request) {
        // Coordinate refresh rotation across tabs to avoid false reuse detection.
        nextToken = await navigator.locks.request("id9-auth-refresh", performRefresh);
      } else {
        if (!refreshPromise) {
          refreshPromise = performRefresh().finally(() => {
            refreshPromise = null;
          });
        }
        nextToken = await refreshPromise;
      }
      original.headers = original.headers || {};
      original.headers.Authorization = `Bearer ${nextToken}`;
      return api(original);
    } catch (refreshError) {
      localStorage.removeItem("id9_token");
      window.dispatchEvent(new Event("id9:auth-expired"));
      return Promise.reject(refreshError);
    }
  }
);

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
