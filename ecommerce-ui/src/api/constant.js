/**
 * API Context - PRODUCTION SAFE
 *
 * Uses REACT_APP_API_URL environment variable (already set in Vercel).
 * If not set, will be empty string (intentional failure vs silent localhost fallback).
 *
 * Note: This constant is legacy. Prefer using APIBase.API_BASE_URL from ApiBase.js
 */
export const API_CONTEXT = process.env.REACT_APP_API_URL
  ? process.env.REACT_APP_API_URL.replace(/\/$/, "") + "/"
  : "";
