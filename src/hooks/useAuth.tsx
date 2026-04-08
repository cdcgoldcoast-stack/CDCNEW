import { useEffect, useState } from "react";
import { type Session, type User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

export type AppRole = Database["public"]["Enums"]["app_role"];

const DEFAULT_ROLE: AppRole = "user";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [role, setRole] = useState<AppRole>(DEFAULT_ROLE);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, sessionValue) => {
        setSession(sessionValue);
        setUser(sessionValue?.user ?? null);

        if (sessionValue?.user) {
          setLoading(true);
          setTimeout(() => {
            checkUserRole(sessionValue.user.id);
          }, 0);
        } else {
          setRole(DEFAULT_ROLE);
          setLoading(false);
        }
      },
    );

    supabase.auth.getSession().then(({ data: { session: sessionValue } }) => {
      setSession(sessionValue);
      setUser(sessionValue?.user ?? null);

      if (sessionValue?.user) {
        setLoading(true);
        checkUserRole(sessionValue.user.id);
      } else {
        setRole(DEFAULT_ROLE);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkUserRole = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId)
        .maybeSingle();

      if (error) {
        console.error("Error checking user role:", error);
        setRole(DEFAULT_ROLE);
      } else {
        setRole((data?.role as AppRole | undefined) ?? DEFAULT_ROLE);
      }
    } catch (err) {
      console.error("Error in role check:", err);
      setRole(DEFAULT_ROLE);
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const isAdmin = role === "admin";
  const isMarketer = role === "marketer";
  const canAccessAdmin = isAdmin || isMarketer;

  return { user, session, role, isAdmin, isMarketer, canAccessAdmin, loading, signOut };
}
