"use client";

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import InviteUserDialog from "@/components/admin/InviteUserDialog";
import { useAdminPageAccess } from "@/hooks/useAdminPageAccess";
import { useAuth } from "@/hooks/useAuth";
import SEO from "@/components/SEO";

interface Counts {
  newEnquiries: number;
  newChatLeads: number;
  popupResponses: number;
  enquiriesThisWeek: number;
}

interface RecentEnquiry {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  status: string | null;
  created_at: string;
}

interface RecentChat {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  status: string;
  created_at: string;
}

const AdminDashboard = () => {
  const { isAuthorized, isCheckingAccess } = useAdminPageAccess();
  const { isAdmin } = useAuth();
  const [counts, setCounts] = useState<Counts>({
    newEnquiries: 0,
    newChatLeads: 0,
    popupResponses: 0,
    enquiriesThisWeek: 0,
  });
  const [recentEnquiries, setRecentEnquiries] = useState<RecentEnquiry[]>([]);
  const [recentChats, setRecentChats] = useState<RecentChat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthorized) return;

    const load = async () => {
      const weekAgoIso = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

      const [newEq, newCi, popup, weekEq, recentEq, recentCi] = await Promise.all([
        supabase
          .from("enquiries")
          .select("id", { count: "exact", head: true })
          .eq("status", "new"),
        supabase
          .from("chat_inquiries")
          .select("id", { count: "exact", head: true })
          .eq("status", "new"),
        supabase
          .from("popup_responses")
          .select("id", { count: "exact", head: true }),
        supabase
          .from("enquiries")
          .select("id", { count: "exact", head: true })
          .gte("created_at", weekAgoIso),
        supabase
          .from("enquiries")
          .select("id, full_name, email, phone, status, created_at")
          .order("created_at", { ascending: false })
          .limit(5),
        supabase
          .from("chat_inquiries")
          .select("id, name, phone, email, status, created_at")
          .order("created_at", { ascending: false })
          .limit(5),
      ]);

      setCounts({
        newEnquiries: newEq.count ?? 0,
        newChatLeads: newCi.count ?? 0,
        popupResponses: popup.count ?? 0,
        enquiriesThisWeek: weekEq.count ?? 0,
      });
      setRecentEnquiries((recentEq.data as RecentEnquiry[]) ?? []);
      setRecentChats((recentCi.data as RecentChat[]) ?? []);
      setLoading(false);
    };

    load();
  }, [isAuthorized]);

  if (isCheckingAccess) {
    return (
      <AdminLayout>
        <p className="text-foreground/60">Loading...</p>
      </AdminLayout>
    );
  }

  const stats = [
    { label: "New enquiries", value: counts.newEnquiries, href: "/admin/leads" },
    { label: "New chat leads", value: counts.newChatLeads, href: "/admin/leads" },
    { label: "Enquiries this week", value: counts.enquiriesThisWeek, href: "/admin/leads" },
    { label: "Pop-up responses", value: counts.popupResponses, href: "/admin/leads" },
  ];

  return (
    <AdminLayout>
      <SEO title="Admin - Dashboard" noIndex={true} />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <h1 className="font-serif italic text-3xl text-foreground">Dashboard</h1>
        {isAdmin && <InviteUserDialog />}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            to={stat.href}
            className="bg-card border border-border rounded-xl p-5 hover:border-primary/30 transition-colors"
          >
            <p className="text-3xl font-serif text-foreground">
              {loading ? "—" : stat.value}
            </p>
            <p className="text-sm text-foreground/60 mt-1">{stat.label}</p>
          </Link>
        ))}
      </div>

      {/* Recent activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-medium text-foreground">Latest enquiries</h2>
            <Link to="/admin/leads" className="text-xs text-primary hover:underline">
              View all
            </Link>
          </div>
          {loading ? (
            <p className="text-sm text-foreground/60">Loading...</p>
          ) : recentEnquiries.length === 0 ? (
            <p className="text-sm text-foreground/60">No enquiries yet.</p>
          ) : (
            <ul className="divide-y divide-border">
              {recentEnquiries.map((e) => (
                <li key={e.id} className="py-3 first:pt-0 last:pb-0">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-foreground truncate">
                        {e.full_name}
                      </p>
                      <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-0.5">
                        <a
                          href={`mailto:${e.email}`}
                          className="text-xs text-foreground/60 hover:text-primary truncate"
                        >
                          {e.email}
                        </a>
                        <a
                          href={`tel:${e.phone}`}
                          className="text-xs text-foreground/60 hover:text-primary"
                        >
                          {e.phone}
                        </a>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xs text-foreground/60">
                        {formatDistanceToNow(new Date(e.created_at), { addSuffix: true })}
                      </p>
                      {e.status && (
                        <p className="text-xs text-foreground/40 mt-0.5 capitalize">
                          {e.status}
                        </p>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-medium text-foreground">Latest chat leads</h2>
            <Link to="/admin/leads" className="text-xs text-primary hover:underline">
              View all
            </Link>
          </div>
          {loading ? (
            <p className="text-sm text-foreground/60">Loading...</p>
          ) : recentChats.length === 0 ? (
            <p className="text-sm text-foreground/60">No chat leads yet.</p>
          ) : (
            <ul className="divide-y divide-border">
              {recentChats.map((c) => (
                <li key={c.id} className="py-3 first:pt-0 last:pb-0">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-foreground truncate">
                        {c.name}
                      </p>
                      <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-0.5">
                        {c.phone && (
                          <a
                            href={`tel:${c.phone}`}
                            className="text-xs text-foreground/60 hover:text-primary"
                          >
                            {c.phone}
                          </a>
                        )}
                        {c.email && (
                          <a
                            href={`mailto:${c.email}`}
                            className="text-xs text-foreground/60 hover:text-primary truncate"
                          >
                            {c.email}
                          </a>
                        )}
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xs text-foreground/60">
                        {formatDistanceToNow(new Date(c.created_at), { addSuffix: true })}
                      </p>
                      <p className="text-xs text-foreground/40 mt-0.5 capitalize">
                        {c.status}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
