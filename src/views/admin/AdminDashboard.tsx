"use client";

import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import InviteUserDialog from "@/components/admin/InviteUserDialog";
import { useAdminPageAccess } from "@/hooks/useAdminPageAccess";
import { useAuth } from "@/hooks/useAuth";
import { Badge } from "@/components/ui/badge";
import SEO from "@/components/SEO";
import {
  Phone,
  Mail,
  AlertCircle,
  MessageSquare,
  MessageCircle,
  Gift,
  ArrowRight,
} from "lucide-react";

/* -------------------------------------------------------------------------- */
/*  Types                                                                     */
/* -------------------------------------------------------------------------- */

type LeadSource = "enquiry" | "chat" | "popup" | "referral";

interface UnifiedActivity {
  id: string;
  source: LeadSource;
  name: string;
  phone: string;
  email: string | null;
  status: string;
  created_at: string;
}

interface WeekStats {
  total: number;
  new: number;
  contacted: number;
  qualified: number;
  contactedPercent: number;
  qualifiedPercent: number;
}

/* -------------------------------------------------------------------------- */
/*  Constants                                                                 */
/* -------------------------------------------------------------------------- */

const sourceLabels: Record<LeadSource, string> = {
  enquiry: "Form",
  chat: "Chat",
  popup: "Popup",
  referral: "Referral",
};

const sourceColors: Record<LeadSource, string> = {
  enquiry: "bg-primary/10 text-primary",
  chat: "bg-purple-100 text-purple-800",
  popup: "bg-amber-100 text-amber-800",
  referral: "bg-teal-100 text-teal-800",
};

const SourceIcon = ({ source }: { source: LeadSource }) => {
  if (source === "enquiry") return <MessageSquare className="w-3 h-3" />;
  if (source === "chat") return <MessageCircle className="w-3 h-3" />;
  if (source === "referral") return <Gift className="w-3 h-3" />;
  return <Gift className="w-3 h-3" />;
};

const FOLLOW_UP_DAYS = 2;

/* -------------------------------------------------------------------------- */
/*  Dashboard                                                                 */
/* -------------------------------------------------------------------------- */

const AdminDashboard = () => {
  const { isAuthorized, isCheckingAccess } = useAdminPageAccess();
  const { isAdmin } = useAuth();

  const [weekStats, setWeekStats] = useState<WeekStats>({
    total: 0,
    new: 0,
    contacted: 0,
    qualified: 0,
    contactedPercent: 0,
    qualifiedPercent: 0,
  });
  const [needsFollowUp, setNeedsFollowUp] = useState<UnifiedActivity[]>([]);
  const [recentLeads, setRecentLeads] = useState<UnifiedActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthorized) return;

    const load = async () => {
      const now = Date.now();
      const weekAgoIso = new Date(now - 7 * 24 * 60 * 60 * 1000).toISOString();
      const staleCutoffIso = new Date(now - FOLLOW_UP_DAYS * 24 * 60 * 60 * 1000).toISOString();

      const [
        enquiriesWeek,
        chatWeek,
        popupWeek,
        referralsWeek,
        staleEnquiries,
        staleChat,
        staleReferrals,
        recentEnquiries,
        recentChat,
        recentPopup,
        recentReferrals,
      ] = await Promise.all([
        supabase.from("enquiries").select("id, status").gte("created_at", weekAgoIso),
        supabase.from("chat_inquiries").select("id, status").gte("created_at", weekAgoIso),
        supabase.from("popup_responses").select("id, status").gte("created_at", weekAgoIso),
        supabase.from("referrals").select("id, status").gte("created_at", weekAgoIso),
        supabase
          .from("enquiries")
          .select("id, full_name, phone, email, status, created_at")
          .eq("status", "new")
          .lt("created_at", staleCutoffIso)
          .order("created_at", { ascending: true })
          .limit(10),
        supabase
          .from("chat_inquiries")
          .select("id, name, phone, email, status, created_at")
          .eq("status", "new")
          .lt("created_at", staleCutoffIso)
          .order("created_at", { ascending: true })
          .limit(10),
        supabase
          .from("referrals")
          .select("id, referral_name, referral_phone, referral_email, status, created_at")
          .eq("status", "new")
          .lt("created_at", staleCutoffIso)
          .order("created_at", { ascending: true })
          .limit(10),
        supabase
          .from("enquiries")
          .select("id, full_name, phone, email, status, created_at")
          .order("created_at", { ascending: false })
          .limit(8),
        supabase
          .from("chat_inquiries")
          .select("id, name, phone, email, status, created_at")
          .order("created_at", { ascending: false })
          .limit(8),
        supabase
          .from("popup_responses")
          .select("id, name, phone, status, created_at")
          .order("created_at", { ascending: false })
          .limit(8),
        supabase
          .from("referrals")
          .select("id, referral_name, referral_phone, referral_email, status, created_at")
          .order("created_at", { ascending: false })
          .limit(8),
      ]);

      // Build week stats — chat's "converted" is counted as "qualified"
      const weekRows = [
        ...((enquiriesWeek.data as { status: string | null }[]) ?? []),
        ...((chatWeek.data as { status: string | null }[]) ?? []),
        ...((popupWeek.data as { status: string | null }[]) ?? []),
        ...((referralsWeek.data as { status: string | null }[]) ?? []),
      ];
      const normalize = (s: string | null) => (s === "converted" ? "qualified" : s || "new");
      const wTotal = weekRows.length;
      const wNew = weekRows.filter((r) => normalize(r.status) === "new").length;
      const wContacted = weekRows.filter((r) => normalize(r.status) === "contacted").length;
      const wQualified = weekRows.filter((r) => normalize(r.status) === "qualified").length;
      setWeekStats({
        total: wTotal,
        new: wNew,
        contacted: wContacted,
        qualified: wQualified,
        contactedPercent: wTotal > 0 ? Math.round((wContacted / wTotal) * 100) : 0,
        qualifiedPercent: wTotal > 0 ? Math.round((wQualified / wTotal) * 100) : 0,
      });

      // Build "needs follow-up" list (oldest first, across all indexed sources)
      const stale: UnifiedActivity[] = [
        ...((staleEnquiries.data as { id: string; full_name: string; phone: string; email: string; status: string; created_at: string }[]) ?? []).map(
          (r) => ({
            id: r.id,
            source: "enquiry" as LeadSource,
            name: r.full_name,
            phone: r.phone,
            email: r.email,
            status: r.status,
            created_at: r.created_at,
          })
        ),
        ...((staleChat.data as { id: string; name: string; phone: string; email: string | null; status: string; created_at: string }[]) ?? []).map(
          (r) => ({
            id: r.id,
            source: "chat" as LeadSource,
            name: r.name,
            phone: r.phone,
            email: r.email,
            status: r.status,
            created_at: r.created_at,
          })
        ),
        ...((staleReferrals.data as { id: string; referral_name: string; referral_phone: string; referral_email: string | null; status: string; created_at: string }[]) ?? []).map(
          (r) => ({
            id: r.id,
            source: "referral" as LeadSource,
            name: r.referral_name,
            phone: r.referral_phone,
            email: r.referral_email,
            status: r.status,
            created_at: r.created_at,
          })
        ),
      ].sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
      setNeedsFollowUp(stale);

      // Build unified recent leads stream
      const recent: UnifiedActivity[] = [
        ...((recentEnquiries.data as { id: string; full_name: string; phone: string; email: string; status: string; created_at: string }[]) ?? []).map(
          (r) => ({
            id: r.id,
            source: "enquiry" as LeadSource,
            name: r.full_name,
            phone: r.phone,
            email: r.email,
            status: r.status,
            created_at: r.created_at,
          })
        ),
        ...((recentChat.data as { id: string; name: string; phone: string; email: string | null; status: string; created_at: string }[]) ?? []).map(
          (r) => ({
            id: r.id,
            source: "chat" as LeadSource,
            name: r.name,
            phone: r.phone,
            email: r.email,
            status: r.status,
            created_at: r.created_at,
          })
        ),
        ...((recentPopup.data as { id: string; name: string; phone: string; status: string; created_at: string }[]) ?? []).map(
          (r) => ({
            id: r.id,
            source: "popup" as LeadSource,
            name: r.name,
            phone: r.phone,
            email: null,
            status: r.status,
            created_at: r.created_at,
          })
        ),
        ...((recentReferrals.data as { id: string; referral_name: string; referral_phone: string; referral_email: string | null; status: string; created_at: string }[]) ?? []).map(
          (r) => ({
            id: r.id,
            source: "referral" as LeadSource,
            name: r.referral_name,
            phone: r.referral_phone,
            email: r.referral_email,
            status: r.status,
            created_at: r.created_at,
          })
        ),
      ]
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 8);
      setRecentLeads(recent);

      setLoading(false);
    };

    load();
  }, [isAuthorized]);

  const weekStatCards = useMemo(
    () => [
      {
        label: "This week",
        value: weekStats.total,
        hint: "Leads received",
        color: "text-foreground",
      },
      {
        label: "Still new",
        value: weekStats.new,
        hint: "Awaiting contact",
        color: "text-blue-700",
      },
      {
        label: "Contacted",
        value: weekStats.contacted,
        hint: `${weekStats.contactedPercent}% of this week`,
        color: "text-yellow-700",
      },
      {
        label: "Qualified",
        value: weekStats.qualified,
        hint: `${weekStats.qualifiedPercent}% of this week`,
        color: "text-green-700",
      },
    ],
    [weekStats]
  );

  if (isCheckingAccess) {
    return (
      <AdminLayout>
        <p className="text-foreground/60">Loading...</p>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <SEO title="Admin - Dashboard" noIndex={true} />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="font-serif italic text-3xl text-foreground">Dashboard</h1>
          <p className="text-sm text-foreground/60 mt-1">Last 7 days across every lead source.</p>
        </div>
        {isAdmin && <InviteUserDialog />}
      </div>

      {/* Week funnel */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {weekStatCards.map((stat) => (
          <Link
            key={stat.label}
            to="/admin/leads"
            className="bg-card border border-border rounded-xl p-5 hover:border-primary/30 transition-colors"
          >
            <p className={`text-3xl font-serif ${stat.color}`}>
              {loading ? "—" : stat.value}
            </p>
            <p className="text-sm text-foreground/60 mt-1">{stat.label}</p>
            <p className="text-xs text-foreground/40 mt-0.5">{stat.hint}</p>
          </Link>
        ))}
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Needs follow-up (spans 1 col) */}
        <div className="bg-card border border-border rounded-xl p-5 lg:col-span-1">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-destructive" />
              <h2 className="text-sm font-medium text-foreground">Needs follow-up</h2>
            </div>
            {needsFollowUp.length > 0 && (
              <Badge className="bg-destructive/10 text-destructive border-0">
                {needsFollowUp.length}
              </Badge>
            )}
          </div>
          <p className="text-xs text-foreground/50 mb-4">
            New leads older than {FOLLOW_UP_DAYS} days.
          </p>
          {loading ? (
            <p className="text-sm text-foreground/60">Loading…</p>
          ) : needsFollowUp.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-sm text-foreground/60">All caught up.</p>
              <p className="text-xs text-foreground/40 mt-1">No stale leads waiting.</p>
            </div>
          ) : (
            <ul className="space-y-3">
              {needsFollowUp.slice(0, 6).map((lead) => (
                <li key={`${lead.source}-${lead.id}`} className="flex items-start gap-3">
                  <Badge className={`${sourceColors[lead.source]} gap-1 border-0 mt-0.5 shrink-0`}>
                    <SourceIcon source={lead.source} />
                  </Badge>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground truncate">{lead.name}</p>
                    <div className="flex flex-wrap gap-x-2 mt-0.5">
                      <a
                        href={`tel:${lead.phone}`}
                        className="text-xs text-foreground/60 hover:text-primary inline-flex items-center gap-1"
                      >
                        <Phone className="w-3 h-3" /> {lead.phone}
                      </a>
                    </div>
                    <p className="text-xs text-foreground/40 mt-0.5">
                      {formatDistanceToNow(new Date(lead.created_at), { addSuffix: true })}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
          {needsFollowUp.length > 6 && (
            <Link
              to="/admin/leads?status=new"
              className="flex items-center gap-1 text-xs text-primary hover:underline mt-4"
            >
              View all {needsFollowUp.length} <ArrowRight className="w-3 h-3" />
            </Link>
          )}
        </div>

        {/* Recent leads (spans 2 cols) */}
        <div className="bg-card border border-border rounded-xl p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-medium text-foreground">Recent leads</h2>
            <Link to="/admin/leads" className="text-xs text-primary hover:underline">
              View all
            </Link>
          </div>
          {loading ? (
            <p className="text-sm text-foreground/60">Loading…</p>
          ) : recentLeads.length === 0 ? (
            <p className="text-sm text-foreground/60">No leads yet.</p>
          ) : (
            <ul className="divide-y divide-border">
              {recentLeads.map((lead) => (
                <li key={`${lead.source}-${lead.id}`} className="py-3 first:pt-0 last:pb-0">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0 flex-1">
                      <Badge className={`${sourceColors[lead.source]} gap-1 border-0 mt-0.5 shrink-0`}>
                        <SourceIcon source={lead.source} />
                        {sourceLabels[lead.source]}
                      </Badge>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-foreground truncate">{lead.name}</p>
                        <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-0.5">
                          <a
                            href={`tel:${lead.phone}`}
                            className="text-xs text-foreground/60 hover:text-primary inline-flex items-center gap-1"
                          >
                            <Phone className="w-3 h-3" /> {lead.phone}
                          </a>
                          {lead.email && (
                            <a
                              href={`mailto:${lead.email}`}
                              className="text-xs text-foreground/60 hover:text-primary inline-flex items-center gap-1 truncate"
                            >
                              <Mail className="w-3 h-3" /> {lead.email}
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xs text-foreground/60 whitespace-nowrap">
                        {formatDistanceToNow(new Date(lead.created_at), { addSuffix: true })}
                      </p>
                      <p className="text-xs text-foreground/40 mt-0.5 capitalize">
                        {lead.status === "converted" ? "Qualified" : lead.status}
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
