"use client";

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { useAdminPageAccess } from "@/hooks/useAdminPageAccess";
import {
  MessageSquare,
  MessageCircle,
  FolderOpen,
  Users,
  ArrowRight,
  TrendingUp,
} from "lucide-react";

interface DashboardStats {
  enquiries: { total: number; new: number };
  chatInquiries: { total: number; new: number };
  popupResponses: { total: number; thisWeek: number };
  projects: { total: number };
}

const AdminDashboard = () => {
  const { isAuthorized, isCheckingAccess } = useAdminPageAccess();
  const [stats, setStats] = useState<DashboardStats>({
    enquiries: { total: 0, new: 0 },
    chatInquiries: { total: 0, new: 0 },
    popupResponses: { total: 0, thisWeek: 0 },
    projects: { total: 0 },
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthorized) return;

    const fetchStats = async () => {
      try {
        const [enquiriesRes, chatRes, popupRes, projectsRes] = await Promise.all([
          supabase.from("enquiries").select("id, status", { count: "exact" }),
          supabase.from("chat_inquiries").select("id, status", { count: "exact" }),
          supabase.from("popup_responses").select("id, created_at", { count: "exact" }),
          supabase.from("projects").select("id", { count: "exact" }),
        ]);

        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);

        setStats({
          enquiries: {
            total: enquiriesRes.count ?? 0,
            new: enquiriesRes.data?.filter((e) => e.status === "new").length ?? 0,
          },
          chatInquiries: {
            total: chatRes.count ?? 0,
            new: chatRes.data?.filter((c) => c.status === "new").length ?? 0,
          },
          popupResponses: {
            total: popupRes.count ?? 0,
            thisWeek: popupRes.data?.filter(
              (p) => new Date(p.created_at) >= weekAgo
            ).length ?? 0,
          },
          projects: {
            total: projectsRes.count ?? 0,
          },
        });
      } catch (err) {
        console.error("Error fetching dashboard stats:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [isAuthorized]);

  if (isCheckingAccess) {
    return (
      <AdminLayout>
        <p className="text-foreground/60">Loading...</p>
      </AdminLayout>
    );
  }

  const cards = [
    {
      title: "Enquiries",
      icon: MessageSquare,
      total: stats.enquiries.total,
      highlight: stats.enquiries.new,
      highlightLabel: "new",
      href: "/admin/enquiries",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Chat Inquiries",
      icon: MessageCircle,
      total: stats.chatInquiries.total,
      highlight: stats.chatInquiries.new,
      highlightLabel: "new",
      href: "/admin/chat-inquiries",
      color: "text-violet-600",
      bgColor: "bg-violet-50",
    },
    {
      title: "Pop-up Responses",
      icon: Users,
      total: stats.popupResponses.total,
      highlight: stats.popupResponses.thisWeek,
      highlightLabel: "this week",
      href: "/admin/popup-responses",
      color: "text-amber-600",
      bgColor: "bg-amber-50",
    },
    {
      title: "Projects",
      icon: FolderOpen,
      total: stats.projects.total,
      highlight: null,
      highlightLabel: "",
      href: "/admin/projects",
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
    },
  ];

  return (
    <AdminLayout>
      <div>
        <div className="mb-8">
          <h1 className="font-serif italic text-3xl text-primary mb-2">Dashboard</h1>
          <p className="text-foreground/60">Overview of your site activity.</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 animate-pulse">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-card border border-border rounded-xl p-6 h-36" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {cards.map((card) => (
              <Link
                key={card.href}
                to={card.href}
                className="bg-card border border-border rounded-xl p-6 hover:border-primary/30 hover:shadow-sm transition-all group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-10 h-10 rounded-lg ${card.bgColor} flex items-center justify-center`}>
                    <card.icon className={`w-5 h-5 ${card.color}`} />
                  </div>
                  <ArrowRight className="w-4 h-4 text-foreground/30 group-hover:text-primary transition-colors" />
                </div>
                <p className="text-2xl font-serif text-foreground mb-1">{card.total}</p>
                <p className="text-sm text-foreground/60">{card.title}</p>
                {card.highlight !== null && card.highlight > 0 && (
                  <div className="mt-3 flex items-center gap-1.5">
                    <TrendingUp className={`w-3.5 h-3.5 ${card.color}`} />
                    <span className={`text-xs font-medium ${card.color}`}>
                      {card.highlight} {card.highlightLabel}
                    </span>
                  </div>
                )}
              </Link>
            ))}
          </div>
        )}

        {/* Quick links */}
        <div className="mt-10">
          <h2 className="text-sm font-medium uppercase tracking-wider text-foreground/50 mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              { label: "Manage Projects", href: "/admin/projects", desc: "Add or edit portfolio projects" },
              { label: "Gallery", href: "/admin/gallery", desc: "Update the image gallery" },
              { label: "Site Images", href: "/admin/site-images", desc: "Manage hero and section images" },
              { label: "Image Assets", href: "/admin/image-assets", desc: "Override default image assets" },
              { label: "Settings", href: "/admin/settings", desc: "Account and site settings" },
              { label: "View Site", href: "/", desc: "Open the live website" },
            ].map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="flex items-center justify-between gap-3 px-4 py-3 rounded-lg border border-border hover:bg-muted/50 transition-colors group"
              >
                <div>
                  <p className="text-sm font-medium text-foreground">{link.label}</p>
                  <p className="text-xs text-foreground/50">{link.desc}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-foreground/30 group-hover:text-primary flex-shrink-0 transition-colors" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
