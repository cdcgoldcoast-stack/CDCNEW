import { supabase } from "@/integrations/supabase/client";

/**
 * Call the admin revalidation endpoint to rebuild specific public pages on demand.
 * Used from admin save handlers so site changes appear within seconds instead of
 * waiting for ISR to expire.
 *
 * Failures are logged but never thrown — revalidation is a best-effort
 * convenience on top of the ISR safety net, not a hard requirement.
 */
export async function revalidateAdminPaths(paths: string[]): Promise<void> {
  if (paths.length === 0) return;

  try {
    const { data: sessionData } = await supabase.auth.getSession();
    const token = sessionData.session?.access_token;
    if (!token) {
      console.warn("revalidateAdminPaths: no auth session, skipping");
      return;
    }

    const res = await fetch("/admin/api/revalidate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ paths }),
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      console.warn("revalidateAdminPaths failed:", res.status, body);
    }
  } catch (err) {
    console.warn("revalidateAdminPaths error:", err);
  }
}
