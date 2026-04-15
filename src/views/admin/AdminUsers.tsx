import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import InviteUserDialog from "@/components/admin/InviteUserDialog";
import { useAdminPageAccess } from "@/hooks/useAdminPageAccess";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import SEO from "@/components/SEO";
import { toast } from "sonner";
import {
  Loader2,
  Users,
  Shield,
  ShieldCheck,
  AlertTriangle,
  Trash2,
  RefreshCw,
} from "lucide-react";

interface UserRecord {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  role: "admin" | "marketer" | "user";
  created_at: string;
  last_sign_in_at: string | null;
}

async function fetchWithAuth(
  method: "GET" | "POST" | "PATCH" | "DELETE",
  body?: unknown,
) {
  const { data, error } = await supabase.functions.invoke("manage-users", {
    method,
    body: body ?? undefined,
  });

  if (error) {
    // supabase-js surfaces "Edge Function returned a non-2xx status code" without
    // the body — unwrap context.json() to get the real `error` field from the function.
    const context = (error as { context?: { json?: () => Promise<unknown> } }).context;
    if (context?.json) {
      try {
        const parsed = await context.json();
        const realMsg = (parsed as { error?: string })?.error;
        if (realMsg) throw new Error(realMsg);
      } catch (parseErr) {
        if (parseErr instanceof Error && parseErr.message) throw parseErr;
      }
    }
    const msg = (error as { message?: string }).message || "Request failed";
    throw new Error(msg);
  }

  if (data && typeof data === "object" && "error" in data) {
    throw new Error((data as { error: string }).error);
  }

  return data as { users?: UserRecord[] } | null;
}

const AdminUsers = () => {
  const { user, isAuthorized, isCheckingAccess } = useAdminPageAccess({
    showForbiddenToast: false,
    allowedRoles: ["admin"],
  });

  const [users, setUsers] = useState<UserRecord[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const data = await fetchWithAuth("GET");
      setUsers(data?.users ?? []);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to load users";
      setLoadError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthorized) {
      loadUsers();
    }
  }, [isAuthorized, loadUsers]);

  if (isCheckingAccess) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

  if (!user || !isAuthorized) {
    return null;
  }

  const handleRoleChange = async (userId: string, newRole: "admin" | "marketer" | "user") => {
    try {
      await fetchWithAuth("PATCH", { user_id: userId, role: newRole });
      toast.success("Role updated");
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
      );
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to update role";
      toast.error(msg);
    }
  };

  const handleDelete = async (userId: string) => {
    setDeleteLoading(true);
    try {
      await fetchWithAuth("DELETE", { user_id: userId });
      toast.success("User removed");
      setUsers((prev) => prev.filter((u) => u.id !== userId));
      setDeleteConfirmId(null);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to remove user";
      toast.error(msg);
    } finally {
      setDeleteLoading(false);
    }
  };

  const formatDate = (value: string | null) => {
    if (!value) return "Never";
    return new Date(value).toLocaleDateString("en-AU", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const adminCount = users.filter((u) => u.role === "admin").length;
  const marketerCount = users.filter((u) => u.role === "marketer").length;
  const regularUserCount = users.filter((u) => u.role === "user").length;

  return (
    <AdminLayout>
      <SEO title="Admin - Users" noIndex={true} />

      <div className="flex items-center justify-between mb-8">
        <div className="space-y-1">
          <h1 className="text-3xl font-serif italic text-foreground">Users</h1>
          <p className="text-foreground/60">
            Manage team members and their access roles
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={loadUsers} disabled={loading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <InviteUserDialog onInvited={loadUsers} />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Users className="w-8 h-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">{users.length}</p>
                <p className="text-sm text-foreground/60">Total Users</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-8 h-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">{adminCount}</p>
                <p className="text-sm text-foreground/60">Admins</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Shield className="w-8 h-8 text-amber-600" />
              <div>
                <p className="text-2xl font-bold">{marketerCount}</p>
                <p className="text-sm text-foreground/60">Marketers</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Shield className="w-8 h-8 text-foreground/40" />
              <div>
                <p className="text-2xl font-bold">{regularUserCount}</p>
                <p className="text-sm text-foreground/60">Regular Users</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* User List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Team Members</CardTitle>
          <CardDescription>
            Admins have full access. Marketers can work in lead, content, media, and settings areas. Users have no admin portal access.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loadError && (
            <Alert variant="destructive" className="mb-6">
              <AlertTriangle className="w-4 h-4" />
              <AlertTitle>Users couldn&apos;t be loaded</AlertTitle>
              <AlertDescription>
                {loadError}
                <div className="mt-3">
                  <Button variant="outline" size="sm" onClick={loadUsers} disabled={loading}>
                    Try again
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          ) : loadError && users.length === 0 ? (
            <p className="text-center text-foreground/50 py-12">
              User management is unavailable until the API responds.
            </p>
          ) : users.length === 0 ? (
            <p className="text-center text-foreground/50 py-12">
              No users found. Invite someone to get started.
            </p>
          ) : (
            <div className="divide-y divide-border">
              {users.map((u) => {
                const isCurrentUser = u.id === user.id;
                const displayName =
                  [u.first_name, u.last_name].filter(Boolean).join(" ") || null;

                return (
                  <div
                    key={u.id}
                    className="flex items-center justify-between py-4 first:pt-0 last:pb-0"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <span className="text-sm font-medium text-primary">
                          {(u.first_name?.[0] || u.email[0] || "?").toUpperCase()}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium truncate">
                            {displayName || u.email}
                          </p>
                          {isCurrentUser && (
                            <Badge variant="outline" className="text-xs shrink-0">
                              You
                            </Badge>
                          )}
                        </div>
                        {displayName && (
                          <p className="text-xs text-foreground/50 truncate">
                            {u.email}
                          </p>
                        )}
                        <p className="text-xs text-foreground/40">
                          Joined {formatDate(u.created_at)}
                          {u.last_sign_in_at &&
                            ` · Last sign in ${formatDate(u.last_sign_in_at)}`}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <Select
                        value={u.role}
                        onValueChange={(v) =>
                          handleRoleChange(u.id, v as "admin" | "marketer" | "user")
                        }
                        disabled={isCurrentUser}
                      >
                        <SelectTrigger className="w-[130px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admin">
                            <div className="flex items-center gap-2">
                              <ShieldCheck className="w-3.5 h-3.5" />
                              Admin
                            </div>
                          </SelectItem>
                          <SelectItem value="user">
                            <div className="flex items-center gap-2">
                              <Shield className="w-3.5 h-3.5" />
                              User
                            </div>
                          </SelectItem>
                          <SelectItem value="marketer">
                            <div className="flex items-center gap-2">
                              <Shield className="w-3.5 h-3.5" />
                              Marketer
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>

                      {deleteConfirmId === u.id ? (
                        <div className="flex items-center gap-2">
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(u.id)}
                            disabled={deleteLoading}
                          >
                            {deleteLoading ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              "Confirm"
                            )}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setDeleteConfirmId(null)}
                            disabled={deleteLoading}
                          >
                            Cancel
                          </Button>
                        </div>
                      ) : (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeleteConfirmId(u.id)}
                          disabled={isCurrentUser}
                          title={
                            isCurrentUser
                              ? "You can't remove yourself"
                              : "Remove user"
                          }
                        >
                          <Trash2 className="w-4 h-4 text-foreground/40 hover:text-destructive" />
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </AdminLayout>
  );
};

export default AdminUsers;
