import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { createClient } from "@supabase/supabase-js";

// Admin-only endpoint that rebuilds specific public pages on demand. Called
// from admin views (blog, projects, gallery, etc.) immediately after a save
// so changes appear on the site within seconds instead of waiting for ISR.

export const dynamic = "force-dynamic";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

// Whitelist of paths an admin is allowed to revalidate. We accept bare paths
// as well as templated paths for dynamic routes (e.g. `/blog/[slug]`).
const ALLOWED_PATH_PATTERNS = [
  /^\/$/,
  /^\/blog$/,
  /^\/blog\/[a-z0-9-]+$/,
  /^\/renovation-projects$/,
  /^\/renovation-projects\/[a-z0-9-]+$/,
  /^\/renovation-gallery$/,
  /^\/gallery$/,
  /^\/renovation-services$/,
  /^\/testimonials$/,
  /^\/about-us$/,
  /^\/why-cdc$/,
];

function isPathAllowed(path: string): boolean {
  return ALLOWED_PATH_PATTERNS.some((pattern) => pattern.test(path));
}

async function requireAdmin(authHeader: string | null): Promise<{ ok: true } | { ok: false; status: number; error: string }> {
  if (!authHeader) {
    return { ok: false, status: 401, error: "Missing authorization header" };
  }
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    return { ok: false, status: 500, error: "Supabase not configured" };
  }

  // Use the caller's JWT to validate their identity AND check their role via
  // the existing user_roles RLS policies (admins + marketers can see their
  // own row; anything else returns no match).
  const client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    global: { headers: { Authorization: authHeader } },
  });

  const { data: userData, error: userError } = await client.auth.getUser();
  if (userError || !userData?.user) {
    return { ok: false, status: 401, error: "Invalid session" };
  }

  const { data: roleRow, error: roleError } = await client
    .from("user_roles")
    .select("role")
    .eq("user_id", userData.user.id)
    .maybeSingle();

  if (roleError) {
    return { ok: false, status: 403, error: "Role check failed" };
  }

  const role = roleRow?.role;
  if (role !== "admin" && role !== "marketer") {
    return { ok: false, status: 403, error: "Forbidden" };
  }

  return { ok: true };
}

export async function POST(req: Request) {
  const auth = await requireAdmin(req.headers.get("authorization"));
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  let body: { paths?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!Array.isArray(body.paths) || body.paths.length === 0) {
    return NextResponse.json({ error: "paths array required" }, { status: 400 });
  }

  const requested = body.paths.filter((p): p is string => typeof p === "string");
  const revalidated: string[] = [];
  const rejected: string[] = [];

  for (const path of requested) {
    if (!isPathAllowed(path)) {
      rejected.push(path);
      continue;
    }
    try {
      revalidatePath(path);
      revalidated.push(path);
    } catch (err) {
      console.error("revalidatePath failed for", path, err);
      rejected.push(path);
    }
  }

  return NextResponse.json({ revalidated, rejected });
}
