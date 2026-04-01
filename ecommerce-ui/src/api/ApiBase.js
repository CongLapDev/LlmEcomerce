import axios from "axios";

/**
 * API Base URL Configuration - PRODUCTION SAFE
 *
 * CRITICAL: MUST use environment variable REACT_APP_API_BASE_URL
 * NO fallback to localhost - production must have explicit configuration
 *
 * If not set: Will be empty string and cause 400/404 errors
 * This is intentional - forces correct environment variable setup in production
 *
 * Usage: All API calls use this base URL automatically via APIBase axios instance
 * Example: axios.get("/api/v1/category") → ${API_BASE_URL}/api/v1/category
 */
export const API_BASE_URL = process.env.REACT_APP_API_URL || "";
export const LOCAL_URL = API_BASE_URL; // Alias for backward compatibility

// Frontend URL (Vercel URL in production)
export const BaseURL = process.env.REACT_APP_UI_URL || "";

// Startup validation & debugging
if (typeof window !== "undefined") {
  // CRITICAL: Log API configuration for debugging
  console.log("[🔧 ApiBase Config] =====================================");
  console.log(
    "[🔧 ApiBase Config] API_BASE_URL:",
    API_BASE_URL || "❌ NOT SET (ENV VAR MISSING)",
  );
  console.log(
    "[🔧 ApiBase Config] Frontend URL:",
    BaseURL || "❌ NOT SET (ENV VAR MISSING)",
  );
  console.log("[🔧 ApiBase Config] Node Env:", process.env.NODE_ENV);
  console.log("[🔧 ApiBase Config] =====================================");

  // WARNING: Production must have REACT_APP_API_URL (set in Vercel)
  if (!API_BASE_URL && process.env.NODE_ENV === "production") {
    console.error(
      "[❌ CRITICAL ERROR] REACT_APP_API_URL environment variable is NOT SET!",
    );
    console.error(
      "[❌ CRITICAL ERROR] All API calls will fail with 400/404 errors.",
    );
    console.error(
      "[❌ CRITICAL ERROR] Set REACT_APP_API_URL in Vercel environment variables.",
    );
  }
}

/**
 * Format image URL from backend response
 * If URL is already absolute (starts with http:// or https://), return as is
 * If URL is relative (starts with /), prepend API_BASE_URL
 * If URL is null/undefined, return null
 * @param {string|null|undefined} imageUrl - Image URL from backend
 * @returns {string|null} - Full image URL or null
 */
export function getImageUrl(imageUrl) {
  if (!imageUrl) return null;
  const normalizedBase = API_BASE_URL.replace(/\/+$/, "");
  const raw = String(imageUrl).trim();
  if (!raw) return null;
  const normalizedPath = raw.replace(/\\/g, "/");

  if (
    normalizedPath.startsWith("http://") ||
    normalizedPath.startsWith("https://")
  ) {
    return normalizedPath;
  }

  if (normalizedPath.includes("/uploads/")) {
    const path = normalizedPath.substring(normalizedPath.indexOf("/uploads/"));
    return `${normalizedBase}${path}`;
  }

  if (normalizedPath.startsWith("uploads/")) {
    return `${normalizedBase}/${normalizedPath}`;
  }

  if (normalizedPath.startsWith("/")) {
    return `${normalizedBase}${normalizedPath}`;
  }

  return `${normalizedBase}/uploads/${normalizedPath}`;
}

const AUTH_TOKEN_KEY = "AUTH_TOKEN";
const AUTH_URL_PATTERNS = ["/auth/", "/user/me"];
const AUTH_REDIRECT_PATHS = ["/login", "/admin/login"];
const isDev = process.env.NODE_ENV !== "production";

const getStoredToken = () => {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(AUTH_TOKEN_KEY);
  if (!raw) return null;
  const cleaned = raw.startsWith("Bearer ") ? raw.substring(7) : raw;
  return cleaned.trim() || null;
};

const normalizeRequestUrl = (config = {}) => {
  const { baseURL = "", url = "" } = config;
  if (!url) return baseURL;
  if (typeof url !== "string") return baseURL;
  return url.startsWith("http") ? url : `${baseURL || ""}${url}`;
};

const matchesAnyPattern = (value, patterns) => {
  if (!value) return false;
  const normalizedValue = value.toLowerCase();
  return patterns.some((pattern) => normalizedValue.includes(pattern));
};

const ensureHeaders = (config) => {
  if (!config) return {};
  config.headers = { ...(config.headers || {}) };
  return config.headers;
};

const attachAuthorizationHeader = (headers, token) => {
  const bearer = `Bearer ${token}`;
  headers.Authorization = bearer;
  if (!Object.prototype.hasOwnProperty.call(headers, "authorization")) {
    headers.authorization = bearer;
  }
};

const classifyStatus = (status) => {
  if (!status) return "unknown";
  if (status === 401) return "authentication";
  if (status === 403) return "authorization";
  if (status >= 500) return "server";
  if (status >= 400) return "business";
  return "unknown";
};

const redirectToLogin = () => {
  if (typeof window === "undefined") return;
  if (AUTH_REDIRECT_PATHS.includes(window.location.pathname)) return;
  window.location.href = "/login";
};

const persistTokenFromResponse = (response) => {
  if (!response?.headers || typeof window === "undefined") return;
  const tokenHeader =
    response.headers.authorization || response.headers.Authorization;
  if (!tokenHeader) return;
  const normalized = tokenHeader.startsWith("Bearer ")
    ? tokenHeader.substring(7)
    : tokenHeader;
  window.localStorage.setItem(AUTH_TOKEN_KEY, normalized.trim());
  if (isDev) {
    console.debug("[ApiBase] Token refreshed from response", {
      url: normalizeRequestUrl(response.config),
    });
  }
};

const APIBase = axios.create({
  baseURL: API_BASE_URL,
  // Removed withCredentials: true - backend uses JWT in Authorization headers, not cookies
});

// Request interceptor: Attach Authorization header if token exists in localStorage
// CRITICAL: This interceptor MUST run for ALL requests to ensure Authorization header is attached
APIBase.interceptors.request.use(
  (config) => {
    ensureHeaders(config);
    const requestUrl = normalizeRequestUrl(config);
    const isAuthRequest = matchesAnyPattern(requestUrl, AUTH_URL_PATTERNS);
    const hasAuthHeader = Object.keys(config.headers).some(
      (key) => key.toLowerCase() === "authorization",
    );

    const token = getStoredToken();
    if (token && !hasAuthHeader) {
      attachAuthorizationHeader(config.headers, token);
      if (isDev && isAuthRequest) {
        console.debug("[ApiBase] Attached auth header", {
          url: requestUrl,
          method: config.method,
        });
      }
    } else if (!token && isAuthRequest && isDev) {
      console.warn("[ApiBase] Auth request missing token", { url: requestUrl });
    }

    return config;
  },
  (error) => {
    console.error("[ApiBase] Request interceptor error:", error);
    return Promise.reject(
      error instanceof Error
        ? error
        : new Error(String(error) || "Unknown Request Error"),
    );
  },
);

APIBase.interceptors.response.use(
  (response) => {
    persistTokenFromResponse(response);
    return response;
  },
  (error) => {
    const status = error?.response?.status;
    const requestUrl = normalizeRequestUrl(error?.config);
    const category = classifyStatus(status);
    const isAuthRequest = matchesAnyPattern(requestUrl, AUTH_URL_PATTERNS);
    const meta = {
      category,
      status,
      url: requestUrl,
      method: error?.config?.method,
      body: error?.response?.data,
    };

    if (category === "authentication") {
      if (isAuthRequest) {
        console.error(
          "[ApiBase] Authentication failure - clearing token",
          meta,
        );
        if (typeof window !== "undefined") {
          window.localStorage.removeItem(AUTH_TOKEN_KEY);
        }
        redirectToLogin();
      } else {
        console.warn(
          "[ApiBase] Authentication warning (401) on business endpoint",
          meta,
        );
      }
    } else if (category === "authorization") {
      console.warn("[ApiBase] Authorization error (403)", meta);
    } else if (category === "business") {
      console.warn("[ApiBase] Business error (4xx)", meta);
    } else if (category === "server") {
      console.error("[ApiBase] Server error (5xx)", meta);
    } else {
      console.warn("[ApiBase] Unexpected response status", meta);
    }

    return Promise.reject(
      error instanceof Error
        ? error
        : new Error(
            error?.message || String(error) || "Unknown Response Error",
          ),
    );
  },
);

export default APIBase;
