import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { useAdminPageAccess } from "@/hooks/useAdminPageAccess";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import SEO from "@/components/SEO";
import { toast } from "sonner";
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
  const { user, isAuthorized, isCheckingAccess } = useAdminPageAccess();
  const [responses, setResponses] = useState<PopupResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthorized && user) {
      fetchResponses();
    }
  }, [isAuthorized, user]);

  const fetchResponses = async () => {
    try {
      const { data, error } = await supabase
        .from("popup_responses")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setResponses(data || []);
    } catch (err) {
      console.error("Error fetching popup responses:", err);
      toast.error("Failed to load responses");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from("popup_responses")
        .delete()
        .eq("id", id);

      if (error) throw error;
      setResponses((prev) => prev.filter((r) => r.id !== id));
      setDeleteId(null);
      toast.success("Response deleted");
    } catch (err) {
      console.error("Error deleting response:", err);
      toast.error("Failed to delete response");
    }
  };

  const handleExport = () => {
    const csv = [
      ["Name", "Phone", "Source", "Page URL", "Date"],
      ...responses.map((r) => [
        r.name,
        r.phone,
        r.source,
        r.page_url ?? "",
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

  if (isCheckingAccess) {
    return (
      <AdminLayout>
        <p className="text-foreground/60">Loading...</p>
      </AdminLayout>
    );
  }

  const today = new Date().toDateString();
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  return (
    <AdminLayout>
      <SEO title="Admin - Pop-up Responses" noIndex={true} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="font-serif italic text-3xl text-foreground">Pop-up Responses</h1>
          <p className="text-sm text-foreground/60 mt-1">
            {responses.length} response{responses.length !== 1 ? "s" : ""} collected
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleExport}
          disabled={responses.length === 0}
        >
          <Download className="w-4 h-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total", value: responses.length },
          { label: "Today", value: responses.filter((r) => new Date(r.created_at).toDateString() === today).length },
          { label: "This week", value: responses.filter((r) => new Date(r.created_at) >= weekAgo).length },
          { label: "This month", value: responses.filter((r) => new Date(r.created_at) >= monthAgo).length },
        ].map((stat) => (
          <div key={stat.label} className="bg-card border border-border rounded-lg p-4">
            <p className="text-2xl font-serif text-primary">
              {loading ? "—" : stat.value}
            </p>
            <p className="text-xs text-foreground/60 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Responses */}
      {loading ? (
        <p className="text-foreground/60">Loading responses...</p>
      ) : responses.length === 0 ? (
        <div className="text-center py-16 bg-muted rounded-lg">
          <p className="text-foreground/60">No responses yet.</p>
          <p className="text-sm text-foreground/40 mt-2">
            Responses will appear here when visitors submit the promotional popup.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {responses.map((response) => (
            <div
              key={response.id}
              className="bg-card border border-border rounded-lg p-5 hover:border-primary/20 transition-colors"
            >
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-9 h-9 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                      <User className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{response.name}</p>
                      <div className="flex items-center gap-1.5 text-sm text-foreground/60 mt-0.5">
                        <Phone className="w-3.5 h-3.5" />
                        <a href={`tel:${response.phone}`} className="hover:text-primary transition-colors">
                          {response.phone}
                        </a>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-xs text-foreground/50">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      {format(new Date(response.created_at), "MMM d, yyyy 'at' h:mm a")}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5" />
                      {response.source}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {response.page_url && (
                    <a
                      href={response.page_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs border border-border rounded hover:bg-muted transition-colors"
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
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setDeleteId(response.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Response</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this response? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteId && handleDelete(deleteId)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
};

export default AdminPopupResponses;
