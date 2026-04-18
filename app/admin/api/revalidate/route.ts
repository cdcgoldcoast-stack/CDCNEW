import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { enforceAdminRateLimit, requireAdminSession } from "@/lib/adminAuth";

// Admin-only endpoint that rebuilds specific public pages on demand. Called
// from admin views (blog, projects, gallery, etc.) immediately after a save
// so changes appear on the site within seconds instead of waiting for ISR.

export const dynamic = "force-dynamic";

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

export async function POST(req: Request) {
  const auth = await requireAdminSession(req.headers.get("authorization"));
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  // Rate limit per authenticated user so a compromised admin session can't
  // spam revalidations in a loop. 60 per minute is generous for legitimate
  // admin save flows (each save triggers 1-2 revalidations).
  const rate = await enforceAdminRateLimit({
    userId: auth.userId,
    endpoint: "admin-revalidate",
    limit: 60,
    windowSeconds: 60,
  });
  if (rate && !rate.allowed) {
    return NextResponse.json(
      { error: "Too many revalidations. Please wait and try again.", resetAt: rate.resetAt },
      { status: 429, headers: { "Retry-After": "60" } }
    );
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
