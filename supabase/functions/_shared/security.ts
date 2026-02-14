import { createClient, type User } from "https://esm.sh/@supabase/supabase-js@2";

const DEFAULT_ALLOWED_ORIGINS = [
  "https://cdcnew-eight.vercel.app",
  "https://cdconstruct.com.au",
  "https://www.cdconstruct.com.au",
  "https://cdcconstruct.com.au",
  "https://www.cdcconstruct.com.au",
  "https://conceptdesignconstruct.com.au",
  "https://www.conceptdesignconstruct.com.au",
  "http://localhost:8080",
  "http://localhost:8081",
  "http://localhost:5173",
  "http://127.0.0.1:8080",
  "http://127.0.0.1:8081",
  "http://127.0.0.1:5173",
];

const DEFAULT_IMAGE_PROXY_ALLOWED_HOSTS = [
  "cdn.pixabay.com",
  "pixabay.com",
  "pexels.com",
  "images.pexels.com",
  "unsplash.com",
  "images.unsplash.com",
  "upload.wikimedia.org",
  "openverse.org",
  "creativecommons.org",
  "flickr.com",
  "staticflickr.com",
];

function splitCsv(value: string | undefined): string[] {
  if (!value) return [];
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function getAllowedOrigins(): string[] {
  const configured = splitCsv(Deno.env.get("ALLOWED_ORIGINS"));
  if (configured.length > 0) return configured;
  return DEFAULT_ALLOWED_ORIGINS;
}

export function getOrigin(req: Request): string | null {
  return req.headers.get("origin");
}

function normalizeOrigin(value: string): string {
  return value.trim().replace(/\/$/, "").toLowerCase();
}

export function isAllowedOrigin(req: Request): boolean {
  const origin = getOrigin(req);
  if (!origin) return true;

  const normalized = normalizeOrigin(origin);
  const allowed = getAllowedOrigins().map(normalizeOrigin);
  return allowed.includes(normalized);
}

export function buildCorsHeaders(req: Request): Record<string, string> {
  const origin = getOrigin(req);
  const allowOrigin = origin && isAllowedOrigin(req)
    ? origin
    : getAllowedOrigins()[0] ?? "*";

  return {
    "Access-Control-Allow-Origin": allowOrigin,
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-forwarded-for, x-real-ip",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  };
}

export function rejectDisallowedOrigin(req: Request): Response | null {
  if (isAllowedOrigin(req)) return null;
  return jsonResponse(req, 403, { error: "Origin not allowed" });
}

export function jsonResponse(
  req: Request,
  status: number,
  payload: unknown,
  headers: Record<string, string> = {},
): Response {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      ...buildCorsHeaders(req),
      "Content-Type": "application/json",
      ...headers,
    },
  });
}

type SupabaseClient = ReturnType<typeof createClient>;

export interface AuthenticatedRequestContext {
  user: User;
  authHeader: string;
  authClient: SupabaseClient;
}

export function requireMethod(req: Request, allowedMethods: string[]): Response | null {
  if (allowedMethods.includes(req.method)) {
    return null;
  }

  return jsonResponse(
    req,
    405,
    { error: "Method not allowed" },
    { Allow: allowedMethods.join(", ") },
  );
}

export async function requireJsonBody<T>(
  req: Request,
  maxBytes: number = 1_000_000,
): Promise<{ data: T } | { response: Response }> {
  const contentType = (req.headers.get("content-type") ?? "").toLowerCase();
  if (!contentType.includes("application/json")) {
    return { response: jsonResponse(req, 415, { error: "Content-Type must be application/json" }) };
  }

  const contentLength = Number(req.headers.get("content-length") ?? "0");
  if (contentLength > maxBytes) {
    return { response: jsonResponse(req, 413, { error: "Request payload is too large" }) };
  }

  try {
    const data = await req.json() as T;
    return { data };
  } catch {
    return { response: jsonResponse(req, 400, { error: "Invalid JSON payload" }) };
  }
}

function getAuthorizationHeader(req: Request): string | null {
  const authHeader = req.headers.get("authorization") ?? req.headers.get("Authorization");
  return authHeader?.trim() || null;
}

function createAuthClient(authHeader: string): SupabaseClient | null {
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY");
  if (!supabaseUrl || !supabaseAnonKey) {
    return null;
  }

  return createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: {
        Authorization: authHeader,
      },
    },
  });
}

export async function requireAuthenticatedUser(
  req: Request,
): Promise<{ context: AuthenticatedRequestContext } | { response: Response }> {
  const authHeader = getAuthorizationHeader(req);
  if (!authHeader) {
    return { response: jsonResponse(req, 401, { error: "Unauthorized" }) };
  }

  const authClient = createAuthClient(authHeader);
  if (!authClient) {
    console.error("Missing Supabase auth configuration for edge function auth checks");
    return { response: jsonResponse(req, 500, { error: "Authentication is not configured" }) };
  }

  const { data, error } = await authClient.auth.getUser();
  if (error || !data?.user) {
    if (error) {
      console.error("Auth validation error:", error.message);
    }
    return { response: jsonResponse(req, 401, { error: "Unauthorized" }) };
  }

  return {
    context: {
      user: data.user,
      authHeader,
      authClient,
    },
  };
}

export async function requireAdminUser(
  req: Request,
): Promise<{ context: AuthenticatedRequestContext } | { response: Response }> {
  const authResult = await requireAuthenticatedUser(req);
  if ("response" in authResult) {
    return authResult;
  }

  const { authClient, user } = authResult.context;
  const { data, error } = await authClient
    .from("user_roles")
    .select("role")
    .eq("user_id", user.id)
    .eq("role", "admin")
    .maybeSingle();

  if (error) {
    console.error("Admin role check failed:", error.message);
    return { response: jsonResponse(req, 403, { error: "Forbidden" }) };
  }

  if (!data) {
    return { response: jsonResponse(req, 403, { error: "Forbidden" }) };
  }

  return authResult;
}

export function getClientIP(req: Request): string {
  const forwardedFor = req.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }

  const realIP = req.headers.get("x-real-ip");
  if (realIP) return realIP;

  const cfIP = req.headers.get("cf-connecting-ip");
  if (cfIP) return cfIP;

  return "unknown";
}

async function sha256Hex(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function getClientHash(req: Request): Promise<string> {
  const salt = Deno.env.get("RATE_LIMIT_SALT") ?? "cdc-edge-rate-limit-salt";
  const ip = getClientIP(req);
  const ua = (req.headers.get("user-agent") ?? "unknown").slice(0, 160);
  return sha256Hex(`${salt}|${ip}|${ua}`);
}

const AUTOMATION_USER_AGENT_PATTERN =
  /\b(bot|crawler|spider|scrapy|curl|wget|python-requests|python-urllib|aiohttp|httpclient|go-http-client|postmanruntime|insomnia|libwww-perl|headlesschrome|phantomjs|selenium|puppeteer|playwright)\b/i;
const BROWSER_USER_AGENT_PATTERN = /\b(chrome|safari|firefox|edg|opr|opera|mobile)\b/i;

export interface SuspiciousTrafficAssessment {
  isSuspicious: boolean;
  score: number;
  reasons: string[];
}

export function assessSuspiciousTraffic(req: Request): SuspiciousTrafficAssessment {
  const reasons: string[] = [];
  let score = 0;

  const userAgent = (req.headers.get("user-agent") ?? "").trim();
  const secChUa = req.headers.get("sec-ch-ua") ?? "";
  const secFetchSite = req.headers.get("sec-fetch-site") ?? "";
  const origin = req.headers.get("origin") ?? "";
  const referer = req.headers.get("referer") ?? "";

  const hasBrowserContext = Boolean(origin || referer || secChUa || secFetchSite);

  if (!userAgent) {
    score += 3;
    reasons.push("missing_user_agent");
  } else {
    if (AUTOMATION_USER_AGENT_PATTERN.test(userAgent)) {
      score += 4;
      reasons.push("automation_user_agent");
    }

    if (/headlesschrome|phantomjs/i.test(secChUa)) {
      score += 4;
      reasons.push("headless_client_hint");
    }

    if (!BROWSER_USER_AGENT_PATTERN.test(userAgent) && !hasBrowserContext) {
      score += 2;
      reasons.push("non_browser_signature");
    }
  }

  if (!hasBrowserContext) {
    score += 1;
    reasons.push("missing_browser_headers");
  }

  return {
    isSuspicious: score >= 4,
    score,
    reasons,
  };
}

export function createServiceClient() {
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error("Supabase service configuration missing");
  }

  return createClient(supabaseUrl, supabaseServiceKey);
}

interface RateLimitInput {
  req: Request;
  endpoint: string;
  limit: number;
  windowSeconds: number;
  clientHash?: string;
}

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: string;
}

export async function enforceRateLimit({
  req,
  endpoint,
  limit,
  windowSeconds,
  clientHash,
}: RateLimitInput): Promise<RateLimitResult> {
  const supabase = createServiceClient();
  const resolvedHash = clientHash ?? await getClientHash(req);

  const { data, error } = await supabase
    .rpc("enforce_rate_limit", {
      p_endpoint: endpoint,
      p_client_hash: resolvedHash,
      p_limit: limit,
      p_window_seconds: windowSeconds,
    })
    .single();

  if (error || !data) {
    console.error("Rate limit RPC error:", error);
    throw new Error("Rate limit check failed");
  }

  const typedData = data as { allowed?: boolean; remaining?: number; reset_at?: string };
  return {
    allowed: !!typedData.allowed,
    remaining: Number(typedData.remaining ?? 0),
    resetAt: String(typedData.reset_at),
  };
}

function isIpv4(value: string): boolean {
  return /^\d{1,3}(\.\d{1,3}){3}$/.test(value);
}

function isPrivateIpv4(host: string): boolean {
  const parts = host.split(".").map((part) => Number(part));
  if (parts.length !== 4 || parts.some((part) => Number.isNaN(part) || part < 0 || part > 255)) {
    return false;
  }

  if (parts[0] === 10) return true;
  if (parts[0] === 127) return true;
  if (parts[0] === 0) return true;
  if (parts[0] === 169 && parts[1] === 254) return true;
  if (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) return true;
  if (parts[0] === 192 && parts[1] === 168) return true;
  return false;
}

export function isPrivateHostname(hostname: string): boolean {
  const lower = hostname.toLowerCase();

  if (lower === "localhost" || lower.endsWith(".localhost") || lower === "0.0.0.0") {
    return true;
  }

  if (isIpv4(lower)) {
    return isPrivateIpv4(lower);
  }

  if (lower.includes(":")) {
    // Basic IPv6 loopback / local checks
    return lower === "::1" || lower.startsWith("fc") || lower.startsWith("fd") || lower.startsWith("fe80:");
  }

  return false;
}

export function getAllowedImageHosts(): string[] {
  const configured = splitCsv(Deno.env.get("IMAGE_PROXY_ALLOWED_HOSTS"));
  const hosts = configured.length > 0 ? configured : DEFAULT_IMAGE_PROXY_ALLOWED_HOSTS;

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  if (supabaseUrl) {
    try {
      hosts.push(new URL(supabaseUrl).hostname);
    } catch {
      // Ignore malformed env
    }
  }

  return Array.from(new Set(hosts.map((host) => host.toLowerCase())));
}

export function isAllowedImageHost(hostname: string): boolean {
  const lower = hostname.toLowerCase();
  if (isPrivateHostname(lower)) return false;

  const allowedHosts = getAllowedImageHosts();
  return allowedHosts.some((allowed) => lower === allowed || lower.endsWith(`.${allowed}`));
}
