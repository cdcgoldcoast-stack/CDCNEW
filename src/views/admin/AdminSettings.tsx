import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { useAdminPageAccess } from "@/hooks/useAdminPageAccess";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import SEO from "@/components/SEO";
import { toast } from "sonner";
import { Loader2, Mail, Lock, User, Shield, Bell, Plus, X, Star } from "lucide-react";

const AdminSettings = () => {
  const { user, isAuthorized, isCheckingAccess } = useAdminPageAccess({ showForbiddenToast: false });

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileLoaded, setProfileLoaded] = useState(false);

  const [newEmail, setNewEmail] = useState("");
  const [emailLoading, setEmailLoading] = useState(false);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Notification settings
  const [notifEmails, setNotifEmails] = useState<string[]>([]);
  const [notifFromEmail, setNotifFromEmail] = useState("hello@cdconstruct.com.au");
  const [notifFromName, setNotifFromName] = useState("Concept Design Construct");
  const [notifEmailInput, setNotifEmailInput] = useState("");
  const [notifLoading, setNotifLoading] = useState(false);
  const [notifSettingsId, setNotifSettingsId] = useState<string | null>(null);

  // Public review stats (shown site-wide on Google Review badge)
  const [reviewRating, setReviewRating] = useState("4.9");
  const [reviewCount, setReviewCount] = useState("50");
  const [reviewStatsLoading, setReviewStatsLoading] = useState(false);

  // Load profile on first render
  useEffect(() => {
    if (user && !profileLoaded) {
      supabase
        .from("profiles")
        .select("first_name, last_name")
        .eq("user_id", user.id)
        .maybeSingle()
        .then(({ data }) => {
          if (data) {
            setFirstName(data.first_name || "");
            setLastName(data.last_name || "");
          }
          setProfileLoaded(true);
        });
    }
  }, [user, profileLoaded]);

  // Load notification settings once
  useEffect(() => {
    if (!isAuthorized) return;
    supabase
      .from("notification_settings")
      .select("id, from_email, from_name, notification_emails, review_rating, review_count")
      .limit(1)
      .maybeSingle()
      .then(({ data, error }) => {
        if (error) {
          console.error("Failed to load notification settings:", error.message);
          return;
        }
        if (data) {
          setNotifSettingsId(data.id);
          setNotifFromEmail(data.from_email || "hello@cdconstruct.com.au");
          setNotifFromName(data.from_name || "Concept Design Construct");
          setNotifEmails(Array.isArray(data.notification_emails) ? data.notification_emails : []);
          if (data.review_rating) setReviewRating(data.review_rating);
          if (data.review_count) setReviewCount(data.review_count);
        }
      });
  }, [isAuthorized]);

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

  const handleUpdateProfile = async () => {
    if (!user) return;
    setProfileLoading(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ first_name: firstName.trim(), last_name: lastName.trim() })
        .eq("user_id", user.id);

      if (error) throw error;
      toast.success("Profile updated successfully");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to update profile";
      toast.error(message);
    } finally {
      setProfileLoading(false);
    }
  };

  const handleUpdateEmail = async () => {
    if (!newEmail.trim()) {
      toast.error("Please enter a new email address");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newEmail.trim())) {
      toast.error("Please enter a valid email address");
      return;
    }

    setEmailLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        email: newEmail.trim(),
      });

      if (error) throw error;
      toast.success("Confirmation email sent to your new address. Please check both inboxes.");
      setNewEmail("");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to update email";
      toast.error(message);
    } finally {
      setEmailLoading(false);
    }
  };

  const handleUpdatePassword = async () => {
    if (!newPassword) {
      toast.error("Please enter a new password");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setPasswordLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;
      toast.success("Password updated successfully");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to update password";
      // Provide clearer error messages for common cases
      if (msg.includes("same_password") || msg.includes("should be different")) {
        toast.error("New password must be different from your current password");
      } else {
        toast.error(msg);
      }
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleAddNotifEmail = () => {
    const trimmed = notifEmailInput.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmed)) {
      toast.error("Please enter a valid email address");
      return;
    }
    if (notifEmails.includes(trimmed)) {
      toast.error("That email is already in the list");
      return;
    }
    setNotifEmails((prev) => [...prev, trimmed]);
    setNotifEmailInput("");
  };

  const handleSaveNotifSettings = async () => {
    if (!notifFromEmail.trim()) {
      toast.error("Please enter a from email address");
      return;
    }

    // Auto-add any email still sitting in the input field
    const emailsToSave = [...notifEmails];
    const pending = notifEmailInput.trim().toLowerCase();
    if (pending) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(pending)) {
        toast.error("Please enter a valid email address or clear the input");
        return;
      }
      if (!emailsToSave.includes(pending)) {
        emailsToSave.push(pending);
        setNotifEmails(emailsToSave);
      }
      setNotifEmailInput("");
    }

    setNotifLoading(true);
    try {
      const payload = {
        from_email: notifFromEmail.trim(),
        from_name: notifFromName.trim() || "Concept Design Construct",
        notification_emails: emailsToSave,
        updated_at: new Date().toISOString(),
      };

      if (notifSettingsId) {
        const { data, error } = await supabase
          .from("notification_settings")
          .update(payload)
          .eq("id", notifSettingsId)
          .select("id")
          .single();
        if (error) throw error;
        if (!data) throw new Error("Update matched no rows — settings may have been deleted");
      } else {
        const { data, error } = await supabase
          .from("notification_settings")
          .insert(payload)
          .select("id")
          .single();
        if (error) throw error;
        setNotifSettingsId(data.id);
      }

      toast.success("Notification settings saved");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to save settings";
      toast.error(msg);
    } finally {
      setNotifLoading(false);
    }
  };

  const handleSaveReviewStats = async () => {
    const rating = reviewRating.trim();
    const count = reviewCount.trim();

    // Basic validation — rating is a number between 0 and 5, count is a positive integer
    const ratingNum = Number(rating);
    if (Number.isNaN(ratingNum) || ratingNum < 0 || ratingNum > 5) {
      toast.error("Rating must be between 0 and 5");
      return;
    }
    if (!/^\d+$/.test(count) || Number(count) < 0) {
      toast.error("Review count must be a positive whole number");
      return;
    }

    setReviewStatsLoading(true);
    try {
      const payload = {
        review_rating: rating,
        review_count: count,
        updated_at: new Date().toISOString(),
      };

      if (notifSettingsId) {
        const { error } = await supabase
          .from("notification_settings")
          .update(payload)
          .eq("id", notifSettingsId);
        if (error) throw error;
      } else {
        const { data, error } = await supabase
          .from("notification_settings")
          .insert(payload)
          .select("id")
          .single();
        if (error) throw error;
        setNotifSettingsId(data.id);
      }

      toast.success("Review stats updated");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to save review stats";
      toast.error(msg);
    } finally {
      setReviewStatsLoading(false);
    }
  };

  return (
    <AdminLayout>
      <SEO title="Admin - Account Settings" noIndex={true} />
      <div className="space-y-2 mb-8">
        <h1 className="text-3xl font-serif italic text-foreground">Account Settings</h1>
        <p className="text-foreground/60">Manage your profile, email, and password</p>
      </div>

      <div className="space-y-6 max-w-2xl">
        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-primary" />
              <CardTitle className="text-lg">Email Notifications</CardTitle>
            </div>
            <CardDescription>
              Configure who gets notified when an enquiry, chat inquiry, or referral comes in — and what address emails send from
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="notifFromName">From Name</Label>
                <Input
                  id="notifFromName"
                  value={notifFromName}
                  onChange={(e) => setNotifFromName(e.target.value)}
                  placeholder="Concept Design Construct"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="notifFromEmail">From Email</Label>
                <Input
                  id="notifFromEmail"
                  type="email"
                  value={notifFromEmail}
                  onChange={(e) => setNotifFromEmail(e.target.value)}
                  placeholder="hello@cdconstruct.com.au"
                />
              </div>
            </div>
            <p className="text-xs text-foreground/50">
              The "From" domain must be verified in your Resend account. Visit resend.com/domains to add cdconstruct.com.au.
            </p>

            <Separator />

            <div className="space-y-2">
              <Label>Team Notification Emails</Label>
              <p className="text-xs text-foreground/50">These addresses receive an email every time a new enquiry, chat inquiry, or referral is submitted.</p>
              <div className="flex gap-2">
                <Input
                  type="email"
                  value={notifEmailInput}
                  onChange={(e) => setNotifEmailInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleAddNotifEmail(); } }}
                  placeholder="team@example.com"
                />
                <Button variant="outline" size="icon" onClick={handleAddNotifEmail}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              {notifEmails.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {notifEmails.map((em) => (
                    <div key={em} className="flex items-center gap-1.5 bg-muted rounded-md px-3 py-1.5 text-sm">
                      <span>{em}</span>
                      <button
                        onClick={() => setNotifEmails((prev) => prev.filter((e) => e !== em))}
                        className="text-foreground/40 hover:text-foreground transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {notifEmails.length === 0 && (
                <p className="text-xs text-foreground/40 italic">No notification emails yet — add one above.</p>
              )}
            </div>

            <Button onClick={handleSaveNotifSettings} disabled={notifLoading}>
              {notifLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Save Notification Settings
            </Button>
          </CardContent>
        </Card>

        <Separator />

        {/* Public Review Stats */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-primary" />
              <CardTitle className="text-lg">Google Review Badge</CardTitle>
            </div>
            <CardDescription>
              Shown on the site wherever the Google Reviews badge appears. Update as reviews grow.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="reviewRating">Rating (0–5)</Label>
                <Input
                  id="reviewRating"
                  type="text"
                  inputMode="decimal"
                  placeholder="4.9"
                  value={reviewRating}
                  onChange={(e) => setReviewRating(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reviewCount">Review count</Label>
                <Input
                  id="reviewCount"
                  type="text"
                  inputMode="numeric"
                  placeholder="50"
                  value={reviewCount}
                  onChange={(e) => setReviewCount(e.target.value)}
                />
              </div>
            </div>
            <Button onClick={handleSaveReviewStats} disabled={reviewStatsLoading}>
              {reviewStatsLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Save Review Stats
            </Button>
          </CardContent>
        </Card>

        <Separator />

        {/* Current Account Info */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              <CardTitle className="text-lg">Account Info</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-foreground/60">Email</span>
                <span className="font-medium">{user.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-foreground/60">Role</span>
                <span className="font-medium text-primary">Admin</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Details */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              <CardTitle className="text-lg">Profile Details</CardTitle>
            </div>
            <CardDescription>Update your name and display information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="First name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Last name"
                />
              </div>
            </div>
            <Button onClick={handleUpdateProfile} disabled={profileLoading}>
              {profileLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Save Profile
            </Button>
          </CardContent>
        </Card>

        <Separator />

        {/* Change Email */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-primary" />
              <CardTitle className="text-lg">Change Email</CardTitle>
            </div>
            <CardDescription>
              A confirmation link will be sent to both your current and new email address
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="newEmail">New Email Address</Label>
              <Input
                id="newEmail"
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="new@example.com"
              />
            </div>
            <Button onClick={handleUpdateEmail} disabled={emailLoading}>
              {emailLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Update Email
            </Button>
          </CardContent>
        </Card>

        <Separator />

        {/* Change Password */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Lock className="w-5 h-5 text-primary" />
              <CardTitle className="text-lg">Change Password</CardTitle>
            </div>
            <CardDescription>
              Choose a strong password with at least 6 characters
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>
            <Button onClick={handleUpdatePassword} disabled={passwordLoading}>
              {passwordLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Update Password
            </Button>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;
