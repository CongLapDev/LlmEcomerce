import { useNavigate } from "react-router-dom";
import useAuth from "./useAuth";
import { useEffect, useRef, useMemo } from "react";

/**
 * RoleBaseAuthorize - Route guard component that checks user roles before rendering
 */
function RoleBaseAuthorize({ path, role, onFail, onSuccess, children }) {
  const navigate = useNavigate();
  const [state, user, hasRole] = useAuth();
  const redirectExecutedRef = useRef(false);

  const isValid = useMemo(() => {
    if (state !== 1) {
      return null;
    }
    return hasRole(role);
  }, [state, hasRole, role]);

  useEffect(() => {
    if (state === 1) {
      console.log("[RoleBaseAuthorize] Component rendered", {
        path: path || "unknown",
        state: state,
        hasUser: !!user,
        userRoles: user?.account?.roles?.map((r) => r.name) || [],
        requiredRole: role,
        isValid: isValid,
      });
    }
  }, [state, user, role, path, isValid]);

  useEffect(() => {
    if (state !== 1 || isValid === null) {
      return;
    }

    if (isValid === false) {
      if (redirectExecutedRef.current) {
        return;
      }

      const currentPath = window.location.pathname;

      if (currentPath === "/login" || currentPath === "/admin/login") {
        return;
      }

      console.log(
        "[RoleBaseAuthorize] User not authorized, redirecting to /login",
      );
      redirectExecutedRef.current = true;

      if (!onFail) {
        navigate("/login", { replace: true });
      }
    } else if (isValid === true) {
      redirectExecutedRef.current = false;
    }
  }, [state, isValid, navigate, onFail]);

  if (state !== 1 || isValid === null) {
    return null;
  }

  if (isValid === true) {
    if (onSuccess) return onSuccess();
    return <>{children}</>;
  }

  if (onFail) return onFail();

  return null;
}

export default RoleBaseAuthorize;
