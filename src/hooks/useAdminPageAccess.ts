import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { type AppRole, useAuth } from "@/hooks/useAuth";

interface UseAdminPageAccessOptions {
  unauthorizedPath?: string;
  forbiddenPath?: string;
  showForbiddenToast?: boolean;
  forbiddenMessage?: string;
  allowedRoles?: AppRole[];
}

const DEFAULT_ALLOWED_ROLES: AppRole[] = ["admin", "marketer"];

export function useAdminPageAccess(options: UseAdminPageAccessOptions = {}) {
  const {
    unauthorizedPath = "/auth",
    forbiddenPath = "/",
    showForbiddenToast = true,
    forbiddenMessage = "You don't have permissions for this area.",
    allowedRoles = DEFAULT_ALLOWED_ROLES,
  } = options;

  const navigate = useNavigate();
  const { user, role, loading } = useAuth();
  const hasShownForbiddenToast = useRef(false);
  const isAllowedRole = allowedRoles.includes(role);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      navigate(unauthorizedPath, { replace: true });
    }
  }, [loading, navigate, unauthorizedPath, user]);

  useEffect(() => {
    if (loading || !user || isAllowedRole) {
      hasShownForbiddenToast.current = false;
      return;
    }

    if (showForbiddenToast && !hasShownForbiddenToast.current) {
      toast.error(forbiddenMessage);
      hasShownForbiddenToast.current = true;
    }

    navigate(forbiddenPath, { replace: true });
  }, [forbiddenMessage, forbiddenPath, isAllowedRole, loading, navigate, showForbiddenToast, user]);

  const isAuthorized = !!user && isAllowedRole;
  const isCheckingAccess = loading || !isAuthorized;

  return {
    user,
    role,
    isAuthorized,
    isCheckingAccess,
  };
}
