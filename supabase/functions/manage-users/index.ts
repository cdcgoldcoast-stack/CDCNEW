import {
  buildCorsHeaders,
  rejectDisallowedOrigin,
  requireAdminUser,
  requireMethod,
  requireJsonBody,
  jsonResponse,
  createServiceClient,
} from "../_shared/security.ts";

Deno.serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: buildCorsHeaders(req) });
  }

  // Origin check
  const originBlock = rejectDisallowedOrigin(req);
  if (originBlock) return originBlock;

  // Require admin
  const authResult = await requireAdminUser(req);
  if ("response" in authResult) return authResult.response;

  const supabase = createServiceClient();

  // GET — list all users with roles and profiles
  if (req.method === "GET") {
    const methodBlock = requireMethod(req, ["GET"]);
    if (methodBlock) return methodBlock;

    try {
      // List all auth users
      const { data: authData, error: authError } = await supabase.auth.admin.listUsers({
        perPage: 500,
      });

      if (authError) {
        console.error("Failed to list users:", authError.message);
        return jsonResponse(req, 500, { error: "Failed to list users" });
      }

      const users = authData.users;

      // Get all roles
      const { data: roles, error: rolesError } = await supabase
        .from("user_roles")
        .select("user_id, role");

      if (rolesError) {
        console.error("Failed to fetch roles:", rolesError.message);
        return jsonResponse(req, 500, { error: "Failed to fetch roles" });
      }

      // Get all profiles
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("user_id, first_name, last_name");

      if (profilesError) {
        console.error("Failed to fetch profiles:", profilesError.message);
        return jsonResponse(req, 500, { error: "Failed to fetch profiles" });
      }

      const roleMap = new Map(roles?.map((r: { user_id: string; role: string }) => [r.user_id, r.role]) ?? []);
      const profileMap = new Map(profiles?.map((p: { user_id: string; first_name: string | null; last_name: string | null }) => [p.user_id, p]) ?? []);

      const result = users.map((u) => {
        const profile = profileMap.get(u.id) as { first_name: string | null; last_name: string | null } | undefined;
        return {
          id: u.id,
          email: u.email,
          first_name: profile?.first_name ?? null,
          last_name: profile?.last_name ?? null,
          role: roleMap.get(u.id) ?? "user",
          created_at: u.created_at,
          last_sign_in_at: u.last_sign_in_at,
        };
      });

      return jsonResponse(req, 200, { users: result });
    } catch (err) {
      console.error("Unexpected error listing users:", err);
      return jsonResponse(req, 500, { error: "Internal server error" });
    }
  }

  // POST — invite a new user
  if (req.method === "POST") {
    const bodyResult = await requireJsonBody<{ email: string; role: string; first_name?: string; last_name?: string }>(req);
    if ("response" in bodyResult) return bodyResult.response;

    const { email, role, first_name, last_name } = bodyResult.data;

    if (!email || !role) {
      return jsonResponse(req, 400, { error: "email and role are required" });
    }

    if (!["admin", "user"].includes(role)) {
      return jsonResponse(req, 400, { error: "role must be 'admin' or 'user'" });
    }

    try {
      // Invite user via Supabase Auth (sends magic link email)
      const { data: inviteData, error: inviteError } = await supabase.auth.admin.inviteUserByEmail(email, {
        data: {
          first_name: first_name ?? "",
          last_name: last_name ?? "",
        },
      });

      if (inviteError) {
        console.error("Failed to invite user:", inviteError.message);
        // Check for duplicate
        if (inviteError.message.includes("already been registered") || inviteError.message.includes("already exists")) {
          return jsonResponse(req, 409, { error: "A user with this email already exists" });
        }
        return jsonResponse(req, 400, { error: inviteError.message });
      }

      const userId = inviteData.user.id;

      // Create profile
      await supabase.from("profiles").upsert({
        user_id: userId,
        first_name: first_name ?? null,
        last_name: last_name ?? null,
      }, { onConflict: "user_id" });

      // Assign role
      await supabase.from("user_roles").upsert({
        user_id: userId,
        role,
      }, { onConflict: "user_id" });

      return jsonResponse(req, 201, {
        user: {
          id: userId,
          email,
          first_name: first_name ?? null,
          last_name: last_name ?? null,
          role,
        },
      });
    } catch (err) {
      console.error("Unexpected error inviting user:", err);
      return jsonResponse(req, 500, { error: "Internal server error" });
    }
  }

  // PATCH — update a user's role
  if (req.method === "PATCH") {
    const bodyResult = await requireJsonBody<{ user_id: string; role: string }>(req);
    if ("response" in bodyResult) return bodyResult.response;

    const { user_id, role } = bodyResult.data;

    if (!user_id || !role) {
      return jsonResponse(req, 400, { error: "user_id and role are required" });
    }

    if (!["admin", "user"].includes(role)) {
      return jsonResponse(req, 400, { error: "role must be 'admin' or 'user'" });
    }

    // Prevent removing your own admin role
    if (user_id === authResult.context.user.id && role !== "admin") {
      return jsonResponse(req, 400, { error: "You cannot remove your own admin role" });
    }

    try {
      const { error } = await supabase
        .from("user_roles")
        .upsert({ user_id, role }, { onConflict: "user_id" });

      if (error) {
        console.error("Failed to update role:", error.message);
        return jsonResponse(req, 500, { error: "Failed to update role" });
      }

      return jsonResponse(req, 200, { success: true });
    } catch (err) {
      console.error("Unexpected error updating role:", err);
      return jsonResponse(req, 500, { error: "Internal server error" });
    }
  }

  // DELETE — remove a user
  if (req.method === "DELETE") {
    const bodyResult = await requireJsonBody<{ user_id: string }>(req);
    if ("response" in bodyResult) return bodyResult.response;

    const { user_id } = bodyResult.data;

    if (!user_id) {
      return jsonResponse(req, 400, { error: "user_id is required" });
    }

    // Prevent deleting yourself
    if (user_id === authResult.context.user.id) {
      return jsonResponse(req, 400, { error: "You cannot delete your own account" });
    }

    try {
      // Remove role
      await supabase.from("user_roles").delete().eq("user_id", user_id);

      // Remove profile
      await supabase.from("profiles").delete().eq("user_id", user_id);

      // Delete auth user
      const { error } = await supabase.auth.admin.deleteUser(user_id);
      if (error) {
        console.error("Failed to delete user:", error.message);
        return jsonResponse(req, 500, { error: "Failed to delete user" });
      }

      return jsonResponse(req, 200, { success: true });
    } catch (err) {
      console.error("Unexpected error deleting user:", err);
      return jsonResponse(req, 500, { error: "Internal server error" });
    }
  }

  return jsonResponse(req, 405, { error: "Method not allowed" });
});
