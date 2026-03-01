"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { format } from "date-fns";
import { Phone, MapPin, Calendar, User, ExternalLink, Trash2, Download } from "lucide-react";

interface PopupResponse {
  id: string;
  name: string;
  phone: string;
  source: string;
  page_url: string | null;
  created_at: string;
  user_agent: string | null;
}

const AdminPopupResponses = () => {
  const [responses, setResponses] = useState<PopupResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchResponses();
  }, []);

  const fetchResponses = async () => {
    try {
      const { data, error: supabaseError } = await supabase
        .from("popup_responses")
        .select("*")
        .order("created_at", { ascending: false });

      if (supabaseError) throw supabaseError;
      setResponses(data || []);
    } catch (err) {
      console.error("Error fetching popup responses:", err);
      setError("Failed to load responses. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this response?")) return;

    try {
      const { error: supabaseError } = await supabase
        .from("popup_responses")
        .delete()
        .eq("id", id);

      if (supabaseError) throw supabaseError;
      setResponses(responses.filter((r) => r.id !== id));
    } catch (err) {
      console.error("Error deleting response:", err);
      alert("Failed to delete response");
    }
  };

  const handleExport = () => {
    const csv = [
      ["Name", "Phone", "Source", "Page URL", "Date"],
      ...responses.map((r) => [
        r.name,
        r.phone,
        r.source,
        r.page_url,
        format(new Date(r.created_at), "yyyy-MM-dd HH:mm"),
      ]),
    ]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `popup-responses-${format(new Date(), "yyyy-MM-dd")}.csv`;
    a.click();
  };

  if (loading) {
    return (
      <AdminLayout>
        <p className="text-foreground/60">Loading responses...</p>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div>
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-serif text-foreground">Pop-up Responses</h1>
            <p className="text-sm text-foreground/60 mt-1">
              {responses.length} response{responses.length !== 1 ? "s" : ""} collected
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleExport}
              disabled={responses.length === 0}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm border border-foreground/20 rounded hover:bg-foreground/5 transition-colors disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
            {error}
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-muted p-4 rounded">
            <p className="text-2xl font-serif text-primary">{responses.length}</p>
            <p className="text-xs text-foreground/60 uppercase tracking-wider">Total Responses</p>
          </div>
          <div className="bg-muted p-4 rounded">
            <p className="text-2xl font-serif text-primary">
              {responses.filter((r) => {
                const date = new Date(r.created_at);
                const today = new Date();
                return date.toDateString() === today.toDateString();
              }).length}
            </p>
            <p className="text-xs text-foreground/60 uppercase tracking-wider">Today</p>
          </div>
          <div className="bg-muted p-4 rounded">
            <p className="text-2xl font-serif text-primary">
              {responses.filter((r) => {
                const date = new Date(r.created_at);
                const weekAgo = new Date();
                weekAgo.setDate(weekAgo.getDate() - 7);
                return date >= weekAgo;
              }).length}
            </p>
            <p className="text-xs text-foreground/60 uppercase tracking-wider">This Week</p>
          </div>
          <div className="bg-muted p-4 rounded">
            <p className="text-2xl font-serif text-primary">
              {responses.filter((r) => {
                const date = new Date(r.created_at);
                const monthAgo = new Date();
                monthAgo.setMonth(monthAgo.getMonth() - 1);
                return date >= monthAgo;
              }).length}
            </p>
            <p className="text-xs text-foreground/60 uppercase tracking-wider">This Month</p>
          </div>
        </div>

        {/* Responses List */}
        {responses.length === 0 ? (
          <div className="text-center py-16 bg-muted rounded">
            <p className="text-foreground/60">No responses yet.</p>
            <p className="text-sm text-foreground/40 mt-2">
              Responses will appear here when visitors submit the promotional popup.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {responses.map((response) => (
              <div
                key={response.id}
                className="bg-background border border-foreground/10 rounded-lg p-5 hover:border-foreground/20 transition-colors"
              >
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                  {/* Main Info */}
                  <div className="flex-1">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <User className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium text-foreground">{response.name}</h3>
                        <div className="flex items-center gap-2 text-sm text-foreground/60 mt-1">
                          <Phone className="w-3.5 h-3.5" />
                          <a 
                            href={`tel:${response.phone}`}
                            className="hover:text-primary transition-colors"
                          >
                            {response.phone}
                          </a>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-foreground/50 mt-4">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        {format(new Date(response.created_at), "MMM d, yyyy 'at' h:mm a")}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5" />
                        {response.source}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    {response.page_url && (
                      <a
                        href={response.page_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs border border-foreground/20 rounded hover:bg-foreground/5 transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        Page
                      </a>
                    )}
                    <a
                      href={`tel:${response.phone}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      Call
                    </a>
                    <button
                      onClick={() => handleDelete(response.id)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-red-600 border border-red-200 rounded hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminPopupResponses;
