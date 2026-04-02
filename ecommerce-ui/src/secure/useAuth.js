import { useDispatch, useSelector } from "react-redux";
import APIBase from "../api/ApiBase";
import { userSlide } from "../store/user/userSlide";
import { useEffect, useState, useCallback, useRef, useMemo } from "react";

/**
 * useAuth Hook - Manages authentication state and user data
 * 
 * Performance Refactor (Lag & Loop Fix Edition):
 * - Removed requestAnimationFrame: Immediate state updates to eliminate stutter.
 * - Decoupled dependencies: requestAuth is stable, and main effect bails out early.
 * - Standardized loading/loaded: state transitions are eager but guarded.
 */
function normalizeRoles(roles) {
  if (!roles) return [];
  return roles
    .map((r) => {
      let roleName = null;
      if (typeof r === "string") roleName = r;
      else if (typeof r === "object" && r !== null && r.name) roleName = r.name;
      
      if (!roleName) return null;
      return roleName.toUpperCase().replace(/^ROLE_/, "");
    })
    .filter(Boolean);
}

function useAuth() {
  const user = useSelector((state) => state.user);
  const [state, setState] = useState(2); // 2 = loading, 1 = loaded
  const dispatch = useDispatch();
  
  const hasRequestedRef = useRef(false);
  const inProgressRef = useRef(false);

  // Sync state if user arrives via login (Redux updates)
  useEffect(() => {
    if (user === null && hasRequestedRef.current) hasRequestedRef.current = false;
    if (user && state !== 1) setState(1);
  }, [user, state]);

  /**
   * requestAuth - STABLE (Depends ONLY on dispatch)
   */
  const requestAuth = useCallback(() => {
    if (hasRequestedRef.current || inProgressRef.current) return Promise.resolve(null);
    
    const token = window.localStorage.getItem("AUTH_TOKEN");
    if (!token?.trim()) {
      setState(1);
      hasRequestedRef.current = true;
      return Promise.resolve(null);
    }

    setState(2); // Loading
    inProgressRef.current = true;
    hasRequestedRef.current = true;

    return APIBase.get("/api/v1/auth/user").then(p => p.data).then(data => {
      inProgressRef.current = false;
      if (data) {
        if (data.account?.roles) {
          const normalized = normalizeRoles(data.account.roles);
          data.account.roles = normalized.map(name => ({ name }));
        }
        dispatch(userSlide.actions.create(data));
        setState(1); // Immediate finish (Removed RAF)
        return data;
      }
      setState(1);
      return null;
    }).catch(e => {
      inProgressRef.current = false;
      setState(1);
      throw e;
    });
  }, [dispatch]);

  /**
   * Mount Effect
   */
  useEffect(() => {
    // If already checking, or redundant (user in Redux), bail
    if (hasRequestedRef.current || (user && user.id)) {
      if (user?.id && state !== 1) setState(1);
      return;
    }

    const token = window.localStorage.getItem("AUTH_TOKEN");
    if (token?.trim()) {
      requestAuth().catch(() => setState(1));
    } else {
      setState(1);
      hasRequestedRef.current = true;
    }
  }, [requestAuth, user]); // Removed 'state' from deps to prevent re-render noise

  /**
   * role() & hasRole - Memoized
   */
  const role = useMemo(() => {
    if (state !== 1) return null;
    if (!user?.account?.roles) return ["GUEST"];
    const roles = user.account.roles
      .map(r => (typeof r === "string" ? r : r.name).toUpperCase().replace(/^ROLE_/, ""))
      .filter(Boolean);
    return roles.length > 0 ? roles : ["GUEST"];
  }, [state, user]);

  const hasRole = useCallback(r => {
    if (role === null) return null;
    if (!r) return true;
    const check = (i) => role.includes((i || "").toUpperCase().replace(/^ROLE_/, ""));
    return Array.isArray(r) ? r.some(check) : check(r);
  }, [role]);

  return [state, user, hasRole, requestAuth];
}

export default useAuth;
