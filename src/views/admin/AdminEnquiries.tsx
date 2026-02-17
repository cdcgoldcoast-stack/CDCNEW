import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { useAdminPageAccess } from "@/hooks/useAdminPageAccess";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { format } from "date-fns";
import { Eye, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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

interface Enquiry {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  suburb: string | null;
  state: string | null;
  postcode: string | null;
  renovations: string[] | null;
  budget: string | null;
  timeline: string | null;
  status: string | null;
  created_at: string;
}

const statusColors: Record<string, string> = {
  new: "bg-blue-100 text-blue-800",
  contacted: "bg-yellow-100 text-yellow-800",
  qualified: "bg-green-100 text-green-800",
  closed: "bg-gray-100 text-gray-800",
};

const budgetLabels: Record<string, string> = {
  "5-20": "$5k – $20k",
  "20-40": "$20k – $40k",
  "40-80": "$40k – $80k",
  "80+": "$80k+",
  unsure: "Unsure",
  flexible: "Flexible",
};

const timelineLabels: Record<string, string> = {
  immediately: "Ready to start",
  "30-days": "In the next 30 days",
  "90-days": "Within 90 days",
  exploring: "Just exploring",
};

const renovationLabels: Record<string, string> = {
  bathroom: "Bathroom",
  kitchen: "Kitchen",
  "full-house": "Full House Living",
  other: "Other Parts of the House",
};

const AdminEnquiries = () => {
  const { user, isAuthorized, isCheckingAccess } = useAdminPageAccess();

  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loadingEnquiries, setLoadingEnquiries] = useState(true);
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);
  const [enquiryToDelete, setEnquiryToDelete] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthorized && user) {
      fetchEnquiries();
    }
  }, [isAuthorized, user]);

  const fetchEnquiries = async () => {
    try {
      const { data, error } = await supabase
        .from("enquiries")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setEnquiries(data || []);
    } catch (error) {
      console.error("Error fetching enquiries:", error);
      toast.error("Failed to load enquiries");
    } finally {
      setLoadingEnquiries(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from("enquiries")
        .update({ status })
        .eq("id", id);

      if (error) throw error;

      setEnquiries((prev) =>
        prev.map((e) => (e.id === id ? { ...e, status } : e))
      );

      toast.success("Status updated");
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
    }
  };

  const deleteEnquiry = async (id: string) => {
    try {
      const { error } = await supabase.from("enquiries").delete().eq("id", id);
      if (error) throw error;

      setEnquiries((prev) => prev.filter((e) => e.id !== id));
      setSelectedEnquiry(null);
      setEnquiryToDelete(null);
      toast.success("Enquiry deleted");
    } catch (error) {
      console.error("Error deleting enquiry:", error);
      toast.error("Failed to delete enquiry");
    }
  };

  if (isCheckingAccess) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-foreground/60">Loading...</p>
      </div>
    );
  }

  return (
    <>
      <SEO title="Admin - Enquiries" noIndex={true} />
      <AdminLayout>
        <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-serif italic text-3xl text-primary mb-2">
            Enquiries
          </h1>
          <p className="text-foreground/60">
            Manage quote requests from potential clients.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-card border border-border p-4 rounded-lg">
            <p className="text-sm text-foreground/60 mb-1">Total</p>
            <p className="text-2xl font-serif text-primary">{enquiries.length}</p>
          </div>
          <div className="bg-card border border-border p-4 rounded-lg">
            <p className="text-sm text-foreground/60 mb-1">New</p>
            <p className="text-2xl font-serif text-blue-600">
              {enquiries.filter((e) => e.status === "new").length}
            </p>
          </div>
          <div className="bg-card border border-border p-4 rounded-lg">
            <p className="text-sm text-foreground/60 mb-1">Contacted</p>
            <p className="text-2xl font-serif text-yellow-600">
              {enquiries.filter((e) => e.status === "contacted").length}
            </p>
          </div>
          <div className="bg-card border border-border p-4 rounded-lg">
            <p className="text-sm text-foreground/60 mb-1">Qualified</p>
            <p className="text-2xl font-serif text-green-600">
              {enquiries.filter((e) => e.status === "qualified").length}
            </p>
          </div>
        </div>

        {/* Enquiries Table */}
        {loadingEnquiries ? (
          <p className="text-foreground/60">Loading enquiries...</p>
        ) : enquiries.length === 0 ? (
          <div className="text-center py-12 bg-card border border-border rounded-lg">
            <p className="text-foreground/60">No enquiries yet.</p>
          </div>
        ) : (
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left px-4 py-3 text-sm font-medium text-foreground/60">
                      Name
                    </th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-foreground/60">
                      Contact
                    </th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-foreground/60">
                      Renovations
                    </th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-foreground/60">
                      Budget
                    </th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-foreground/60">
                      Timeline
                    </th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-foreground/60">
                      Status
                    </th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-foreground/60">
                      Date
                    </th>
                    <th className="text-right px-4 py-3 text-sm font-medium text-foreground/60">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {enquiries.map((enquiry) => (
                    <tr key={enquiry.id} className="hover:bg-muted/30">
                      <td className="px-4 py-4">
                        <p className="font-medium text-foreground">
                          {enquiry.full_name}
                        </p>
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-sm text-foreground">{enquiry.email}</p>
                        <p className="text-sm text-foreground/60">
                          {enquiry.phone}
                        </p>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex flex-wrap gap-1">
                          {enquiry.renovations?.map((r) => (
                            <Badge key={r} variant="secondary" className="text-xs">
                              {renovationLabels[r] || r}
                            </Badge>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-foreground">
                        {enquiry.budget
                          ? budgetLabels[enquiry.budget] || enquiry.budget
                          : "-"}
                      </td>
                      <td className="px-4 py-4 text-sm text-foreground">
                        {enquiry.timeline
                          ? timelineLabels[enquiry.timeline] || enquiry.timeline
                          : "-"}
                      </td>
                      <td className="px-4 py-4">
                        <Select
                          value={enquiry.status ?? undefined}
                          onValueChange={(value) =>
                            updateStatus(enquiry.id, value)
                          }
                        >
                          <SelectTrigger className="w-32 h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="new">New</SelectItem>
                            <SelectItem value="contacted">Contacted</SelectItem>
                            <SelectItem value="qualified">Qualified</SelectItem>
                            <SelectItem value="closed">Closed</SelectItem>
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="px-4 py-4 text-sm text-foreground/60">
                        {format(new Date(enquiry.created_at), "MMM d, yyyy")}
                      </td>
                      <td className="px-4 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedEnquiry(enquiry)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setEnquiryToDelete(enquiry.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Detail Dialog */}
        <Dialog
          open={!!selectedEnquiry}
          onOpenChange={() => setSelectedEnquiry(null)}
        >
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="font-serif italic text-xl text-primary">
                Enquiry Details
              </DialogTitle>
            </DialogHeader>
            {selectedEnquiry && (
              <div className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-foreground/60">Name</p>
                    <p className="font-medium">{selectedEnquiry.full_name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-foreground/60">Email</p>
                    <p className="font-medium">{selectedEnquiry.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-foreground/60">Phone</p>
                    <p className="font-medium">{selectedEnquiry.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-foreground/60">Location</p>
                    <p className="font-medium">
                      {[
                        selectedEnquiry.suburb,
                        selectedEnquiry.state,
                        selectedEnquiry.postcode,
                      ]
                        .filter(Boolean)
                        .join(", ") || "-"}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-foreground/60 mb-2">Renovations</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedEnquiry.renovations?.map((r) => (
                      <Badge key={r} variant="secondary">
                        {renovationLabels[r] || r}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-foreground/60">Timeline</p>
                  <p className="font-medium">
                    {selectedEnquiry.timeline
                      ? timelineLabels[selectedEnquiry.timeline] ||
                        selectedEnquiry.timeline
                      : "-"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-foreground/60">Budget</p>
                  <p className="font-medium">
                    {selectedEnquiry.budget
                      ? budgetLabels[selectedEnquiry.budget] ||
                        selectedEnquiry.budget
                      : "-"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-foreground/60">Submitted</p>
                  <p className="font-medium">
                    {format(
                      new Date(selectedEnquiry.created_at),
                      "MMMM d, yyyy 'at' h:mm a"
                    )}
                  </p>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={!!enquiryToDelete} onOpenChange={(open) => !open && setEnquiryToDelete(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Enquiry</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this enquiry? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => enquiryToDelete && deleteEnquiry(enquiryToDelete)}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AdminLayout>
    </>
  );
};

export default AdminEnquiries;
