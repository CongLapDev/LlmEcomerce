import { useDispatch, useSelector } from "react-redux";
import APIBase from "../api/ApiBase";
import { userSlide } from "../store/user/userSlide";
import { useEffect, useState, useCallback, useRef, useMemo } from "react";

/**
 * useAuth Hook - Manages authentication state and user data
 * 
 * Optimized Version (Senior Performance Engineer Edition):
 * - Removed circular dependency: requestAuth is now stable and doesn't depend on state/user
 * - Uses functional state updates and mutable refs for internal guards
 * - Prevents redundant re-renders and bridge evaluation cycles
 */
function normalizeRoles(roles) {
  if (!roles) return [];
  return roles
    .map((r) => {
      if (!r?.name) return null;
      return r.name.toUpperCase().replace(/^ROLE_/, "");
    })
    .filter(Boolean);
}

function useAuth() {
  const user = useSelector((state) => state.user);
  const [state, setState] = useState(2); // 2 = loading, 1 = loaded
  const dispatch = useDispatch();
  
  // Refs are the backbone of a stable auth hook - they don't trigger re-renders
  const hasRequestedRef = useRef(false);
  const requestAuthInProgressRef = useRef(false);

  // Sync state 1-loading to 2-loaded if user exists in Redux (login flow)
  useEffect(() => {
    if (user === null && hasRequestedRef.current) {
      hasRequestedRef.current = false; // Reset on logout
    }
    if (user && state !== 1) {
      setState(1);
    }
  }, [user, state]);

  /**
   * requestAuth - STABLE reference
   * Dependencies: [dispatch]
   * Why: state and user are handled via internal refs or Redux, keeping the function reference identical 
   * throughout the entire application lifecycle unless dispatch somehow changes.
   */
  const requestAuth = useCallback(() => {
    // GUARD: If already requested or in progress, BAIL OUT
    if (hasRequestedRef.current || requestAuthInProgressRef.current) {
      return Promise.resolve(null);
    }

    const token = window.localStorage.getItem("AUTH_TOKEN");
    if (!token || token.trim() === "") {
      setState(1); // Set state to loaded (guest)
      hasRequestedRef.current = true;
      return Promise.resolve(null);
    }

    setState(2); // Set loading state
    requestAuthInProgressRef.current = true;
    hasRequestedRef.current = true;

    return APIBase.get("/api/v1/auth/user")
      .then((payload) => payload.data)
      .then((data) => {
        requestAuthInProgressRef.current = false;
        if (data) {
          // Normalize roles
          if (data.account && data.account.roles && Array.isArray(data.account.roles)) {
            const normalizedRoleNames = normalizeRoles(data.account.roles);
            data.account.roles = normalizedRoleNames.map((name) => ({ name }));
          }
          
          dispatch(userSlide.actions.create(data));
          
          // Double RAF is a browser-safe way to ensure Redux propagation before state change
          return new Promise((resolve) => {
            requestAnimationFrame(() => {
              requestAnimationFrame(() => {
                setState(1);
                resolve(data);
              });
            });
          });
        } else {
          setState(1);
          return null;
        }
      })
      .catch((e) => {
        requestAuthInProgressRef.current = false;
        setState(1);
        throw e;
      });
  }, [dispatch]); // STABLE: No dependency on state/user

  /**
   * Auto-fetch user on mount
   */
  useEffect(() => {
    // If user already exists in Redux or we already requested, bail out
    if (hasRequestedRef.current || (user && user.id)) {
      if (user && user.id && state !== 1) setState(1);
      return;
    }

    const token = window.localStorage.getItem("AUTH_TOKEN");
    if (token && token.trim() !== "") {
      requestAuth().catch(() => {
        // Silent fail on mount, just set to loaded
        setState(1);
      });
    } else {
      setState(1);
      hasRequestedRef.current = true;
    }
  }, [requestAuth, user, state]); // Refers to stable requestAuth

  /**
   * role() - Memoized normalized user roles
   */
  const role = useMemo(() => {
    if (state !== 1) return null;
    if (!user) return ["GUEST"];
    if (!user.account || !user.account.roles || !Array.isArray(user.account.roles)) return ["GUEST"];

    const roles = user.account.roles
      .map((roleObj) => {
        let roleName = typeof roleObj === "object" ? roleObj.name : roleObj;
        return (roleName || "").toUpperCase().replace(/^ROLE_/, "");
      })
      .filter(Boolean);

    return roles.length > 0 ? roles : ["GUEST"];
  }, [state, user]);

  /**
   * hasRole - STABLE memoized function
   */
  const hasRole = useCallback(
    (required) => {
      if (role === null) return null;
      if (!required) return true;
      
      const check = (r) => role.includes((r || "").toUpperCase().replace(/^ROLE_/, ""));
      return Array.isArray(required) ? required.some(check) : check(required);
    },
    [role]
  );

  return [state, user, hasRole, requestAuth];
}

export default useAuth;
