import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { createHash } from "node:crypto";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

type Role = "admin" | "marketer";

export type AdminAuthResult =
  | { ok: true; userId: string; role: Role }
  | { ok: false; status: number; error: string };

let cachedServiceClient: SupabaseClient | null = null;

function getServiceClient(): SupabaseClient | null {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) return null;
  if (!cachedServiceClient) {
    cachedServiceClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: { persistSession: false },
    });
  }
  return cachedServiceClient;
}

/**
 * Validate an incoming Authorization header as a real, active admin/marketer.
 *
 * - JWT is validated by the Supabase auth server via the anon client (accepts
 *   the project's current signing algorithm, including ES256).
 * - Role lookup uses the service role client so it bypasses RLS — a misconfigured
 *   SELECT policy on user_roles can't silently downgrade to "no role". The only
 *   source of truth is the actual row in the table.
 */
export async function requireAdminSession(authHeader: string | null): Promise<AdminAuthResult> {
  if (!authHeader) {
    return { ok: false, status: 401, error: "Missing authorization header" };
  }
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    return { ok: false, status: 500, error: "Supabase not configured" };
  }

  // 1. Validate the JWT via the auth server (not RLS-dependent).
  const authClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { persistSession: false },
    global: { headers: { Authorization: authHeader } },
  });
  const { data: userData, error: userError } = await authClient.auth.getUser();
  if (userError || !userData?.user) {
    return { ok: false, status: 401, error: "Invalid session" };
  }

  // 2. Look up the role. Prefer the service role client so RLS cannot silently
  //    downgrade the result (a misconfigured SELECT policy would return no
  //    row, which would look like "not an admin"). If the service role key is
  //    not configured, fall back to the user's own RLS-restricted client —
  //    user_roles has a "Users can view own role" policy that returns their
  //    row, so the check still works, just with less defence in depth.
  const serviceClient = getServiceClient();
  const roleClient = serviceClient
    ? serviceClient
    : createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
        auth: { persistSession: false },
        global: { headers: { Authorization: authHeader } },
      });

  const { data: roleRow, error: roleError } = await roleClient
    .from("user_roles")
    .select("role")
    .eq("user_id", userData.user.id)
    .maybeSingle();

  if (roleError) {
    console.error("requireAdminSession: role lookup failed", roleError);
    return { ok: false, status: 500, error: "Role check failed" };
  }

  const role = roleRow?.role as Role | undefined;
  if (role !== "admin" && role !== "marketer") {
    return { ok: false, status: 403, error: "Forbidden" };
  }

  return { ok: true, userId: userData.user.id, role };
}

/**
 * Per-endpoint rate limit, shared with the Supabase edge functions via the
 * `enforce_rate_limit` RPC. Keyed by the authenticated user id so abuse from
 * a single compromised account is capped.
 */
export async function enforceAdminRateLimit({
  userId,
  endpoint,
  limit,
  windowSeconds,
}: {
  userId: string;
  endpoint: string;
  limit: number;
  windowSeconds: number;
}): Promise<{ allowed: boolean; remaining: number; resetAt: string } | null> {
  const client = getServiceClient();
  if (!client) return null;

  // Hash the user id with a salt so the rate-limit key isn't trivially guessable.
  const salt = process.env.RATE_LIMIT_SALT ?? "cdc-admin-rate-limit";
  const clientHash = createHash("sha256").update(`${salt}|${userId}`).digest("hex");

  const { data, error } = await client
    .rpc("enforce_rate_limit", {
      p_endpoint: endpoint,
      p_client_hash: clientHash,
      p_limit: limit,
      p_window_seconds: windowSeconds,
    })
    .single();

  if (error || !data) {
    console.error("enforceAdminRateLimit: RPC failed", error);
    return null;
  }

  const typed = data as { allowed?: boolean; remaining?: number; reset_at?: string };
  return {
    allowed: !!typed.allowed,
    remaining: Number(typed.remaining ?? 0),
    resetAt: String(typed.reset_at),
  };
}
