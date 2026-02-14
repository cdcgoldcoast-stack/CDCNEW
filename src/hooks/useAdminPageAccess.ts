import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

interface UseAdminPageAccessOptions {
  unauthorizedPath?: string;
  forbiddenPath?: string;
  showForbiddenToast?: boolean;
}

export function useAdminPageAccess(options: UseAdminPageAccessOptions = {}) {
  const {
    unauthorizedPath = "/auth",
    forbiddenPath = "/",
    showForbiddenToast = true,
  } = options;

  const navigate = useNavigate();
  const { user, isAdmin, loading } = useAuth();
  const hasShownForbiddenToast = useRef(false);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      navigate(unauthorizedPath, { replace: true });
    }
  }, [loading, navigate, unauthorizedPath, user]);

  useEffect(() => {
    if (loading || !user || isAdmin) {
      hasShownForbiddenToast.current = false;
      return;
    }

    if (showForbiddenToast && !hasShownForbiddenToast.current) {
      toast.error("You don't have admin permissions.");
      hasShownForbiddenToast.current = true;
    }

    navigate(forbiddenPath, { replace: true });
  }, [forbiddenPath, isAdmin, loading, navigate, showForbiddenToast, user]);

  const isAuthorized = !!user && isAdmin;
  const isCheckingAccess = loading || !isAuthorized;

  return {
    user,
    isAuthorized,
    isCheckingAccess,
  };
}
