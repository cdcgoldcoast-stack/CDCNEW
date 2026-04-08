import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { type AppRole, useAuth } from "@/hooks/useAuth";

interface RequireAdminProps {
  children: ReactNode;
  allowedRoles?: AppRole[];
  forbiddenPath?: string;
}

const DEFAULT_ALLOWED_ROLES: AppRole[] = ["admin", "marketer"];

const RequireAdmin = ({
  children,
  allowedRoles = DEFAULT_ALLOWED_ROLES,
  forbiddenPath = "/",
}: RequireAdminProps) => {
  const { user, role, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-foreground/60">Checking access...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace state={{ from: location.pathname }} />;
  }

  if (!allowedRoles.includes(role)) {
    return <Navigate to={forbiddenPath} replace />;
  }

  return <>{children}</>;
};

export default RequireAdmin;
