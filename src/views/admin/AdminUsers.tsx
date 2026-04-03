import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { useAdminPageAccess } from "@/hooks/useAdminPageAccess";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import SEO from "@/components/SEO";
import { toast } from "sonner";
import {
  Loader2,
  Users,
  UserPlus,
  Shield,
  ShieldCheck,
  Trash2,
  RefreshCw,
} from "lucide-react";

interface UserRecord {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  role: "admin" | "user";
  created_at: string;
  last_sign_in_at: string | null;
}

const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL ||
  "https://iqugsxeejieneyksfbza.supabase.co";

async function fetchWithAuth(method: string, body?: unknown) {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session?.access_token) throw new Error("Not authenticated");

  const options: RequestInit = {
    method,
    headers: {
      Authorization: `Bearer ${session.access_token}`,
      "Content-Type": "application/json",
      apikey: session.access_token,
    },
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const res = await fetch(`${SUPABASE_URL}/functions/v1/manage-users`, options);
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || `Request failed (${res.status})`);
  }

  return data;
}

const AdminUsers = () => {
  const { user, isAuthorized, isCheckingAccess } = useAdminPageAccess({
    showForbiddenToast: false,
  });

  const [users, setUsers] = useState<UserRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteFirstName, setInviteFirstName] = useState("");
  const [inviteLastName, setInviteLastName] = useState("");
  const [inviteRole, setInviteRole] = useState<"admin" | "user">("user");
  const [inviteLoading, setInviteLoading] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchWithAuth("GET");
      setUsers(data.users ?? []);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to load users";
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

  const handleInvite = async () => {
    if (!inviteEmail.trim()) {
      toast.error("Please enter an email address");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(inviteEmail.trim())) {
      toast.error("Please enter a valid email address");
      return;
    }

    setInviteLoading(true);
    try {
      await fetchWithAuth("POST", {
        email: inviteEmail.trim().toLowerCase(),
        role: inviteRole,
        first_name: inviteFirstName.trim() || undefined,
        last_name: inviteLastName.trim() || undefined,
      });

      toast.success(`Invitation sent to ${inviteEmail.trim()}`);
      setInviteEmail("");
      setInviteFirstName("");
      setInviteLastName("");
      setInviteRole("user");
      setInviteOpen(false);
      loadUsers();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to invite user";
      toast.error(msg);
    } finally {
      setInviteLoading(false);
    }
  };

  const handleRoleChange = async (userId: string, newRole: "admin" | "user") => {
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
          <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
            <DialogTrigger asChild>
              <Button>
                <UserPlus className="w-4 h-4 mr-2" />
                Invite User
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Invite a New User</DialogTitle>
                <DialogDescription>
                  Send an email invitation. They'll receive a link to set their
                  password and access the admin dashboard.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="invite-email">Email Address *</Label>
                  <Input
                    id="invite-email"
                    type="email"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="team@example.com"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="invite-first">First Name</Label>
                    <Input
                      id="invite-first"
                      value={inviteFirstName}
                      onChange={(e) => setInviteFirstName(e.target.value)}
                      placeholder="First name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="invite-last">Last Name</Label>
                    <Input
                      id="invite-last"
                      value={inviteLastName}
                      onChange={(e) => setInviteLastName(e.target.value)}
                      placeholder="Last name"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="invite-role">Role</Label>
                  <Select
                    value={inviteRole}
                    onValueChange={(v) => setInviteRole(v as "admin" | "user")}
                  >
                    <SelectTrigger id="invite-role">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">
                        <div className="flex items-center gap-2">
                          <ShieldCheck className="w-4 h-4" />
                          Admin — Full access to dashboard
                        </div>
                      </SelectItem>
                      <SelectItem value="user">
                        <div className="flex items-center gap-2">
                          <Shield className="w-4 h-4" />
                          User — Limited access
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setInviteOpen(false)}
                  disabled={inviteLoading}
                >
                  Cancel
                </Button>
                <Button onClick={handleInvite} disabled={inviteLoading}>
                  {inviteLoading && (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  )}
                  Send Invitation
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
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
              <Shield className="w-8 h-8 text-foreground/40" />
              <div>
                <p className="text-2xl font-bold">{users.length - adminCount}</p>
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
            Admins have full access to the dashboard including projects, enquiries,
            gallery, and settings.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
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
                          handleRoleChange(u.id, v as "admin" | "user")
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
