/**
 * API Context - PRODUCTION SAFE
 *
 * Uses environment variable to ensure production deployment works correctly.
 * If not set, will be empty string (intentional failure vs silent localhost fallback).
 *
 * Note: This constant is legacy. Prefer using APIBase.API_BASE_URL from ApiBase.js
 */
export const API_CONTEXT = process.env.REACT_APP_API_BASE_URL
  ? process.env.REACT_APP_API_BASE_URL.replace(/\/$/, "") + "/"
  : "";
